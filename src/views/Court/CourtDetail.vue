<template>
  <v-container class="court-detail-container" v-if="court && court.courtId">
    <div class="court-detail-header">
      <TitleWithButton
        :titleText="court.courtName"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
      />
      <v-divider class="my-3"></v-divider>
    </div>
    <div class="court-detail-content" v-if="court">
      <v-card>
        <v-card-text>
          <div
            class="detail-row"
            style="
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
            "
          >
            <div>코트 타입</div>
            <div>
              <v-chip
                small
                class="ml-2"
                v-for="(type, index) in court.types"
                :key="index"
              >
                {{ type }}
              </v-chip>
            </div>
          </div>

          <div class="detail-row" style="">
            <div>코트({{ court.courtTypes && court.courtTypes.length }})</div>
            <div>
              <v-chip
                small
                class="ml-2"
                v-for="(courType, index) in court.courtTypes"
                :key="index"
              >
                {{ courType }}
              </v-chip>
            </div>
          </div>

          <div class="detail-row">
            <div>주소</div>
            <div>{{ court.address }}</div>
          </div>

          <v-divider class="my-1"></v-divider>

          <div class="detail-row">
            {{ court.memo }}
          </div>
        </v-card-text>
      </v-card>
      <div class="my-5" style="display: flex;">
        <v-divider class="mt-3" />
        <div class="mx-3">게스트 모집 중인 공고</div>
        <v-divider class="mt-3" />
      </div>
      <FindPeopleCard
        v-for="(schedule, index) in schedules"
        :key="index"
        :schedule="schedule"
      ></FindPeopleCard>
      <v-card v-if="schedules && schedules.length === 0" flat>
        <v-card-text align="center">
          해당 테니스장에는 게스트 모집 중인 공고가 없습니다 🎾
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
  components: {
    TitleWithButton,
    FindPeopleCard,
  },
  mounted() {
    this.$store.dispatch('checkVisitCount', this.$route.params.courtId)
    this.court = this.$store.state.court
    this.$nextTick(function () {
      if (!this.court.courtId) this.initCourtData()
      this.initSchedulesData()
    })
  },
  computed: {
    ...mapState(['fireUser', 'user']),
    courtId() {
      return this.$route.params.courtId
    },
  },
  data() {
    return {
      schedules: [],
      court: {},
    }
  },
  methods: {
    goBackButtonClicked() {
      this.$router.go(-1)
    },
    async initCourtData() {
      try {
        const courtInfo = await this.$firebase
          .firestore()
          .collection('courts')
          .doc(this.courtId)
          .get()
        this.court = courtInfo.data()
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '데이터를 가져오는데 실패했습니다',
        })
        console.log('court 데이터 로드 실패', err)
      }
    },
    async initSchedulesData() {
      try {
        const snapshot = await this.$firebase
          .firestore()
          .collection('findPeople')
          .orderBy('date')
          .orderBy('startTime')
          .where('status', '==', 1)
          .get()

        this.schedules = snapshot.docs
          .filter((value) => value.data().courtId === this.courtId)
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
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '데이터를 가져오는데 실패했습니다',
        })
        console.log('schedule 데이터 로드 실패', err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.court-detail-container {
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: scroll;
  .court-detail-content {
    height: calc(100vh - 120px);
    overflow: scroll;
    .detail-row {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
}
</style>
