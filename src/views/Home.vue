<template>
  <v-container class="home-container">
    <v-card flat>
      <v-card-title>
        Tennis-9-In OPEN 🎉
      </v-card-title>
      <v-divider class="mb-5"></v-divider>
    </v-card>

    <v-card class="mb-1" nav :to="'FindPeopleHome'">
      <v-card-subtitle>
        <v-icon class="mr-3">mdi-account-group-outline</v-icon>
        <span>게스트 모집</span>
      </v-card-subtitle>
      <v-card-text>
        <div>- 게스트 모집하기</div>
        <div>- 경기 참가 신청</div>
        <div>- 참가자 영입/방출</div>
      </v-card-text>
    </v-card>

    <v-card class="mb-1" nav :to="'Map'">
      <v-card-subtitle>
        <v-icon class="mr-3">mdi-map-search-outline</v-icon>
        <span>테니스장 지도</span>
      </v-card-subtitle>
      <v-card-text>
        <div>- 서울 테니스장 지도에서 보기</div>
        <div>- 테니스장별 현재 모집중인 공고 숫자 표시</div>
        <div>- 마커 클릭 시, 코트정보 및 모집 공고 확인 가능</div>
      </v-card-text>
    </v-card>

    <v-card class="mb-1" nav :to="'CourtList'">
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

    <v-card class="mb-1" nav :to="'Mypage'">
      <v-card-subtitle>
        <v-icon class="mr-3">mdi-map-search-outline</v-icon>
        <span>마이페이지</span>
      </v-card-subtitle>
      <v-card-text>
        <div>- 구글 로그인/로그아웃</div>
        <div>- 내가 모집 중인 공고 보기</div>
        <div>- 게스트 참가 요청/취소 알림</div>
        <div>- 내가 참가 신청한 공고 보기</div>
        <div>- 영입/방출 알림</div>
        <div>- 회원 정보 수정</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped lang="scss">
.home-container {
  height: calc(100vh - 48px);
  overflow: scroll;
}
</style>
