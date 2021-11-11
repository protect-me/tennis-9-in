<template>
  <v-container class="info-container">
    <div class="edit-user-info-header">
      <TitleWithButton
        titleText="개발자 정보"
        goBackButton
        @goBackButtonClicked="goBackButtonClicked"
      />
    </div>
    <v-divider class="my-3"></v-divider>
    <v-container flat class="info-content">
      <v-card>
        <v-card-title>
          protect-me
        </v-card-title>

        <v-card-subtitle>
          프론트 엔드, 주니어 개발자입니다.
        </v-card-subtitle>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="pr-2" text color="primary">
            <span>Github</span>
            <v-icon @click="openNewTab('https://github.com/protect-me')">
              mdi-arrow-right-bold-circle-outline
            </v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary">
            <span>Blog</span>
            <v-icon @click="openNewTab('https://velog.io/@protect-me/series')">
              mdi-arrow-right-bold-circle-outline
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import TitleWithButton from '../../components/TitleWithButton'

export default {
  components: {
    TitleWithButton,
  },
  methods: {
    goBackButtonClicked() {
      this.$router.push({ name: 'Mypage' })
    },
    openNewTab(page) {
      window.open(page)
    },
  },
}
</script>

<style lang="scss" scoped>
.info-container {
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 48px);
}
</style>
