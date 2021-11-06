<template>
  <div class="pb-2">
    <v-card v-if="alertStatus !== 0" flat>
      <v-card-text
        style="display: flex; justify-content: space-between;"
        class="pl-2 py-2"
      >
        <div>
          <v-chip
            v-if="[1, 3].includes(alertStatus)"
            dark
            outlined
            color="primary"
          >
            <span>{{ alertStatus === 1 ? '참가 요청' : '영입' }}</span>
          </v-chip>
          <v-chip
            v-else-if="[2, 4].includes(alertStatus)"
            outlined
            color="error"
          >
            <span>{{ alertStatus === 2 ? '참가 요청 취소' : '방출' }}</span>
          </v-chip>
        </div>
        <div style="margin-top: 6px;">
          {{ new Date(createdAt.toDate()).toDateString() }} -
          {{ new Date(createdAt.toDate()).toLocaleTimeString() }}
        </div>
        <v-btn>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card class="find-people-card-container" @click="goToDetail">
      <div class="left">
        <v-card-title class="title-container mb-0 pa-2">
          <div class="title-year">{{ scheduleDate.year }}</div>
          <div class="title-etc">
            <div class="title-month">{{ scheduleDate.month }}</div>
            <div class="title-date">{{ scheduleDate.date }}</div>
          </div>
        </v-card-title>
        <v-card-subtitle
          :class="{
            'ma-0': true,
            'font-weight-medium': true,
            fontBlue: scheduleDate.dayOfWeek === '토',
            fontRed: scheduleDate.dayOfWeek === '일',
          }"
        >
          {{ scheduleDate.dayOfWeek }}요일
        </v-card-subtitle>
      </div>

      <div class="right">
        <v-card-text class="right-wrapper">
          <div class="divide-column">
            <div>
              <v-icon class="mr-1 mb-1" small>mdi-map-marker-outline</v-icon>
              <span>{{ schedule.courtName }}</span>
              <span>-{{ schedule.courtType }}</span>
            </div>
            <div
              v-if="schedule && !schedule.assignment"
              class="font-weight-medium"
              :class="{
                fontBlue: schedule.total > schedule.vacant,
                fontRed: schedule.total <= schedule.vacant,
              }"
            >
              <v-icon
                :class="{
                  fontBlue: schedule.total > schedule.vacant,
                  fontRed: schedule.total <= schedule.vacant,
                }"
                class="mr-1 mb-1"
                small
              >
                mdi-sofa-single-outline
              </v-icon>
              <span>{{ schedule.total - schedule.vacant + ' / ' }}</span>
              <span>{{ schedule.total }}</span>
            </div>
            <div v-else-if="schedule && schedule.assignment">
              <v-icon class="mr-1 mb-1 fontGreen" x-small>
                mdi-hands-pray
              </v-icon>
              <span class="font-weight-medium fontGreen">
                양도
              </span>
            </div>
          </div>

          <div class="divide-column">
            <div>
              <v-icon class="mr-1 mb-1" small>
                mdi-clock-time-four-outline
              </v-icon>
              <span>{{ schedule.startTime }} ~ {{ schedule.endTime }}</span>
            </div>
            <div>
              <v-icon class="mr-1 mb-1" small>mdi-tennis</v-icon>
              <span>
                NTRP
                {{
                  schedule.ntrp % 1 === 0 ? schedule.ntrp + '.0' : schedule.ntrp
                }}
              </span>
            </div>
          </div>

          <div class="divide-column">
            <div>
              <v-icon class="mr-1 mb-1" small>
                mdi-crown-outline
              </v-icon>
              <span>{{ schedule.organizerNickName }}</span>
            </div>
            <div>
              <v-icon class="mr-1 mb-1" small>mdi-cash-multiple</v-icon>
              <span>{{ Number(schedule.cost).toLocaleString('ko-KR') }}</span>
            </div>
          </div>

          <div class="memo">
            <div class="memo-icon">
              <v-icon class="mr-1 mb-1" small>mdi-bullhorn-outline</v-icon>
            </div>
            <div :class="{ 'memo-text': true, expand: mode === 'detail' }">
              <span>{{ schedule.memo }}</span>
            </div>
          </div>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    schedule: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: 'list', // list || detail
    },
    alertStatus: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    scheduleDate() {
      const week = ['일', '월', '화', '수', '목', '금', '토']
      const dayOfWeek = week[new Date(this.schedule.date).getDay()]
      const spread = this.schedule.date.split('-')
      return {
        year: spread[0],
        month: spread[1],
        date: spread[2],
        dayOfWeek: dayOfWeek,
      }
    },
  },
  methods: {
    async goToDetail() {
      if (this.mode === 'detail') return
      await this.$store.dispatch('setSchedule', this.schedule)
      this.$router.push(`/findpeopledetail/${this.schedule.scheduleId}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.find-people-card-container {
  display: flex;
  .left {
    min-width: 70px;
    .title-container {
      display: flex;
      flex-direction: column;
      .title-year {
        font-size: 12px;
      }
      .title-etc {
        .title-month {
        }
        .title-date {
          margin-top: -10px;
        }
      }
    }
  }
  .right {
    flex-grow: 1;
    .right-wrapper {
      .divide-column {
        display: flex;
        justify-content: space-between;
      }
      .memo {
        display: flex;
        .memo-text {
          /* white-space: nowrap; */
          /* text-overflow: ellipsis; */
          height: 48.6px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .memo-text.expand {
          display: block;
          height: auto;
        }
      }
    }
  }
}
.fontBlue {
  color: #5c6bc0;
}
.fontRed {
  color: #ef5350;
}
.fontGreen {
  color: #8bc34a;
}
</style>
