<template>
  <v-container class="find-people-container">
    <v-card flat>
      <TitleWithButton
        titleText="게스트 모집"
        registNewButton
        @registNewButtonClicked="moveToRegist"
      />
      <v-divider class="my-3"></v-divider>
    </v-card>

    <v-tabs v-model="tab" grow>
      <v-tab v-for="item in items" :key="item.tab">
        <span class="mr-2">{{ item.tab }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items class="tabs-item" v-model="tab" v-if="schedules">
      <v-tab-item class="tab-item">
        <FindPeopleOpen :schedules="schedulesOpen"></FindPeopleOpen>
      </v-tab-item>
      <v-tab-item class="tab-item">
        <FindPeopleClose :schedules="schedulesClose"></FindPeopleClose>
      </v-tab-item>
      <v-tab-item class="tab-item">
        <FindPeopleComplete :schedules="schedulesComplete"></FindPeopleComplete>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import FindPeopleOpen from './FindPeopleOpen'
import FindPeopleClose from './FindPeopleClose'
import FindPeopleComplete from './FindPeopleComplete'
import TitleWithButton from '../../components/TitleWithButton'

export default {
  components: {
    FindPeopleOpen,
    FindPeopleClose,
    FindPeopleComplete,
    TitleWithButton,
  },
  mounted() {
    this.$nextTick(async function () {
      await this.$store.dispatch('setSchedules')
      this.tab = this.selectedTab
    })
  },
  async beforeDestroy() {
    await this.$store.dispatch('setSelectedTab', this.tab)
    if (this.unsubscribeFindPeople) {
      this.unsubscribeFindPeople()
    }
  },
  computed: {
    ...mapGetters(['unsubscribeFindPeople']),
    ...mapState(['fireUser', 'user', 'schedules', 'selectedTab']),
  },
  watch: {
    schedules() {
      this.filtering()
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
      schedulesOpen: [],
      schedulesClose: [],
      schedulesComplete: [],
    }
  },
  methods: {
    filtering() {
      this.schedulesOpen = []
      this.schedulesClose = []
      this.schedulesComplete = []
      const length = this.schedules.length
      for (let i = 0; i < length; i++) {
        const schedule = this.schedules[i]
        switch (schedule.status) {
          case 4:
            break
          case 3:
            this.schedulesComplete.push(schedule)
            break
          case 2:
            this.schedulesClose.push(schedule)
            break
          case 1:
            this.schedulesOpen.push(schedule)
            break
        }
      }
    },
    moveToRegist() {
      if (this.user && this.user.createdAt !== this.user.updatedAt) {
        this.$router.push({ name: 'FindPeopleRegist' })
      } else {
        alert('로그인이 필요해요 🎾')
        this.$router.push({ name: 'Mypage' })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.find-people-container {
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
