<template>
  <div>
    <div
      v-if="subscribedSchedule && !subscribedSchedule.assignment"
      class="my-3"
      style="display: flex;"
    >
      <v-divider class="mt-3" />
      <div class="mx-3">현재 참가자</div>
      <v-divider class="mt-3" />
    </div>
    <div
      v-else-if="subscribedSchedule && subscribedSchedule.assignment"
      class="my-3"
      style="display: flex;"
    >
      <v-divider class="mt-3" />
      <div class="mx-3">양도인</div>
      <v-divider class="mt-3" />
      <v-divider class="mt-3" />
      <div class="mx-3">양수인</div>
      <v-divider class="mt-3" />
    </div>

    <v-container class="participants-container pa-0" v-if="participants">
      <v-card
        v-for="(participant, index) in participants"
        :key="index"
        :class="{
          'participants-card': true,
          'mb-1': true,
          'mr-1': index % 2 === 0,
          'ml-1': index % 2 === 1,
        }"
        :dark="participant.userId === fireUser.uid"
        @click="selectParticipant(participant)"
      >
        <v-card-subtitle class="pt-2 px-2 pb-0">
          {{ participant.nickName }}
          <v-icon v-if="index === 0" small class="mb-1">
            mdi-crown-outline
          </v-icon>
          <v-icon v-if="participant.userId === 'Ghost'" small class="mb-1">
            mdi-ghost-outline
          </v-icon>
        </v-card-subtitle>

        <v-card-text
          v-if="participant.userId !== 'Ghost'"
          class="pt-0 px-2 pb-2"
        >
          <div>
            <span v-if="participant.sex">
              {{ participant.sex === 1 ? '남' : '여' }}
            </span>
            <span class="mx-1">|</span>
            <span v-if="participant.age">
              {{ participant.age }}
            </span>
            <span class="mx-1">|</span>
            <span
              v-if="participant.location"
              v-text="participant.location"
            ></span>
          </div>
          <div align="right" class="mt-1">
            <v-chip small>
              <span>NTRP</span>
              <span v-if="participant.ntrp" v-text="participant.ntrp"></span>
            </v-chip>
          </div>
        </v-card-text>
        <v-card-text
          v-else-if="participant.userId === 'Ghost'"
          class="pt-0 px-2 pb-2"
        >
          <div>-</div>
          <div align="right" class="mt-1">
            <v-chip small><span>NTRP</span></v-chip>
          </div>
        </v-card-text>
      </v-card>

      <v-card
        flat
        v-for="(vacant, index) in subscribedSchedule.vacant"
        :key="participants.length + index"
        :class="{
          'participants-card': true,
          'vacant-card': true,
          'mb-1': true,
          'mr-1': (participants.length + index) % 2 === 0,
          'ml-1': (participants.length + index) % 2 === 1,
        }"
      ></v-card>
    </v-container>

    <div
      v-if="subscribedSchedule && !subscribedSchedule.assignment"
      class="my-3"
      style="display: flex;"
    >
      <v-divider class="mt-3" />
      <div class="mx-3">참가 신청자</div>
      <v-divider class="mt-3" />
    </div>
    <div
      v-else-if="subscribedSchedule && subscribedSchedule.assignment"
      class="my-3"
      style="display: flex;"
    >
      <v-divider class="mt-3" />
      <div class="mx-3">양수 신청자</div>
      <v-divider class="mt-3" />
    </div>

    <v-container v-if="applicants && applicants.length === 0" class="pa-0">
      <v-card>
        <v-card-text>
          Notice. 참가 신청한 게스트가 없습니다 🎾
        </v-card-text>
      </v-card>
    </v-container>

    <v-container v-else-if="applicants" class="applicants-container pa-0">
      <v-card
        v-for="(applicant, index) in applicants"
        :key="index"
        :class="{
          'applicants-card': true,
          'mb-1': true,
          'mr-1': index % 2 === 0,
          'ml-1': index % 2 === 1,
        }"
        @click="selectApplicant(applicant)"
      >
        <v-card-subtitle class="pt-2 px-2 pb-0">
          {{ applicant.nickName }}
        </v-card-subtitle>
        <v-card-text class="pt-0 px-2 pb-2">
          <div>
            <span v-if="applicant.sex">
              {{ applicant.sex === 1 ? '남' : '여' }}
            </span>
            <span class="mx-1">|</span>
            <span v-if="applicant.age">
              {{ applicant.age }}
            </span>
            <span class="mx-1">|</span>
            <span v-if="applicant.location" v-text="applicant.location"></span>
          </div>
          <div v-if="applicant.comment">
            <v-icon small class="mr-1 mb-1">mdi-bullhorn-outline</v-icon>
            <span>{{ applicant.comment }}</span>
          </div>
          <div align="right" class="mt-1">
            <v-chip small>
              <span class="mr-1">NTRP</span>
              <span v-if="applicant.ntrp" v-text="applicant.ntrp"></span>
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    subscribedSchedule: {
      type: Object,
      default: () => ({}),
    },
    participants: {
      type: Array,
      default: () => [],
    },
    applicants: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.ref = this.$firebase
        .firestore()
        .collection('findPeople')
        .doc(this.subscribedSchedule.scheduleId)
    })
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  data() {
    return {
      ref: null,
      refUser: this.$firebase.firestore().collection('users'),
    }
  },
  methods: {
    async selectParticipant(participant) {
      if (this.subscribedSchedule.status !== 1) return
      if (this.subscribedSchedule.organizer !== this.fireUser.uid) return
      if (this.subscribedSchedule.organizer === participant.userId) return
      if (participant.userId === 'Ghost') return

      const answer = window.confirm('게스트를 방출하시겠어요?')
      if (!answer) return
      const answer2 = window.confirm('게스트에게 방출 사실을 알렸나요?')
      if (answer && answer2) {
        try {
          const batch = await this.$firebase.firestore().batch()
          batch.update(this.ref, {
            participants: this.$firebase.firestore.FieldValue.arrayRemove(
              participant.userId,
            ),
          })
          if (
            this.subscribedSchedule.participants.includes(participant.userId)
          ) {
            batch.update(this.ref, {
              vacant: this.$firebase.firestore.FieldValue.increment(1),
            })
          }
          batch.update(this.refUser.doc(participant.userId), {
            applicantsList: this.$firebase.firestore.FieldValue.arrayRemove(
              this.fireUser.uid,
            ),
          })
          await batch.commit()
          alert('방출된 게스트에게 방출 사실을 꼭 알리세요 🎾')
          console.log('게스트 방출 성공')
        } catch (err) {
          alert('게스트 방출 실패', err)
          console.log(err)
        } finally {
        }
      }
    },

    async selectApplicant(applicant) {
      if (this.subscribedSchedule.status !== 1) return
      if (this.subscribedSchedule.organizer !== this.fireUser.uid) return
      if (this.subscribedSchedule.participants.includes(applicant.userId)) {
        alert('이미 참여한 게스트입니다!')
        return
      }

      const answer = window.confirm('게스트로 영입하시겠어요?')
      if (answer) {
        try {
          const batch = await this.$firebase.firestore().batch()
          batch.update(this.ref, {
            participants: this.$firebase.firestore.FieldValue.arrayUnion(
              applicant.userId,
            ),
            vacant: this.$firebase.firestore.FieldValue.increment(-1),
          })
          await batch.commit()
          console.log('게스트 영입 성공')
          alert('게스트에게 영입 사실을 꼭 알려주세요 🎾')
        } catch (err) {
          alert('게스트 영입 실패', err)
          console.log(err)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.participants-container {
  width: calc(100vw - 24px);
  display: flex;
  flex-wrap: wrap;
  .participants-card {
    width: calc(50% - 4px);
  }
  .vacant-card {
    min-height: 89px;
    border: 1px dashed grey;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.applicants-container {
  width: calc(100vw - 24px);
  display: flex;
  flex-wrap: wrap;
  .applicants-card {
    width: calc(50% - 4px);
  }
}
</style>
