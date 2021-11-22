<template>
  <div>
    <v-app-bar dense max-height="48px">
      <v-toolbar-title>
        <router-link to="/" style="text-decoration: none;">
          <div
            :class="{
              'pr-2': true,
              'header-title': true,
              'header-title-dark': $vuetify.theme.dark,
              'header-title-active': checkRouteForTitle(['Home']),
            }"
          >
            <span class="pr-2">🎾</span>
            <span>TENNIS9IN</span>
          </div>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- <v-btn icon>
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
            :color="checkRoute(['CourtList', 'CourtDetail', 'CourtRegist'])"
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
                'Report',
              ])
            "
          >
            mdi-account-circle-outline
          </v-icon>
        </router-link>
      </v-btn> -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      :bottom="false"
      temporary
      right
    >
      <v-list nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 header-title">
              TENNIS9IN
            </v-list-item-title>
            <v-list-item-subtitle>
              테니스 게스트 구인
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
          link
          active-class="primary--text"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn
        id="dark-mode-toggle"
        elevation="2"
        fab
        width="50"
        height="50"
        @click="toggleDarkMode"
      >
        <div style="min-width: 30px; font-size: 30px;">
          {{ $vuetify.theme.dark ? '🌕' : '🌑' }}
        </div>
      </v-btn>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      group: null,
      items: [
        {
          title: '구인',
          icon: 'mdi-account-search-outline',
          link: '/findpeoplehome',
        },
        { title: '지도', icon: 'mdi-map-search-outline', link: '/map' },
        { title: '경기장', icon: 'mdi-stadium', link: '/courtlist' },
        {
          title: '마이페이지',
          icon: 'mdi-account-circle-outline',
          link: '/mypage',
        },
      ],
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
  methods: {
    checkRoute(routeArray) {
      if (routeArray.includes(this.$route.name)) {
        return 'primary'
      } else {
        return 'grey'
      }
    },
    checkRouteForTitle(routeArray) {
      if (routeArray.includes(this.$route.name)) {
        return true
      } else {
        return false
      }
    },
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem(
        'Tennis9InDarkTheme',
        this.$vuetify.theme.dark.toString(),
      )
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
.not-active {
  color: grey;
}
.v-toolbar__title title {
  font-size: 1rem !important;
}
.header-title {
  font-family: 'Bebas Neue', cursive;
  color: grey;
}
.header-title-dark {
  color: white;
}
.header-title-active {
  color: #ecb558;
}
#dark-mode-toggle {
  right: 0;
  bottom: 0;
  position: absolute;
  margin: 16px;
}
</style>
