<template>
  <v-container class="find-people-record-container">
    <div class="find-people-record-header">
      <TitleWithButton
        titleText="게스트 참가 요청 기록"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
        filterButton
        :filtering="filtering"
        @filterButtonClicked="filterButtonClicked"
        sortButton
        :sortASC="orderByASC"
        @sortButtonClicked="sortButtonClicked"
      />
    </div>
    <v-divider class="my-3"></v-divider>

    <v-tabs v-model="tab" grow>
      <v-tab v-for="item in items" :key="item.tab">
        <span class="mr-2">{{ item.tab }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items class="tabs-item" v-model="tab" v-if="schedules">
      <v-tab-item class="tab-item" v-if="scheduleOpen">
        <FindPeopleCard
          v-for="(schedule, index) in scheduleOpen"
          :key="index"
          :schedule="schedule"
        ></FindPeopleCard>
        <v-card v-if="scheduleOpen.length === 0" flat>
          <v-card-text class="mt-12" align="center">
            모집 중인 기록이 없습니다 🎾
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item class="tab-item" v-if="scheduleClose">
        <FindPeopleCard
          v-for="(schedule, index) in scheduleClose"
          :key="index"
          :schedule="schedule"
        ></FindPeopleCard>
        <v-card v-if="scheduleClose.length === 0" flat>
          <v-card-text class="mt-12" align="center">
            마감된 기록이 없습니다 🎾
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item class="tab-item" v-if="scheduleComplete">
        <FindPeopleCard
          v-for="(schedule, index) in scheduleComplete"
          :key="index"
          :schedule="schedule"
        ></FindPeopleCard>
        <v-card v-if="scheduleComplete.length === 0" flat>
          <v-card-text class="mt-12" align="center">
            마감된 기록이 없습니다 🎾
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
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
    scheduleOpened() {
      return this.schedules
        .filter((schedule) => {
          return schedule.status === 1
        })
        .sort((a, b) => {
          return this.orderByASC ? a - b : b - a
        })
    },
    scheduleCompleted() {
      return this.schedules
        .filter((schedule) => {
          return schedule.status !== 1
        })
        .sort((a, b) => {
          return this.orderByASC ? a - b : b - a
        })
    },
  },
  watch: {
    user() {
      this.initData()
    },
  },
  data() {
    return {
      tab: null,
      items: [
        { tab: '모집', icon: 'mdi-door-open', content: 'FindPeopleOpen' },
        { tab: '마감', icon: 'mdi-door-closed', content: 'FindPeopleClose' },
        {
          tab: '완료',
          icon: 'mdi-door-closed-lock',
          content: 'FindPeopleComplete',
        },
      ],
      schedules: [],
      filtering: false,
      orderByASC: true,
      scheduleOpen: [],
      scheduleClose: [],
      scheduleComplete: [],
    }
  },
  methods: {
    goBackButtonClicked() {
      this.$router.push({ name: 'Mypage' })
    },
    async initData() {
      if (this.user.applicationList.length === 0) return
      const idList = this.user.applicationList
      try {
        const snapshot = await this.$firebase
          .firestore()
          .collection('findPeople')
          .orderBy('date')
          .orderBy('startTime')
          .get()
        this.schedules = snapshot.docs
          .filter((value) => idList.includes(value.id))
          .map((value) => {
            const id = value.id
            const item = value.data()
            return {
              scheduleId: id,
              organizer: item.organizer,
              organizerNickName: item.organizerNickName,
              courtName: item.courtName,
              courtType: item.courtType,
              date: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              ntrp: item.ntrp,
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
        await this.filteringSchedules()
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '데이터 로드 실패',
        })
        console.log('데이터 로드 실패', err)
      }
    },
    filteringSchedules() {
      const schedulesLength = this.schedules.length
      for (let i = 0; i < schedulesLength; i++) {
        switch (this.schedules[i].status) {
          case 1:
            this.scheduleOpen.push(this.schedules[i])
            break
          case 2:
            this.scheduleClose.push(this.schedules[i])
            break
          case 3:
            this.scheduleComplete.push(this.schedules[i])
            break
        }
      }
    },
    filterButtonClicked() {
      const arr = ['scheduleOpen', 'scheduleClose', 'scheduleComplete']
      this.filtering = !this.filtering
      if (this.filtering) {
        arr.forEach((items) => {
          this[items] = this[items].filter((item) => {
            return item.participants.includes(this.fireUser.uid)
          })
        })
        this.$store.dispatch('openAlert', {
          message: '영입된 모집만 보여집니다 🎾',
        })
      } else {
        arr.forEach((items) => (this[items] = []))
        this.filteringSchedules()
        this.orderByASC = true
      }
    },
    sortButtonClicked() {
      this.orderByASC = !this.orderByASC
      let flag = 1
      if (!this.orderByASC) flag = -1
      const arr = [this.scheduleOpen, this.scheduleClose, this.scheduleComplete]

      arr.forEach((item) =>
        item.sort((a, b) => {
          if (a.date > b.date) return 1 * flag
          else if (a.date < b.date) return -1 * flag
          else if (a.date === b.date) {
            if (a.startTime > b.startTime) return 1 * flag
            else if (a.startTime <= b.startTime) return -1 * flag
          }
        }),
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.find-people-record-container {
  height: calc(100vh - 48px);
  .v-tabs-items {
    padding: 0px 2px;
    height: calc(100vh - 180px);
    overflow: scroll;
    .tab-item {
      margin-top: 10px;
    }
  }
}
</style>
