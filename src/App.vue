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

<style scoped lang="scss"></style>
