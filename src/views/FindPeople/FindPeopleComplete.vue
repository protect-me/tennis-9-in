<template>
  <div>
    <v-card class="mb-2">
      <v-card-subtitle>
        <span>Notice. 최근 30일 이내의 데이터만 노출됩니다 🎾</span>
      </v-card-subtitle>
    </v-card>

    <transition-group
      name="fade"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @enter-cancelled="afterEnter"
    >
      <FindPeopleCard
        v-for="(schedule, index) in schedules"
        :key="schedule.scheduleId"
        :data-index="index"
        :schedule="schedule"
      ></FindPeopleCard>
    </transition-group>

    <v-card v-if="loading" flat>
      <v-card-text class="mt-12" align="center">
        <v-progress-circular
          indeterminate
          color="blue-grey"
        ></v-progress-circular>
      </v-card-text>
    </v-card>
    <v-card v-else-if="schedules && schedules.length === 0" flat>
      <v-card-text class="mt-12" align="center">
        완료된 데이터가 없습니다 🎾
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FindPeopleCard from './FindPeopleCard'

export default {
  props: {
    schedules: {
      type: Array,
      default: [],
    },
  },
  components: {
    FindPeopleCard,
  },
  computed: {
    ...mapState(['loading']),
  },
  methods: {
    beforeEnter(el) {
      el.style.transitionDelay = 300 * parseInt(el.dataset.index, 10) + 'ms'
    },
    afterEnter(el) {
      el.style.transitionDelay = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
