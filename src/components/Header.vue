<template>
  <div>
    <v-app-bar dark dense max-height="48px">
      <v-toolbar-title>
        <router-link to="/" class="white--text" style="text-decoration: none;">
          <div class="pr-2">
            🎾
          </div>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <router-link
          to="/findpeoplehome"
          class="white--text"
          style="text-decoration: none;"
        >
          <v-icon
            :color="
              checkRoute([
                'FindPeopleHome',
                'FindPeopleDetail',
                'FindPeopleRegist',
              ])
            "
          >
            mdi-account-search-outline
          </v-icon>
        </router-link>
      </v-btn>

      <v-btn icon>
        <router-link
          to="/map"
          class="white--text"
          style="text-decoration: none;"
        >
          <v-icon :color="checkRoute(['Map'])">
            mdi-map-search-outline
          </v-icon>
        </router-link>
      </v-btn>

      <v-btn icon>
        <router-link
          to="/courtlist"
          class="white--text"
          style="text-decoration: none;"
        >
          <v-icon
            :color="
              checkRoute(['CourtList', 'CourtDetail', 'CourtRegist', 'Report'])
            "
          >
            mdi-stadium
          </v-icon>
        </router-link>
      </v-btn>

      <v-btn icon>
        <router-link
          to="/mypage"
          class="white--text"
          style="text-decoration: none;"
        >
          <v-icon
            :color="
              checkRoute([
                'Mypage',
                'EditUserInfo',
                'FindCourtAlert',
                'FindCourtRecord',
                'FindPeopleAlert',
                'FindPeopleRecord',
                'OperationPolicy',
              ])
            "
          >
            mdi-account-circle-outline
          </v-icon>
        </router-link>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  methods: {
    checkRoute(routeArray) {
      if (routeArray.includes(this.$route.name)) {
        return 'white'
      } else {
        return 'grey'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.not-active {
  color: grey;
}
</style>
