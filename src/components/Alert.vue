<template>
  <div style="width: 100%;">
    <v-alert
      border="left"
      transition="scale-transition"
      elevation="2"
      color="primary"
      style="color: white;"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div>
          <span>
            {{ $store.state.alertInfo.message }}
          </span>
        </div>
        <v-btn
          v-if="$store.state.alertInfo.nextBtn"
          @click="btnClicked"
          color="white"
          style="color: #ecb558;"
        >
          로그인
        </v-btn>
      </div>
    </v-alert>
  </div>
</template>

<script>
export default {
  methods: {
    cancle() {},
    btnClicked() {
      if (this.$store.state.alertInfo.nextBtn) {
        this.$store.state.alertInfo.nextFunction()
        this.$store.dispatch('closeAlert')
      }
    },
  },
}
</script>

<style></style>
