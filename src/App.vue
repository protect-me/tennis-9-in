<template>
  <v-app id="app-container">
    <Header></Header>

    <v-main>
      <router-view />
    </v-main>

    <transition name="fade">
      <Alert class="custom-alert" v-if="$store.state.alertInfo"></Alert>
    </transition>

    <v-dialog v-model="$store.state.confirmToggle" persistent>
      <Confirm></Confirm>
    </v-dialog>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import Alert from '@/components/Alert'
import Confirm from '@/components/Confirm'

export default {
  components: {
    Alert,
    Header,
    Confirm,
  },
  data() {
    return {
      toggle: true,
    }
  },
  mounted() {
    const theme = localStorage.getItem('Tennis9InDarkTheme')
    if (theme) {
      if (theme == 'true') {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    }
  },
}
</script>

<style lang="scss">
#app-container {
  height: calc(var(--vh, 1vh) * 100);
  overflow-x: hidden;
  overflow-y: scroll;
  .v-application--wrap {
    min-height: calc(var(--vh, 1vh) * 100) !important;
  }
}
.v-overlay--active {
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
.custom-alert {
  width: calc(100% - 24px);
  padding: 0 12px;
  left: 0px;
  bottom: 0;
  /* bottom: calc((1vh - var(--vh, 1vh)) * 100); */
  position: absolute;
  z-index: 999;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
