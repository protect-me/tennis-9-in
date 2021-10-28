<template>
  <v-container class="court-report-container">
    <div class="court-report-header">
      <TitleWithButton
        titleText="피드백 작성"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
      />
    </div>
    <v-divider class="my-3"></v-divider>
    <div class="court-report-content">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card class="mb-2">
          <v-card-subtitle>
            <span>Notice. 수정 전/후 내용을 함께 작성해주세요 🎾</span>
          </v-card-subtitle>
        </v-card>

        <v-textarea
          id="textarea"
          label="요청 사항"
          v-model="form.content"
          type="text"
          outlined
          counter="1000"
          :rules="[rules.required, rules.counter]"
        />
      </v-form>
    </div>
    <v-spacer></v-spacer>
    <v-btn
      class="compelete-btn"
      block
      color="primary"
      @click="apply"
      :disabled="isProcessing"
      :loading="isProcessing"
    >
      피드백 완료
    </v-btn>
  </v-container>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
import { mapState } from 'vuex'
import TitleWithButton from '../../components/TitleWithButton'

export default {
  components: {
    TitleWithButton,
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize)
  },
  data() {
    return {
      form: {
        content: '',
        createdAt: '',
        userId: '',
        status: 1,
      },
      valid: true,
      isProcessing: false,
      isComplete: false,
      rules: {
        required: (value) => !!value || value === 0 || '필수 기입',
        counter: (value) =>
          value.length <= 1000 || '1000자 이하로 입력해주세요',
      },
    }
  },
  methods: {
    handleResize() {
      const h = window.innerHeight
      const calcH = h - 300 + 'px'
      const textarea = document.getElementById('textarea')
      textarea.style.height = calcH
    },
    goBackButtonClicked() {
      this.$router.go(-1)
    },
    async apply() {
      if (this.isProcessing) {
        console.log('isProcessing!')
        return
      }
      this.isProcessing = true
      this.form.userId = this.fireUser.uid

      await this.$refs.form.validate()
      if (!this.valid) {
        console.log('please check validation!')
        this.isProcessing = false
        return
      }
      this.registNewReport()
    },
    async registNewReport() {
      try {
        this.form.createdAt = new Date()
        const id = this.form.createdAt.getTime().toString()

        await this.$firebase
          .firestore()
          .collection('reports')
          .doc(id)
          .set(this.form)
        console.log('등록 성공')
      } catch (err) {
        this.$store.dispatch('openAlert', {
          color: 'primary',
          icon: 'mdi-alert-circle-outline',
          message: '등록 실패',
        })
        console.log('등록 실패', err.message)
      } finally {
        this.isProcessing = false
        this.isComplete = true
      }
      this.$router.go(-1)
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (this.isComplete) {
      this.$store.dispatch('openAlert', {
        color: 'primary',
        icon: 'mdi-hands-pray',
        message: '감사한 마음을 담아 피드백을 적극 반영하겠습니다 🎾',
      })
      next()
    } else if (this.form.content.length === 0) {
      next()
    } else {
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
    }
  },
}
</script>

<style lang="scss" scoped>
.court-report-container {
  width: 100%;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  .court-report-content {
    height: calc(100vh - 140px);
    #textarea {
      height: 300px;
    }
  }
  .compelete-btn {
    max-height: 36px;
  }
}
</style>
