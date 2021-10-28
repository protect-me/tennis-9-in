<template>
  <div style="width: 100%; padding: 0px 12px; background-color: white;">
    <v-alert
      text
      outlined
      :color="$store.state.alertInfo.color"
      border="left"
      transition="scale-transition"
    >
      <!-- elevation="2" -->
      <!-- colored-border -->
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div>
          <v-icon
            class="mr-1"
            v-if="$store.state.alertInfo.icon"
            :color="$store.state.alertInfo.color"
          >
            {{ $store.state.alertInfo.icon }}
          </v-icon>
          {{ $store.state.alertInfo.message }}
        </div>
        <v-btn
          v-if="$store.state.alertInfo.nextBtn"
          @click="btnClicked"
          :color="$store.state.alertInfo.color"
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
