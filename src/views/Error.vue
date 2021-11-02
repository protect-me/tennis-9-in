<template>
  <v-container class="error-container">
    <v-card class="error-content">
      <v-card-title>
        <div>Page Not Found</div>
      </v-card-title>
      <v-card-subtitle>
        <div>잘못된 요청입니다</div>
      </v-card-subtitle>
      <v-card-text>
        <div>{{ $route.path }}</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {}
</script>

<style>
.error-container {
  height: calc(var(--vh, 1vh) * 100 - 48px);
}
</style>
