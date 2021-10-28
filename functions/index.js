const functions = require('firebase-functions')
var admin = require('firebase-admin')
var serviceAccount = require('./vue-tennis-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.db_url, //'https://vue-tennis-default-rtdb.firebaseio.com'
})

const db = admin.database()
const fdb = admin.firestore()

exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const time = Date.now()
  const userInfo = {
    email,
    displayName,
    photoURL,
    nickName: displayName,
    sex: '',
    birth: '',
    location: '',
    ntrp: 0,
    createdAt: time,
    updatedAt: time,
    level: email == functions.config().admin.email ? 0 : 5,
    findPeopleList: [],
    applicationList: [],
    participationList: [],
    alertApplicationToggle: false,
    alertParticipationToggle: false,
  }
  await fdb.collection('users').doc(uid).set(userInfo) // set user at Firestore
  await fdb
    .collection('meta')
    .doc('users')
    .update({ createUser: admin.firestore.FieldValue.increment(1) })
  db.ref('users').child(uid).set(userInfo) // set user at RealTime Database
})

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const { uid } = user
  await db.ref('users').child(uid).remove()
  await fdb
    .collection('meta')
    .doc('users')
    .update({ deleteUser: admin.firestore.FieldValue.increment() })
  await fdb.collection('users').doc(uid).delete()
})

// user => new collection => id: new Date toString / scheduleId:xxx, status: n
// [alertList status]
// 1: 신규 게스트 참여 요청
// 2: 참가자 참여 취소
// 3: 게스트 영입
// 4: 게스트 방출

// 게스트 참여 요청
exports.createApplicants = functions.firestore
  .document('findPeople/{scheduleId}/applicants/{applicantsId}')
  .onCreate(async (snap, context) => {
    try {
      const refSchedule = fdb
        .collection('findPeople')
        .doc(context.params.scheduleId)
      const schedule = await refSchedule.get()
      if (!schedule) return
      const organizer = schedule.data().organizer
      const refOrganizer = fdb.collection('users').doc(organizer)
      const refApplicant = fdb
        .collection('users')
        .doc(context.params.applicantsId)
      const batch = fdb.batch()

      // update 참여 신청자의 참여 요청 리스트
      batch.update(refApplicant, {
        applicationList: admin.firestore.FieldValue.arrayUnion(
          context.params.scheduleId,
        ),
      })
      // update 방장의 알림 ON
      batch.update(refOrganizer, {
        alertApplicationToggle: true,
      })
      // set 방장의 알림 리스트
      const createdAt = new Date()
      const id = createdAt.getTime().toString()
      batch.set(
        refOrganizer.collection('FindPeopleAlert').doc(id),
        {
          scheduleId: context.params.scheduleId,
          applicantsId: context.params.applicantsId,
          createdAt: createdAt,
          alertStatus: 1,
        }, // 신규 게스트 참여 요청 알림
      )
      // meta update
      const refMeta = fdb.collection('meta').doc('findPeople')
      batch.update(refMeta, {
        applicantionCount: admin.firestore.FieldValue.increment(1),
      })

      await batch.commit()
    } catch (err) {
      console.log(err)
    }
  })

// 게스트 참여 요청 취소
exports.deleteApplicants = functions.firestore
  .document('findPeople/{scheduleId}/applicants/{applicantsId}')
  .onDelete(async (snap, context) => {
    try {
      const refSchedule = fdb
        .collection('findPeople')
        .doc(context.params.scheduleId)
      const schedule = await refSchedule.get()
      if (!schedule) return
      const organizer = schedule.data().organizer
      const refApplicant = fdb
        .collection('users')
        .doc(context.params.applicantsId)
      const refOrganizer = fdb.collection('users').doc(organizer)

      const batch = fdb.batch()
      // update 참여 신청자의 참여 요청 리스트
      batch.update(refApplicant, {
        applicationList: admin.firestore.FieldValue.arrayRemove(
          context.params.applicantsId,
        ),
      })
      // update 방장의 알림 On
      batch.update(refOrganizer, {
        alertApplicationToggle: true,
      })
      // set 방장의 알림 리스트
      const createdAt = new Date()
      const id = createdAt.getTime().toString()
      batch.set(refOrganizer.collection('FindPeopleAlert').doc(id), {
        scheduleId: context.params.scheduleId,
        applicantsId: context.params.applicantsId,
        createdAt: createdAt,
        alertStatus: 2,
      })
      // meta update
      const refMeta = fdb.collection('meta').doc('findPeople')
      batch.update(refMeta, {
        applicantionCount: admin.firestore.FieldValue.increment(-1),
      })

      await batch.commit()
    } catch (err) {
      console.log(err)
    }
  })

// 영입 및 방출
exports.updateParticipants = functions.firestore
  .document('findPeople/{scheduleId}')
  .onUpdate(async (change, context) => {
    try {
      const nv = change.after.data()
      const nvLen = nv.participants.length
      const ov = change.before.data()
      const ovLen = ov.participants.length
      let recruit = null
      if (nvLen === ovLen) return
      else if (nvLen > ovLen) recruit = true
      else if (nvLen < ovLen) recruit = false
      let guest = null
      let alertStatus = 0

      if (recruit) {
        guest = nv.participants.filter((x) => !ov.participants.includes(x))[0] // 영입
        alertStatus = 3
      } else {
        guest = ov.participants.filter((x) => !nv.participants.includes(x))[0] // 방출
        alertStatus = 4
      }
      const refApplicant = fdb.collection('users').doc(guest)
      const batch = fdb.batch()
      // update 참가 게스트의 알림 ON
      batch.update(refApplicant, {
        alertParticipationToggle: true,
      })
      // update 참가 요청자의 참가 리스트(추가/제거)
      if (recruit) {
        batch.update(refApplicant, {
          participationList: admin.firestore.FieldValue.arrayUnion(
            context.params.scheduleId,
          ),
        })
      } else {
        batch.update(refApplicant, {
          participationList: admin.firestore.FieldValue.arrayRemove(
            context.params.scheduleId,
          ),
        })
      }
      const createdAt = new Date()
      const id = createdAt.getTime().toString()
      batch.set(refApplicant.collection('FindCourtAlert').doc(id), {
        scheduleId: context.params.scheduleId,
        applicantsId: guest,
        createdAt: createdAt,
        alertStatus: alertStatus,
      })
      // meta update
      const refMeta = fdb.collection('meta').doc('findPeople')
      let addNum = recruit ? 1 : -1
      batch.update(refMeta, {
        applicantionCount: admin.firestore.FieldValue.increment(addNum),
      })

      await batch.commit()
    } catch (err) {
      console.log(err)
    }
  })

