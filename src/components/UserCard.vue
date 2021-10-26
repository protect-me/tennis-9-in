<template>
  <div
    v-if="user"
    class="user-info-card d-flex flex-no-wrap justify-space-between"
  >
    <v-avatar class="ma-3" size="125" tile>
      <img
        v-if="!loadImgFailed"
        :src="user.photoURL"
        @error="loadImgFailed = true"
        alt="User Photo"
      />
      <div v-else class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-3" size="125" tile>
          <v-icon x-large>mdi-account-circle-outline</v-icon>
        </v-avatar>
      </div>
    </v-avatar>
    <div>
      <v-card-title class="text-h6 pt-3 pl-0">
        {{ user.nickName || user.displayName }}
      </v-card-title>
      <v-card-subtitle class="pb-2 pl-0">
        {{ userEmail }}
      </v-card-subtitle>

      <v-card-text class="py-0 pl-0">
        <div>
          <span v-if="user.sex">
            {{ user.sex === 1 ? '남' : '여' }}
          </span>
          <span class="mx-1">|</span>
          <span v-if="user.birth">
            {{ userAge }}
          </span>
          <span class="mx-1">|</span>
          <span v-if="user.location" v-text="user.location"></span>
        </div>

        <div></div>
      </v-card-text>

      <v-card-actions class="pt-1 pb-0 pl-0">
        <v-spacer></v-spacer>
        <v-chip small class="mt-1">
          <span class="mr-1">NTRP</span>
          <span v-if="user.ntrp" v-text="user.ntrp"></span>
        </v-chip>
      </v-card-actions>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loadImgFailed: false,
    }
  },
  computed: {
    userAge() {
      return Math.floor((new Date().getFullYear() - this.user.birth) / 10) * 10
    },
    userEmail() {
      const spread = this.user.email.split('@')
      const starId = [...spread[0]].map((v, i) => {
        if (i < 2) return v
        else return '*'
      })
      return starId.join('') + '@' + spread[1]
    },
  },
  methods: {
    hell() {
      console.log('here???')
    },
  },
}
</script>

<style></style>
