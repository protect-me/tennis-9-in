<template>
  <v-card>
    <v-card-title
      v-if="$store.state.confirmInfo && $store.state.confirmInfo.title"
    >
      {{ $store.state.confirmInfo.title }}
    </v-card-title>
    <v-card-text
      v-if="$store.state.confirmInfo && $store.state.confirmInfo.message"
      class="pt-6"
    >
      {{ $store.state.confirmInfo.message }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancle" outlined color="grey">
        취소
      </v-btn>
      <v-btn @click="ok" outlined color="primary">
        확인
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
export default {
  methods: {
    async cancle() {
      EventBus.$emit('confirmReturn', false)
      await this.$store.dispatch('closeConfirm')
    },
    async ok() {
      EventBus.$emit('confirmReturn', true)
      await this.$store.dispatch('closeConfirm')
    },
  },
}
</script>

<style></style>
