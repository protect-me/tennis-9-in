<template>
  <v-container class="home-container">
    <div>
      <img
        class="main-img"
        src="https://media.vlpt.us/images/protect-me/post/7ab49d45-78cb-4dd6-bdb1-4b716145736d/tennis_main_square.jpeg"
        alt="테니스구인"
      />
    </div>
    <v-divider class="mt-1 mb-3"></v-divider>

    <v-card class="mb-2" nav :to="'FindPeopleHome'">
      <v-card-subtitle>
        <v-icon class="mr-3">mdi-account-search-outline</v-icon>
        <span>게스트 모집</span>
      </v-card-subtitle>
      <v-card-text>
        <div>- 게스트 모집하기</div>
        <div>- 경기 참가 신청</div>
        <div>- 참가자 영입/방출</div>
      </v-card-text>
    </v-card>

    <v-card class="mb-2" nav :to="'Map'">
      <v-card-subtitle>
        <v-icon class="mr-3">mdi-map-search-outline</v-icon>
        <span>테니스장 지도</span>
      </v-card-subtitle>
      <v-card-text>
        <div>- 서울 테니스장 지도에서 보기</div>
        <div>- 테니스장별 현재 모집중인 공고 숫자 표시</div>
        <div>- 마커 클릭 시, 상세페이지로 이동</div>
      </v-card-text>
    </v-card>

    <v-card class="mb-2" nav :to="'CourtList'">
      <v-card-subtitle>
        <v-icon class="mr-3">mdi-stadium</v-icon>
        <span>테니스장 리스트</span>
      </v-card-subtitle>
      <v-card-text>
        <div>- 서울 테니스장 검색하기</div>
        <div>- 코트정보 및 모집 공고 확인 가능</div>
        <div>- 필터링 기능 추가 예정</div>
      </v-card-text>
    </v-card>

    <v-card class="mb-2" nav :to="'Mypage'">
      <v-card-subtitle>
        <v-icon class="mr-3">mdi-account-circle-outline</v-icon>
        <span>마이페이지</span>
      </v-card-subtitle>
      <v-card-text>
        <div>- 구글 로그인/로그아웃</div>
        <div>- 내가 모집 중인 공고 보기</div>
        <div>- 게스트 참가 요청/취소 알림</div>
        <div>- 내가 참가 신청한 공고 보기</div>
        <div>- 영입/방출 알림</div>
        <div>- 회원 정보 수정</div>
        <div>- 피드백</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    this.$store.dispatch('checkVisitCount', 'home')
  },
  computed: {
    cssVariable() {
      return { '--vh': this.$store.state.vh }
    },
  },
  methods: {
    checkVisitCount(pageName) {
      const cookieName =
        'tennis9inVisitHistory' +
        pageName[0].toUpperCase() +
        pageName.slice(1, pageName.length)
      const userHistory = getCookie(cookieName)
      if (!userHistory) {
        setCookie(cookieName, pageName, 1)
        this.visitCountUp(pageName)
      }
    },
    async visitCountUp(pageName) {
      try {
        await this.$firebase
          .firestore()
          .collection('meta')
          .doc('visit')
          .update(pageName, this.$firebase.firestore.FieldValue.increment(1))
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.home-container {
  height: calc(var(--vh, 1vh) * 100 - 48px);
  overflow: scroll;
}
.main-img {
  width: 100%;
  border-radius: 5px;
}
</style>
