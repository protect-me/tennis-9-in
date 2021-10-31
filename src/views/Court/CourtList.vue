<template>
  <v-container
    :class="{
      'court-list-container': true,
      fullscreen: mode === 'select',
    }"
  >
    <TitleWithButton
      titleText="테니스장 리스트"
      :registNewButton="mode === 'view'"
      @registNewButtonClicked="goToRegist"
    />
    <v-divider class="my-3"></v-divider>

    <v-card class="court-list-content" flat>
      <v-data-table
        :headers="headers"
        :items="courts"
        :search="search"
        :loading="loading"
        hide-default-footer
        mobile-breakpoint="1"
        disable-pagination
        sort-by="address"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:[`item.address`]="{ item }">
          {{ item.addressSigungu }} {{ item.addressLocal }}
        </template>
        <template v-slot:[`item.addressJibun`]="{ item }">
          <v-icon v-if="mode === 'view'" class="mr-2" @click="goToDetail(item)">
            mdi-arrow-right-bold-circle-outline
          </v-icon>
          <v-icon
            v-if="mode === 'select'"
            class="mr-2"
            @click="selectCourt(item)"
          >
            mdi-check-circle-outline
          </v-icon>
        </template>
        <template v-slot:no-data>No data</template>
      </v-data-table>
    </v-card>

    <v-spacer v-if="mode === 'select'" />
    <v-btn
      v-if="mode === 'select'"
      style="max-height: 36px;"
      block
      color="error"
      @click="closeSelectDialog"
    >
      취소
    </v-btn>
    <v-btn
      v-if="mode == 'view'"
      id="report"
      elevation="2"
      fab
      small
      color="secondary"
      :disabled="!fireUser"
      @click="reportBtnClicked"
    >
      <v-icon small>mdi-bullhorn-outline</v-icon>
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
  props: {
    mode: {
      type: String,
      default: 'view', // select || view
    },
  },
  created() {
    this.subscribe()
  },
  mounted() {
    this.$store.dispatch('checkVisitCount', 'courtList')
  },
  unmounted() {
    if (this.unsubscribe) this.unsubscribe()
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  data() {
    return {
      unsubscribe: null,
      loading: true,
      courts: [],
      headers: [
        {
          text: '코트명',
          align: 'start',
          value: 'courtName',
        },
        { text: '위치', value: 'address' },
        { text: '', value: 'addressJibun', sortable: false },
      ],
      search: '',
    }
  },
  methods: {
    subscribe() {
      this.loading = true
      this.unsubscribe = this.$firebase
        .firestore()
        .collection('courts')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
          if (snapshot.empty) {
            this.courts = []
            return
          }
          this.courts = snapshot.docs.map((value) => {
            const id = value.id
            const item = value.data()
            return {
              courtId: id,
              courtName: item.courtName,
              address: item.address,
              addressJibun: item.addressJibun,
              addressSigungu: item.addressSigungu,
              addressLocal: item.addressLocal,
              lat: item.lat,
              lng: item.lng,
              count: item.count,
              types: item.types,
              courtTypes: item.courtTypes,
              memo: item.memo,
            }
          })
        })
      this.loading = false
    },
    goToRegist() {
      if (!this.user) {
        this.$store.dispatch('openAlert', {
          message: '로그인이 필요해요',
          nextBtn: true,
          nextFunction: () => {
            this.$router.push({ name: 'Mypage' })
          },
        })
      } else if (this.user && this.user.createdAt === this.user.updatedAt) {
        this.$store.dispatch('openAlert', {
          message: '회원 정보를 확인해주세요',
          nextBtn: true,
          nextFunction: () => {
            this.$router.push({ name: 'Mypage' })
          },
        })
      } else {
        this.$router.push({ name: 'CourtRegist' })
      }
    },
    async goToDetail(item) {
      await this.$store.dispatch('setCourt', item)
      this.$router.push(`/courtdetail/${item.courtId}`)
    },
    selectCourt(item) {
      this.$emit('selectCourt', item)
    },
    closeSelectDialog() {
      this.$emit('closeSelectDialog')
    },
    async reportBtnClicked() {
      await this.$store.dispatch('openConfirm', {
        message: '수정 요청을 하시겠습니까?',
      })
      EventBus.$once('confirmReturn', async (answer) => {
        if (answer) this.$router.push({ name: 'Report' })
      })
    },
  },
}
</script>

<style lang="scss">
.court-list-container {
  width: 100%;
  height: calc(var(--customVH, 1vh) * 100 - 48px);
  display: flex;
  flex-direction: column;
  .court-list-content {
    width: 100%;
    height: calc(var(--customVH, 1vh) * 100 - 134px);
    overflow: scroll;
  }
}
.court-list-container.fullscreen {
  height: 100vh;
}
td {
  padding: 0px 8px !important;
}
#report {
  bottom: calc((1vh - var(--customVH, 1vh)) * 100 / 2);
  right: 0;
  position: absolute;
  margin: 16px;
}
</style>
