<template>
  <v-container class="find-people-alert-container">
    <div class="find-people-alert-header">
      <TitleWithButton
        titleText="참가 요청/취소 알림"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
      />
    </div>
    <v-divider class="my-3"></v-divider>

    <div class="result">
      <v-card class="mb-2">
        <v-card-subtitle>
          <span>Notice. 최근 일주일 이내의 데이터만 노출됩니다 🎾</span>
        </v-card-subtitle>
      </v-card>
      <FindPeopleCard
        v-for="(schedule, index) in schedules"
        :key="index"
        :schedule="schedule"
        :alertStatus="schedule.alertStatus"
        :createdAt="schedule.alertCreatedAt"
      ></FindPeopleCard>
      <v-card v-if="schedules && schedules.length === 0" flat>
        <v-card-text align="center">
          참가 요청/취소 알림이 없습니다 🎾
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import TitleWithButton from '../../components/TitleWithButton'
import FindPeopleCard from '../FindPeople/FindPeopleCard'

export default {
  mounted() {
    if (this.user) this.initData()
  },
  components: {
    FindPeopleCard,
    TitleWithButton,
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  watch: {
    user() {
      this.initData()
    },
  },
  data() {
    return {
      schedules: [],
    }
  },
  methods: {
    goBackButtonClicked() {
      this.$router.push({ name: 'Mypage' })
    },
    async initData() {
      const limit = new Date().getTime().toString() - 604800000
      try {
        const alertList = await this.$firebase
          .firestore()
          .collection('users')
          .doc(this.fireUser.uid)
          .collection('FindPeopleAlert')
          .where('timestamp', '>=', limit)
          .orderBy('timestamp', 'desc')
          .get()
        if (alertList.empty) return
        const alertScheduleIdList = alertList.docs.map(
          (value) => value.data().scheduleId,
        )
        const snapshot = await this.$firebase
          .firestore()
          .collection('findPeople')
          .get()
        const scheduleList = {}
        snapshot.docs
          .filter((value) => alertScheduleIdList.includes(value.id))
          .map((value) => {
            const id = value.id
            const item = value.data()
            scheduleList[id] = {
              scheduleId: id,
              organizer: item.organizer,
              organizerNickName: item.organizerNickName,
              courtName: item.courtName,
              courtType: item.courtType,
              date: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              ntrp: item.ntrp,
              assignment: item.assignment,
              vacant: item.vacant,
              total: item.total,
              contact: item.contact,
              cost: item.cost,
              memo: item.memo,
              participants: item.participants,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              status: item.status,
            }
          })
        this.schedules = alertList.docs.map((value) => {
          const id = value.id
          const item = value.data()
          return {
            id: id,
            applicantsId: item.applicantsId,
            alertCreatedAt: item.createdAt,
            alertStatus: item.alertStatus,
            ...scheduleList[item.scheduleId],
          }
        })
        if (this.user.alertApplicationToggle) {
          await this.$firebase
            .firestore()
            .collection('users')
            .doc(this.fireUser.uid)
            .update({ alertApplicationToggle: false })
        }
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '참가 요청/취소 알림 데이터 로드 실패',
        })
        console.log('참가 요청/취소 알림 데이터 로드 실패', err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.find-people-alert-container {
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 48px);
  .result {
    height: calc(var(--vh, 1vh) * 100 - 130px);
    overflow: scroll;
  }
}
</style>
