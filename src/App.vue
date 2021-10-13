<template>
  <v-app>
    <Header></Header>
    <v-main>
      <!-- <transition name="fade"> -->
      <router-view />
      <!-- </transition> -->
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
export default {
  components: {
    Header,
  },
  mounted() {},
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss">
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
} */
</style>
