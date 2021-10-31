<template>
  <v-container
    :class="{
      'find-people-regist-container': true,
      'edit-mode': mode === 'edit',
    }"
  >
    <div class="find-people-regist-header">
      <TitleWithButton
        v-if="mode === 'regist'"
        titleText="게스트 모집 등록"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
      />
      <TitleWithButton
        v-else-if="mode === 'edit'"
        titleText="게스트 모집 수정"
        closeButton
        @closeButtonClicked="closeButtonClicked"
      />
    </div>
    <v-divider class="my-3"></v-divider>
    <v-container class="find-people-regist-content">
      <v-card class="mb-4">
        <v-card-text>
          <div>Notice.</div>
          <div>1. 시간 오전/오후 필수 확인 🎾</div>
          <div>2. 분 단위 내림 처리(e.g. 47분 ⇒ 40분)</div>
          <div>3. 전화번호 등 민감한 정보 기입 지양</div>
        </v-card-text>
      </v-card>

      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="divide-column">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            offset-y
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                bottom
                left
                class="mb-3 mr-3"
                outlined
                v-model="form.date"
                label="일시"
                readonly
                hide-details
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required, rules.beforeToday]"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="ko-KR"
              v-model="form.date"
              @input="dateMenu = false"
              full-width
            ></v-date-picker>
          </v-menu>

          <v-menu
            bottom
            :nudge-left="startTimeNudgeLeft"
            v-model="startTimeMenu"
            :close-on-content-click="false"
            offset-y
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mb-3 mr-3"
                outlined
                v-model="form.startTime"
                label="시작"
                readonly
                hide-details
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-time-picker
              ampm-in-title
              v-model="form.startTime"
              :max="form.endTime"
              @input="startTimeMenu = false"
            ></v-time-picker>
          </v-menu>
          <v-menu
            bottom
            left
            v-model="endTimeMenu"
            :close-on-content-click="false"
            offset-y
            transition="scale-transition"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mb-3"
                outlined
                v-model="form.endTime"
                label="종료"
                readonly
                hide-details
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-time-picker
              ampm-in-title
              v-model="form.endTime"
              :min="form.startTime"
              @input="endTimeMenu = false"
            ></v-time-picker>
          </v-menu>
        </div>

        <div class="divide-column">
          <v-text-field
            style="width: 60%;"
            class="mb-3 mr-3"
            v-model="form.courtName"
            label="장소"
            readonly
            type="text"
            outlined
            hide-details
            @click="openCourtDialog"
            :rules="[rules.required]"
          />
          <v-select
            v-model="form.courtType"
            :items="courtTypes"
            label="코트 타입"
            outlined
            hide-details
            :rules="[rules.required]"
          ></v-select>
        </div>

        <div
          :class="{
            'pa-3': true,
            'mb-3': true,
            'custom-box': true,
            'dark-border': $vuetify.theme.dark,
          }"
        >
          <span>
            실력 | NTRP
          </span>
          <span @click="openNtrpHelp">
            <v-icon small>mdi-help-circle-outline</v-icon>
          </span>
          <v-slider
            v-model="selectedNtrp"
            :tick-labels="[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7]"
            :min="1"
            :max="13"
            step="1"
            ticks="always"
            tick-size="0"
            style="font-size: 12px; width: calc(100% - 10px);"
            track-color="gray"
          ></v-slider>
        </div>

        <div class="divide-column">
          <div
            :class="{
              'mr-3': true,
              'mb-3': true,
              'custom-box': true,
              'dark-border': $vuetify.theme.dark,
            }"
            align="center"
          >
            <div style="color: rgb(117, 117, 117);" class="mx-auto">
              양도
            </div>
            <v-switch
              class="mt-0 ml-2"
              x-small
              color="primary"
              hide-details
              dense
              v-model="form.assignment"
            ></v-switch>
          </div>

          <v-text-field
            class="mb-3 mr-3"
            label="구하는 인원(명)"
            v-model="form.vacant"
            type="number"
            hide-details
            outlined
            :disabled="form.assignment"
          />
          <v-text-field
            class="mb-3"
            label="총 인원(명)"
            v-model="form.total"
            type="number"
            outlined
            hide-details
            :disabled="form.assignment"
          />
        </div>

        <div class="divide-column">
          <v-text-field
            class="mb-3 mr-3"
            label="연락처 | 메신저"
            v-model="form.contact"
            type="text"
            outlined
            hide-details
          />
          <v-text-field
            class="mb-3"
            label="참가비(원)"
            v-model="form.cost"
            type="Number"
            outlined
            hide-details
            :rules="[rules.required]"
          />
        </div>
        <v-text-field
          label="오픈 채팅방 링크"
          v-model="form.openChatLink"
          type="text"
          hint="'오픈 채팅방 링크 공유'로 복사한 내용 그대로 붙여넣으세요 🎾"
          outlined
        />
        <v-textarea
          class="mb-3"
          label="메모"
          v-model="form.memo"
          type="text"
          outlined
          no-resize
          counter="300"
          :rules="[rules.counter]"
        />
      </v-form>
    </v-container>
    <v-spacer></v-spacer>
    <div v-if="mode === 'regist'">
      <v-btn
        class="compelete-btn"
        style="width: 65%;"
        color="primary"
        block
        @click="apply"
        :disabled="isProcessing"
        :loading="isProcessing"
      >
        신규 등록
      </v-btn>
    </div>
    <div v-else-if="mode === 'edit'" style="display: flex;">
      <div class="mr-1" style="flex-grow: 1;">
        <v-btn block color="error" @click="deleteBtnClicked">모집 삭제</v-btn>
      </div>
      <div class="ml-1" style="flex-grow: 2;">
        <v-btn block color="primary" @click="apply">수정 내용 저장</v-btn>
      </div>
    </div>

    <v-dialog v-if="courtDialogToggle" v-model="courtDialogToggle" fullscreen>
      <v-card>
        <CourtList
          mode="select"
          @selectCourt="selectCourt"
          @closeSelectDialog="closeCourtDialog"
        ></CourtList>
      </v-card>
    </v-dialog>

    <v-dialog v-if="helpNtrpToggle" v-model="helpNtrpToggle" scrollable>
      <HelpNtrp @closeHelpNtrp="closeHelpNtrp"></HelpNtrp>
    </v-dialog>
  </v-container>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
