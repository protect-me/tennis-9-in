<template>
  <v-container class="operation-policy-container">
    <TitleWithButton
      titleText="약관 및 정책"
      goBackButton
      @goBackButtonClicked="goBackButtonClicked"
    />
    <v-divider class="my-3"></v-divider>

    <v-tabs v-model="tab" grow>
      <v-tab v-for="item in items" :key="item.tab">
        <span class="mr-2">{{ item.tab }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items class="tabs-item" v-model="tab">
      <v-tab-item class="tab-item">업데이트 예정...</v-tab-item>
      <v-tab-item class="tab-item">업데이트 예정...</v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import TitleWithButton from '../../components/TitleWithButton'

export default {
  components: {
    TitleWithButton,
  },
  data() {
    return {
      tab: null,
      items: [
        { tab: '이용약관', icon: 'mdi-tennis' },
        {
          tab: '개인정보취급방침',
          icon: 'mdi-account-lock-outline',
        },
      ],
    }
  },
  methods: {
    goBackButtonClicked() {
      this.$router.push({ name: 'Mypage' })
    },
  },
}
</script>

<style lang="scss" scoped>
.operation-policy-container {
  width: 100%;
  height: calc(100% - 48px);
  .v-tabs-items {
    padding: 0px 2px;
    height: calc(100% - 180px);
    overflow: scroll;
    .tab-item {
      margin-top: 10px;
    }
  }
}
</style>
