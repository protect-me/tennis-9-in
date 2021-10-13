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
  const time = new Date()
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
    level: email == functions.config().admin.email ? 0 : 5,
    findPeopleList: [],
    applicationList: [],
    participationList: [],
    alertApplicationToggle: false,
    alertParticipationToggle: false,
    updateNickName: false,
  }
  await fdb.collection('users').doc(uid).set(userInfo) // set user at Firestore
  userInfo.createdAt = time.getTime()
  db.ref('users').child(uid).set(userInfo) // set user at RealTime Database
})

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const { uid } = user
  await db.ref('users').child(uid).remove()
  await fdb.collection('users').doc(uid).delete()
})

// user => new collection => id: new Date toString / scheduleId:xxx, status: n
// [alertList status]
// 1: 신규 게스트 참여 요청
// 2: 참가자 참여 취소
// 3: 게스트 영입
// 4: 게스트 방출

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

      await batch.commit()
    } catch (err) {
      console.log(err)
    }
  })

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
      await batch.commit()
    } catch (err) {
      console.log(err)
    }
  })

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
        await fdb
          .collection('findPeople')
          .doc(updateStatus3to4[i])
          .update({ status: 4 })
      }
      const updateStatusNto3Length = updateStatusNto3.length
      for (let i = 0; i < updateStatusNto3Length; i++) {
        await fdb
          .collection('findPeople')
          .doc(updateStatusNto3[i])
          .update({ status: 3 })
      }
    } catch (err) {
      console.log(err)
    }
  })