import { mapState } from 'vuex'
import CourtList from '../Court/CourtList'
import HelpNtrp from '../../components/HelpNtrp'
import TitleWithButton from '../../components/TitleWithButton'

export default {
  components: {
    CourtList,
    HelpNtrp,
    TitleWithButton,
  },
  props: {
    mode: {
      type: String,
      default: 'regist', // regist | edit
    },
    subscribedSchedule: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.mode === 'edit') this.initData()
    })
  },
  async beforeDestroy() {
    if (this.isComplete) await this.$store.dispatch('setSelectedTab', 0)
  },
  computed: {
    ...mapState(['fireUser', 'user']),
    startTimeNudgeLeft() {
      let vMenuWidth = (window.innerWidth - 36) / 3
      return `${(290 - vMenuWidth) / 2}px`
    },
  },
  watch: {
    form: {
      deep: true,
      handler() {
        if (Number(this.form.startTime.slice(3)) % 10 > 0) {
          this.form.startTime = this.form.startTime.slice(0, 4) + '0'
        }
        if (Number(this.form.endTime.slice(3)) % 10 > 0) {
          this.form.endTime = this.form.endTime.slice(0, 4) + '0'
        }
      },
    },
  },
  data() {
    return {
      isComplete: false,
      isProcessing: false,
      valid: true,
      rules: {
        required: (value) => !!value || value === 0 || '필수 기입',
        counter: (value) => value.length <= 300 || '300자 이하로 입력해주세요',
        beforeToday: (value) => {
          const inputDate = new Date(value)
          const today = new Date().setHours(0)
          if (inputDate < today) {
            return '날짜를 확인해주세요'
          }
          return true
        },
      },
      courtDialogToggle: false,
      helpNtrpToggle: false,
      selectedCourt: {},
      courtTypes: [],
      selectedNtrp: 5,
      form: {
        organizer: '',
        organizerNickName: '',
        participants: [],
        applicantsCount: 0,
        courtName: '',
        courtType: '',
        date: '',
        startTime: '',
        endTime: '',
        ntrp: '',
        vacant: '',
        total: '',
        assignment: false,
        openChatLink: '',
        contact: '',
        cost: '',
        memo: '',
        createdAt: '',
        updatedAt: '',
        status: 1, // 모집(1) / 마감(2) / 완료(3) / 기간만료(4) / 삭제(9)
      },
      dateMenu: false,
      startTimeMenu: false,
      endTimeMenu: false,
    }
  },
  methods: {
    closeButtonClicked() {
      this.$emit('closeButtonClicked')
    },
    deleteButtonClicked() {
      this.$emit('deleteButtonClicked')
      this.closeButtonClicked()
    },
    goBackButtonClicked() {
      this.$router.push({ name: 'FindPeopleHome' })
    },
    openCourtDialog() {
      this.courtDialogToggle = true
    },
    closeCourtDialog() {
      this.courtDialogToggle = false
    },
    async initData() {
      try {
        const snapshot = await this.$firebase
          .firestore()
          .collection('courts')
          .doc(this.subscribedSchedule.courtId)
          .get()
        if (!snapshot) return
        this.courtTypes = snapshot.data().courtTypes
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '코트 타입 데이터 로드 실패',
        })
        console.log('코트 타입 데이터 로드 실패', err)
      }
      this.selectedNtrp = Number(this.subscribedSchedule.ntrp) * 2 - 1 || 7
      this.form = {
        organizer: this.subscribedSchedule.organizer,
        organizerNickName: this.subscribedSchedule.organizerNickName,
        participants: this.subscribedSchedule.participants,
        courtName: this.subscribedSchedule.courtName,
        courtId: this.subscribedSchedule.courtId,
        courtType: this.subscribedSchedule.courtType,
        date: this.subscribedSchedule.date,
        startTime: this.subscribedSchedule.startTime,
        endTime: this.subscribedSchedule.endTime,
        assignment: this.subscribedSchedule.assignment,
        vacant: this.subscribedSchedule.vacant,
        total: this.subscribedSchedule.total,
        contact: this.subscribedSchedule.contact,
        openChatLink: this.subscribedSchedule.openChatLink,
        cost: this.subscribedSchedule.cost,
        memo: this.subscribedSchedule.memo,
        createdAt: this.subscribedSchedule.createdAt,
        updatedAt: this.subscribedSchedule.updatedAt,
        status: this.subscribedSchedule.status, // 모집(1) / 마감(2) / 완료(3) / 기간만료(4) / 삭제(9)
      }
      this.$forceUpdate()
    },
    selectCourt(item) {
      this.selectedCourt = item
      this.form.courtId = item.courtId
      this.form.courtName = item.courtName
      this.courtTypes = item.courtTypes
      if (this.selectedCourt) this.closeCourtDialog()
    },
    async apply() {
      if (this.isProcessing) {
        console.log('is processing!')
        return
      }
      this.isProcessing = true
      await this.$refs.form.validate()

      if (!this.valid) {
        console.log('please check validation!')
        this.isProcessing = false
        return
      }
      if (!this.form.assignment) {
        if (
          this.form.vacant > 10 ||
          this.form.vacant < 0 ||
          this.form.total > 10 ||
          this.form.total < 0 ||
          this.form.total < this.form.vacant
        ) {
          this.$store.dispatch('openAlert', {
            message: '입력한 인원을 확인해주세요!',
          })
          return
        }
      } else {
        this.form.vacant = 1
        this.form.total = 2
      }
      if (!this.form.contact && !this.form.openChatLink) {
        this.$store.dispatch('openAlert', {
          message: '연락처 혹은 오픈채팅방 링크를 입력해주세요!',
        })
        this.isProcessing = false
        return
      }
      this.updateFindPeople()
    },
    async updateFindPeople() {
      try {
        const openChatLinkIndex = this.form.openChatLink.indexOf(
          'https://open.kakao.com/o/',
        )
        if (openChatLinkIndex > 0) {
          this.form.openChatLink = this.form.openChatLink.slice(
            openChatLinkIndex,
          )
        } else {
          this.form.openChatLink = ''
        }
        this.form.ntrp = (this.selectedNtrp + 1) / 2
        this.form.total = Number(this.form.total)
        this.form.vacant = Number(this.form.vacant)
        this.form.organizer = this.fireUser.uid
        this.form.organizerNickName = this.user.nickName
        let id = ''
        if (this.mode === 'regist') {
          this.form.createdAt = new Date()
          this.form.updatedAt = this.form.createdAt
          id = this.form.createdAt.getTime().toString()
        } else if (this.mode === 'edit') {
          id = this.subscribedSchedule.scheduleId
          this.form.updatedAt = new Date()
        }

        const ref = this.$firebase.firestore().collection('findPeople').doc(id)
        const refUser = this.$firebase
          .firestore()
          .collection('users')
          .doc(this.fireUser.uid)
        const refMeta = this.$firebase
          .firestore()
          .collection('meta')
          .doc('findPeople')
        const batch = await this.$firebase.firestore().batch()

        if (this.mode === 'regist') {
          batch.set(ref, this.form)
          batch.update(refUser, {
            findPeopleList: this.$firebase.firestore.FieldValue.arrayUnion(id),
          })
          batch.update(refMeta, {
            accOpenCount: this.$firebase.firestore.FieldValue.increment(1),
            findPeopleOpen: this.$firebase.firestore.FieldValue.increment(1),
          })
        } else if (this.mode === 'edit') {
          batch.update(ref, this.form)
          batch.update(refMeta, {
            editCount: this.$firebase.firestore.FieldValue.increment(1),
          })
        }

        await batch.commit()
        this.$store.dispatch('openAlert', {
          message: '게스트 모집 등록 성공',
        })
      } catch (err) {
        this.$store.dispatch('openAlert', {
          message: '등록 실패',
        })
        console.log('등록 실패', err.message)
      } finally {
        this.isProcessing = false
        this.isComplete = true
        if (this.mode === 'regist') {
          this.$router.push({ name: 'FindPeopleHome' })
        } else if (this.mode === 'edit') {
          this.closeButtonClicked()
        }
      }
    },
    async deleteBtnClicked() {
      if (this.subscribedSchedule.participants.length > 0) {
        this.$store.dispatch('openAlert', {
          message: '참여자가 있을 경우 모집을 삭제할 수 없습니다 🎾',
        })
        return
      }
      await this.$store.dispatch('openConfirm', {
        message:
          '모집을 삭제할 경우 복구할 수 없습니다. 그래도 삭제하시겠어요?',
      })
      EventBus.$once('confirmReturn', async (answer) => {
        if (answer) {
          try {
            const ref = this.$firebase
              .firestore()
              .collection('findPeople')
              .doc(this.subscribedSchedule.scheduleId)
            const refMeta = this.$firebase
              .firestore()
              .collection('meta')
              .doc('findPeople')
            const batch = await this.$firebase.firestore().batch()
            batch.update(ref, {
              status: 9,
            })
            batch.update(refMeta, {
              deleteCount: this.$firebase.firestore.FieldValue.increment(1),
            })

            await batch.commit()
            this.$store.dispatch('openAlert', {
              message: '성공적으로 삭제되었습니다 🎾',
            })
            console.log('삭제 성공')
          } catch (err) {
            console.log('삭제 실패')
          } finally {
            this.$router.push({ name: 'FindPeopleHome' })
          }
        }
      })
    },
    openNtrpHelp() {
      this.helpNtrpToggle = true
    },
    closeHelpNtrp() {
      this.helpNtrpToggle = false
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (this.isComplete) {
      next()
    } else {
      await this.$store.dispatch('openConfirm', {
        message: '저장되지 않은 작업이 있습니다! 정말 나갈까요?',
      })
      EventBus.$once('confirmReturn', (answer) => {
        if (answer) next()
        else return
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.find-people-regist-container {
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  .find-people-regist-content {
    height: calc(100% - 180px);
    overflow: scroll;
    .custom-box {
      border: 1px solid rgba(0, 0, 0, 0.42) !important;
      color: gray;
      border-radius: 5px;
    }
    .dark-border {
      border: 1px solid rgba(255, 255, 255, 0.24) !important;
    }
  }
  .compelete-btn {
    max-height: 36px;
  }
  .divide-column {
    display: flex;
  }
}
.find-people-regist-container.edit-mode {
  height: 100%;
  .find-people-regist-content {
    height: calc(100% - 12px);
    overflow: scroll;
  }
}
</style>
