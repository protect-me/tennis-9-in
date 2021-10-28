<template>
  <v-container class="court-regist-container">
    <div class="court-regist-header">
      <TitleWithButton
        titleText="신규 코트 등록"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
      />
    </div>
    <v-divider class="my-3"></v-divider>
    <v-container flat class="court-regist-content">
      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="subtitle mb-3">
          <span>
            타입 선택
          </span>
          <span style="font-size: 12px; color: gray;">
            *복수 선택 가능
          </span>
        </div>
        <v-btn-toggle
          class="type-section"
          v-model="form.types"
          group
          multiple
          color="primary"
        >
          <v-btn
            v-for="(type, index) of typeGroup"
            :key="index"
            :value="type.value"
            class="mr-4"
          >
            <div style="display: flex; flex-direction: column;">
              <div class="mb-1">
                {{ type.eng }}
              </div>
              <div style="font-size: 12px;">
                {{ type.kor }}
              </div>
            </div>
          </v-btn>
        </v-btn-toggle>

        <v-divider class="mt-2 mb-3"></v-divider>

        <div class="subtitle mb-3">
          <span>
            코트 타입 선택
          </span>
          <span @click="openCourtTypeHelp">
            <v-icon small>mdi-help-circle-outline</v-icon>
          </span>
        </div>
        <v-combobox
          v-model="form.courtTypes"
          :items="courtTypesItems"
          multiple
          chips
          outlined
          hide-details
        ></v-combobox>

        <v-divider class="mt-3 mb-3"></v-divider>

        <v-text-field
          class="mb-3"
          label="코트명"
          v-model="form.courtName"
          type="text"
          outlined
          hide-details
          :rules="[rules.required]"
        />
        <v-text-field
          class="mb-3"
          label="주소"
          v-model="form.address"
          @click="openAddressDialog"
          readonly
          type="text"
          outlined
          hide-details
          :rules="[rules.required]"
        />
        <v-textarea
          label="메모"
          v-model="form.memo"
          type="text"
          outlined
          counter="100"
          no-resize
        />
      </v-form>
    </v-container>
    <v-spacer></v-spacer>
    <v-btn
      class="compelete-btn"
      block
      color="primary"
      @click="apply"
      :disabled="isProcessing"
      :loading="isProcessing"
    >
      신규 등록
    </v-btn>

    <v-dialog v-if="addressDialogToggle" v-model="addressDialogToggle">
      <v-card min-height="500px">
        <div style="min-height: 466px; background-color: #fff;">
          <VueDaumPostcode
            @complete="addressSelected($event)"
          ></VueDaumPostcode>
        </div>

        <v-spacer></v-spacer>
        <v-btn block color="error" @click="addressDialogToggle = false">
          close
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-if="courtTypeHelpToggle" v-model="courtTypeHelpToggle">
      <v-card class="pa-2">
        <div class="mb-2">
          <v-chip class="mr-2">추가</v-chip>
          <span>코트 타입 입력 후 Enter 키 입력</span>
        </div>
        <div class="mb-2">
          <v-chip class="mr-2">삭제</v-chip>
          <span>Backspace 키 입력</span>
        </div>
        <div class="mb-2">
          <v-chip class="mr-2">선택</v-chip>
          <span>▾ 버튼 선택 후 체크 및 체크 해제</span>
        </div>
        <v-btn block color="error" @click="courtTypeHelpToggle = false">
          close
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/utils/EventBus'
import { mapState } from 'vuex'
import { VueDaumPostcode } from 'vue-daum-postcode'
import TitleWithButton from '../../components/TitleWithButton'

