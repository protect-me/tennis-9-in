<template>
  <v-container class="edit-user-info-container">
    <div class="edit-user-info-header">
      <TitleWithButton
        titleText="회원 정보 수정"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
      />
    </div>
    <v-divider class="my-3"></v-divider>
    <v-container flat class="edit-user-info-content">
      <v-form v-if="user" ref="form" v-model="valid" lazy-validation>
        <div class="divide-column">
          <v-card class="mb-7">
            <v-card-text>
              <span>
                Notice.
                <br />
                닉네임은 첫 회원 정보 수정 시, 단 한 번 변경 가능 🎾
              </span>
            </v-card-text>
          </v-card>
          <v-text-field
            v-model="form.nickName"
            label="닉네임"
            type="text"
            :disabled="form.createdAt !== form.updatedAt"
            :readonly="form.createdAt !== form.updatedAt"
            outlined
            :rules="[rules.required, rules.counter10, rules.banGhost]"
          />
          <v-btn-toggle
            :class="{
              'custom-box': true,
              'dark-border': $vuetify.theme.dark,
            }"
            style="width: 100%; border-radius: 4px;"
            v-model="sex"
            class="mb-7"
            color="primary"
            mandatory
            tile
          >
            <v-btn width="50%" :value="1">남</v-btn>
            <v-btn width="50%" :value="2">여</v-btn>
          </v-btn-toggle>
          <v-text-field
            v-model="form.birth"
            label="생년 (e.g. 1988)"
            hint="다른 회원에게는 연령대로만 표시됩니다.(e.g. 30대)"
            type="number"
            max="4"
            outlined
            :rules="[rules.required, rules.counter4number]"
          />
          <v-text-field
            v-model="form.location"
            label="지역 (e.g. 서울시 중구)"
            max="8"
            type="text"
            outlined
            :rules="[rules.required, rules.counter8]"
          />
          <div
            :class="{
              'pa-3': true,
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
              style="font-size: 12px;"
              track-color="gray"
            ></v-slider>
          </div>
        </div>
      </v-form>
    </v-container>
    <v-spacer></v-spacer>

    <v-btn
      class="compelete-btn"
      block
      color="primary"
      @click="apply"
      :loading="isProcessing"
    >
      수정 완료
    </v-btn>

    <v-dialog v-if="helpNtrpToggle" v-model="helpNtrpToggle" scrollable>
      <HelpNtrp @closeHelpNtrp="closeHelpNtrp"></HelpNtrp>
    </v-dialog>
  </v-container>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
import { mapState } from 'vuex'
import HelpNtrp from '../../components/HelpNtrp'
import TitleWithButton from '../../components/TitleWithButton'

export default {
  components: {
    HelpNtrp,
    TitleWithButton,
  },
  mounted() {
    this.$nextTick(function () {
      if (!this.user) {
        this.moveToMypage()
      } else {
        const info = this.$store.state.user
        this.form.nickName = info.nickName
        this.form.birth = info.birth
        this.form.location = info.location
        this.form.createdAt = info.createdAt
        this.form.updatedAt = info.updatedAt
        this.selectedNtrp = Number(info.ntrp) * 2 - 1 || 7
        this.sex = Number(info.sex)
      }
    })
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  data() {
    return {
      isUpdatedNickName: true,
      isComplete: false,
      isProcessing: false,
      helpNtrpToggle: false,
      selectedNtrp: 7,
      sex: 1,
      rules: {
        required: (value) => !!value || '필수 기입',
        counter4number: (value) =>
          (value && value.length === 4) || '4자리 숫자로 입력해주세요',
        counter8: (value) =>
          (value && value.length <= 8) || '8자리 이하로 입력해주세요',
        counter10: (value) =>
          (value && value.length <= 10) || '10자리 이하로 입력해주세요',
        banGhost: (value) =>
          (value &&
            value !== 'GHOST' &&
            value !== 'Ghost' &&
            value !== 'ghost' &&
            value !== 'ADMIN' &&
            value !== 'Admin' &&
            value !== 'admin' &&
            value !== '관리자') ||
          '사용할 수 없는 닉네임입니다',
      },

      form: {
        nickName: '',
        sex: '',
        birth: '',
        location: '',
        ntrp: 0,
        createdAt: '',
        updatedAt: '',
      },
      valid: false,
    }
  },
  methods: {
    goBackButtonClicked() {
      this.$router.push({ name: 'Mypage' })
    },
    async apply() {
      if (this.isProcessing) {
        console.log('isProcessing!')
        return
      }
      this.isProcessing = true
      await this.$refs.form.validate()

      if (!this.valid) {
        console.log('check validation!')
        this.isProcessing = false
        return
      }
      if (this.checkSameData()) {
        console.log('same data')
        this.isProcessing = false
        this.moveToMypage()
        return
      } else {
        this.form.sex = this.sex
        this.form.ntrp = (this.selectedNtrp + 1) / 2
        this.updateUserInfo()
      }
    },
    checkSameData() {
      const info = this.$store.state.user
      if (
        this.form.nickName === info.nickName &&
        this.form.birth === info.birth &&
        this.form.location === info.location &&
        this.sex === Number(info.sex) &&
        this.selectedNtrp === (Number(info.ntrp) * 2 - 1 || 7)
      ) {
        return true
      } else {
        return false
      }
    },
    async updateUserInfo() {
      try {
        this.form.updatedAt = Date.now()
        await this.$firebase
          .firestore()
          .collection('users')
          .doc(this.fireUser.uid)
          .update(this.form)
        console.log('수정 성공')
      } catch (err) {
        this.$store.dispatch('openAlert', {
          color: 'primary',
          icon: 'mdi-alert-circle-outline',
          message: '수정 실패',
        })
        console.log('수정 실패', err.message)
      } finally {
        this.isProcessing = false
        this.moveToMypage()
      }
    },
    moveToMypage() {
      this.$router.push({ name: 'Mypage' })
    },
    openNtrpHelp() {
      this.helpNtrpToggle = true
    },
    closeHelpNtrp() {
      this.helpNtrpToggle = false
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (this.isComplete || this.checkSameData()) {
      next()
    } else {
      await this.$store.dispatch('openConfirm', {
        message: '저장되지 않은 작업이 있습니다! 정말 나갈까요?',
      })
      EventBus.$once('confirmReturn', async (answer) => {
        if (answer) next()
        else return
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.edit-user-info-container {
  width: 100%;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  .edit-user-info-content {
    height: calc(100vh - 133px);
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
}
</style>
