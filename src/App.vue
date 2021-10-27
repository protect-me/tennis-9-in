<template>
  <v-app>
    <Header></Header>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
export default {
  components: {
    Header,
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
.v-overlay--active {
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
</style>