export default {
  components: {
    VueDaumPostcode,
    TitleWithButton,
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  data() {
    return {
      valid: true,
      isComplete: false,
      isProcessing: false,
      addressDialogToggle: false,
      courtTypeHelpToggle: false,
      form: {
        courtId: '',
        courtName: '',
        address: '',
        addressSigungu: '',
        addressLocal: '',
        addressJibun: '',
        lat: 0,
        lng: 0,
        types: [],
        courtTypes: ['1', '2', '3'],
        memo: '',
        userId: '',
        createdAt: '',
        updatedAt: '',
      },
      typeGroup: [
        {
          value: 'clay',
          eng: 'Clay',
          kor: '클레이',
        },
        {
          value: 'hard',
          eng: 'Hard',
          kor: '하드',
        },
        {
          value: 'indoor',
          eng: 'Indoor',
          kor: '실내',
        },
        {
          value: 'outdoor',
          eng: 'Outdoor',
          kor: '실외',
        },
        {
          value: 'grass',
          eng: 'Grass',
          kor: '잔디',
        },
        {
          value: 'small',
          eng: 'Small',
          kor: '소형',
        },
      ],
      courtTypesItems: ['1', '2', '3', '4', '5', 'A', 'B', 'C', 'D', 'E'],
      rules: {
        required: (value) => !!value || value === 0 || '필수 기입',
      },
    }
  },
  methods: {
    goBackButtonClicked() {
      this.$router.push({ name: 'CourtList' })
    },
    openAddressDialog() {
      this.addressDialogToggle = true
    },
    openCourtTypeHelp() {
      this.courtTypeHelpToggle = true
    },
    addressSelected(selectedAddress) {
      this.form.address = selectedAddress.roadAddress
      this.form.addressSigungu = selectedAddress.sigungu
      this.form.addressLocal = selectedAddress.bname
      if (selectedAddress.autoJibunAddress) {
        this.form.addressJibun = selectedAddress.autoJibunAddress
      } else if (selectedAddress.jibunAddress) {
        this.form.addressJibun = selectedAddress.jibunAddress
      }
      this.addressDialogToggle = false
    },
    async getLatLng() {
      let queryString = this.form.address
      let URL =
        'https://dapi.kakao.com/v2/local/search/address.json?query=' +
        queryString
      axios.defaults.withCredentials = false
      axios.defaults.headers.common['Authorization'] =
        'KakaoAK ' + process.env.VUE_APP_KAKAO_REST_API_KEY
      axios.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded'
      await axios
        .get(URL)
        .then((res) => {
          this.form.lat = res.data.documents[0].y
          this.form.lng = res.data.documents[0].x
        })
        .catch((err) => {
          this.$store.dispatch('openAlert', {
            color: 'primary',
            icon: 'mdi-alert-circle-outline',
            message: '위도/경도 데이터를 가져오는데 실패했습니다',
          })
          console.log('위도/경도 데이터 로드 실패', err)
        })
    },
    async apply() {
      if (this.isProcessing) {
        console.log('isProcessing!')
        return
      }
      if (!this.fireUser.uid) {
        this.$store.dispatch('openAlert', {
          color: 'primary',
          icon: 'mdi-alert-circle-outline',
          message: '회원 정보를 확인해주세요',
          nextBtn: true,
          nextFunction: () => {
            this.$router.push({ name: 'Mypage' })
          },
        })
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
      if (this.form.types.length === 0 || this.form.courtTypes.length === 0) {
        this.$store.dispatch('openAlert', {
          color: 'primary',
          icon: 'mdi-alert-circle-outline',
          message: '경기장 타입 혹은 코트 타입을 확인해주세요',
        })
        this.isProcessing = false
        return
      }
      await this.getLatLng() // 위도경도 확인
      if (!this.form.address || !this.form.lat || !this.form.lng) {
        this.$store.dispatch('openAlert', {
          color: 'primary',
          icon: 'mdi-alert-circle-outline',
          message: '주소를 확인해주세요',
        })
        this.isProcessing = false
        return
      }
      this.registNewCourt()
    },
    async registNewCourt() {
      try {
        this.form.createdAt = new Date()
        const id = this.form.createdAt.getTime().toString()
        this.form.courtId = id

        await this.$firebase
          .firestore()
          .collection('courts')
          .doc(id)
          .set(this.form)
        console.log('등록 성공')
      } catch (err) {
        this.$store.dispatch('openAlert', {
          color: 'primary',
          icon: 'mdi-alert-circle-outline',
          message: '등록 실패에 실패했습니다',
        })
        console.log('등록 실패', err.message)
      } finally {
        this.isProcessing = false
        this.isComplete = true
      }

      this.$router.push({ name: 'CourtList' })
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (this.isComplete) {
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
.court-regist-container {
  width: 100%;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  .court-regist-content {
    height: calc(100vh - 180px);
    overflow: scroll;
  }
  .compelete-btn {
    max-height: 36px;
  }
  .type-section {
    display: flex;
    overflow-x: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .type-section::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>
