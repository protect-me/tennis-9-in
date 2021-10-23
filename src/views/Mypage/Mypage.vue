<template>
  <v-container class="mypage-container">
    <v-card v-if="user">
      <UserCard :user="user"></UserCard>
    </v-card>
    <v-card v-else>
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-3" size="125" tile>
          <v-icon x-large>mdi-account-circle-outline</v-icon>
        </v-avatar>
        <div
          class="mr-10"
          style="display: flex; justify-content: center; align-items: center;"
        >
          <v-btn
            :disabled="isProcessing"
            @click="loginWithGoogle"
            :loading="isProcessing"
            color="primary"
          >
            <v-icon left dark>
              mdi-google-plus
            </v-icon>
            <span>
              구글 로그인
            </span>
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- 게스트 모집 -->
    <v-list-group
      :value="user && user.alertApplicationToggle"
      no-action
      class="mt-5"
    >
      <template v-slot:activator>
        <v-list-item-icon>
          <v-icon>mdi-account-search-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            게스트 모집
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item
        v-for="(item, index) in findPeopleGroup"
        :key="index"
        link
        :to="item.to"
      >
        <v-list-item-content>
          <v-list-item-title
            v-if="(item.type === 'alert' && user && user.alertApplicationToggle)"
          >
            <v-badge color="pink" dot>
              <span>{{ item.text }}</span>
            </v-badge>
          </v-list-item-title>
          <v-list-item-title v-else v-text="item.text"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>

    <!-- 게스트 요청 -->
    <v-list-group :value="user && user.alertParticipationToggle" no-action>
      <template v-slot:activator>
        <v-list-item-icon>
          <v-icon>mdi-calendar-search</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            게스트 참가
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item
        v-for="(item, index) in applyRecordGroup"
        :key="index"
        link
        :to="item.to"
      >
        <v-list-item-title
          v-if="(item.type === 'alert' && user && user.alertParticipationToggle)"
        >
          <v-badge color="pink" dot>
            <span>{{ item.text }}</span>
          </v-badge>
        </v-list-item-title>
        <v-list-item-title v-else v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list-group>

    <v-list nav>
      <v-list-item-group v-model="selectedItem" color="primary">
        <!-- 회원 정보 수정 / 운영 정책 -->
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- 로그아웃 -->
        <v-list-item v-if="fireUser" @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>로그아웃</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script>
import UserCard from '../../components/UserCard'
import { mapState } from 'vuex'

export default {
  components: {
    UserCard,
  },
  mounted() {
    this.checkAdditionalInfo()
  },
  data() {
    return {
      addtionalUserInfoToggle: false,
      isProcessing: false,
      selectedItem: 0,

      findPeopleGroup: [
        {
          text: '게스트 모집 기록',
          icon: 'mdi-account-search-outline',
          type: '',
          to: '/findpeoplerecord',
        },
        {
          text: '참가 요청/취소 알림',
          icon: 'mdi-account-search-outline',
          type: 'alert',
          to: '/findpeoplealert',
        },
      ],
      applyRecordGroup: [
        {
          text: '게스트 참가 요청 기록',
          icon: 'mdi-account-heart-outline',
          type: '',
          to: '/findcourtrecord',
        },
        {
          text: '영입/방출 알림',
          icon: 'mdi-account-check-outline',
          type: 'alert',
          to: '/findcourtalert',
        },
      ],
      items: [
        {
          text: '회원 정보 수정',
          icon: 'mdi-badge-account-horizontal-outline',
          to: '/edituserinfo',
        },
        {
          text: '약관 및 정책',
          icon: 'mdi-laptop',
          to: '/operationpolicy',
        },
        {
          text: '피드백',
          icon: 'mdi-bullhorn-outline',
          to: '/report',
        },
      ],
    }
  },
  computed: {
    ...mapState(['fireUser', 'user']),
  },
  watch: {
    user() {
      this.checkAdditionalInfo()
    },
  },
  methods: {
    async loginWithGoogle() {
      if (this.isProcessing) return
      this.isProcessing = true
      const provider = new this.$firebase.auth.GoogleAuthProvider()

      this.$firebase.auth().languageCode = 'ko'
      try {
        const snapshot = await this.$firebase.auth().signInWithPopup(provider)
        console.log('로그인 성공')
      } catch (err) {
        alert('로그인에 실패했습니다.', err)
        console.log(err)
      } finally {
        this.isProcessing = false
      }
    },
    checkAdditionalInfo() {
      if (
        this.user &&
        (!this.user.sex ||
          !this.user.birth ||
          !this.user.location ||
          !this.user.ntrp)
      ) {
        this.$router.push({ name: 'EditUserInfo' })
      }
    },
    async logout() {
      const answer = window.confirm('로그아웃 하시겠습니까?')
      if (answer) {
        this.$firebase.auth().signOut()
        await this.$store.dispatch('setUser', null)
        await this.$store.dispatch('setFireUser', null)
        alert('로그아웃 되었습니다')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.mypage-container {
  height: calc(100vh - 48px);
}
</style>