// 모집(1) / 마감(2) / 완료(3) / 기간만료(4) / 삭제(9)
exports.scheduledFunction = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async (context) => {
    function leftPad(value) {
      return value >= 10 ? value : `0${value}`
    }
    const curr = new Date()
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000
    const now = new Date(utc + KR_TIME_DIFF)
    const dateOfToday = `${now.getFullYear()}-${leftPad(
      now.getMonth() + 1,
    )}-${leftPad(now.getDate())}`
    const currentTime = `${leftPad(now.getHours())}:${leftPad(
      now.getMinutes(),
    )}`
    try {
      const snapshot = await fdb.collection('findPeople').get()
      // exceptStatusPast
      const schedules = snapshot.docs
        .filter((value) => {
          return value.data().status !== 4
        })
        .map((value) => {
          const item = value.data()
          return {
            scheduleId: value.id,
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            status: item.status,
          }
        })
      const updateStatus3to4 = []
      const updateStatusNto3 = []
      const length = schedules.length

      for (let i = 0; i < length; i++) {
        const schedule = schedules[i]
        const scheduleDateFormat = new Date(schedules[i].date)
        const elapsedDate = (now - scheduleDateFormat) / 86400000 // / 1000 / 60 / 60 / 24
        if (elapsedDate > 30 && schedule.status === 3) {
          // 30일 경과
          updateStatus3to4.push(schedule.scheduleId)
        } else if (
          (schedule.date < dateOfToday ||
            (schedule.date === dateOfToday &&
              schedule.endTime <= currentTime)) &&
          (schedule.status === 1 || schedule.status === 2)
        ) {
          // 날짜가 지났거나 || 같은 날이어도 종료시간이 지난 모집
          updateStatusNto3.push(schedule.scheduleId)
        }
      }
      const updateStatus3to4Length = updateStatus3to4.length
      for (let i = 0; i < updateStatus3to4Length; i++) {
        const ref = fdb.collection('findPeople').doc(updateStatus3to4[i])
        const refMeta = fdb.collection('meta').doc('findPeople')
        const batch = fdb.batch()
        batch.update(refMeta, {
          findPeopleComplete: admin.firestore.FieldValue.increment(-1),
          findPeopleExpiration: admin.firestore.FieldValue.increment(1),
        })
        batch.update(ref, { status: 4 })
        await batch.commit()
      }

      const updateStatusNto3Length = updateStatusNto3.length
      for (let i = 0; i < updateStatusNto3Length; i++) {
        const ref = fdb.collection('findPeople').doc(updateStatusNto3Length[i])
        const refMeta = fdb.collection('meta').doc('findPeople')
        const batch = fdb.batch()
        if (updateStatusNto3Length[i].status === 1) {
          batch.update(refMeta, {
            findPeopleOpen: admin.firestore.FieldValue.increment(-1),
            findPeopleComplete: admin.firestore.FieldValue.increment(1),
          })
        } else if (updateStatusNto3Length[i].status === 2) {
          batch.update(refMeta, {
            findPeopleClose: admin.firestore.FieldValue.increment(-1),
            findPeopleComplete: admin.firestore.FieldValue.increment(1),
          })
        }
        batch.update(ref, { status: 3 })
        await batch.commit()
      }
    } catch (err) {
      console.log(err)
    }
  })

// meta
exports.scheduledFunctionForMeta = functions.pubsub
  .schedule('every 60 minutes')
  .onRun(async (context) => {
    try {
      const metaUser = await fdb.collection('meta').doc('users').get()
      const metaFindPeople = await fdb
        .collection('meta')
        .doc('FindPeople')
        .get()
      const records = {
        createUser: metaUser.createUser, // 가입
        deleteUser: metaUser.deleteUser, // 탈퇴
        applicantionCount: metaFindPeople.applicantionCount, // 게스트 지원
        editCount: metaFindPeople.editCount, // 수정
        accRecruitCount: metaFindPeople.accRecruitCount, // 누적 영입
        recruitCount: metaFindPeople.recruitCount, // 영입
        eliminatedCount: metaFindPeople.eliminatedCount, // 방출
        accOpenCount: metaFindPeople.eliminatedCount, // 누적 신규
        accCloseCount: metaFindPeople.accCloseCount, // 누적 마감
        findPeopleOpen: metaFindPeople.findPeopleOpen, // 현재 모집
        findPeopleClose: metaFindPeople.findPeopleClose, // 현재 마감
        findPeopleComplete: metaFindPeople.findPeopleComplete, // 현재 완료
        findPeopleExpiration: metaFindPeople.findPeopleExpiration, // 현재 30일 이후
      }
      const id = Date.now()
      await fdb.collection('records').doc(id).set(records)
    } catch (err) {
      console.log(err)
    }
  })
