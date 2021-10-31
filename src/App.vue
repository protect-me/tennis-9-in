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
    this.setHeight()
  },
  methods: {
    setHeight() {
      let customVH = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--customVH', `${customVH}px`)
      window.addEventListener('resize', () => {
        let customVH = window.innerHeight * 0.01
        document.documentElement.style.setProperty(
          '--customVH',
          `${customVH}px`,
        )
      })
    },
  },
}
</script>

<style lang="scss">
#app-container {
  height: calc(var(--customVH, 1vh) * 100);
}
.v-overlay--active {
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
.custom-alert {
  width: calc(100% - 24px);
  padding: 0 12px;
  bottom: 0px;
  left: 0px;
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
