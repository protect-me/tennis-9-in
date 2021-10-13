<template>
  <div class="title-wrapper">
    <v-btn
      v-if="goBackButton"
      tile
      icon
      color="gray"
      class="mr-1"
      @click="$emit('goBackButtonClicked')"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <div v-if="titleText" class="title-text title font-weight-black mr-2">
      {{ titleText }}
    </div>
    <div v-if="icon" class="ml-1 mt-1">
      <v-icon>{{ icon }}</v-icon>
    </div>
    <v-spacer></v-spacer>
    <v-btn
      v-if="registNewButton"
      @click="$emit('registNewButtonClicked')"
      color="primary"
    >
      등록
    </v-btn>
    <v-btn
      v-if="editButton"
      @click="$emit('editButtonClicked')"
      color="primary"
    >
      수정
    </v-btn>
    <v-btn
      v-if="deleteButton"
      @click="$emit('deleteButtonClicked')"
      color="error"
    >
      삭제
    </v-btn>
    <v-btn
      v-if="closeButton"
      @click="$emit('closeButtonClicked')"
      color="error"
      icon
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-btn
      v-if="filterButton"
      @click="$emit('filterButtonClicked')"
      color="primary"
      icon
    >
      <v-icon v-if="filtering">mdi-handshake</v-icon>
      <v-icon v-else-if="!filtering">mdi-handshake-outline</v-icon>
    </v-btn>
    <v-btn
      v-if="sortButton"
      @click="$emit('sortButtonClicked')"
      color="primary"
      icon
    >
      <v-icon v-if="sortASC">mdi-sort-numeric-ascending</v-icon>
      <v-icon v-else-if="!sortASC">mdi-sort-alphabetical-descending</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    titleText: {
      type: String,
      default: '',
    },
    goBackButton: {
      type: Boolean,
      default: false,
    },
    registNewButton: {
      type: Boolean,
      default: false,
    },
    editButton: {
      type: Boolean,
      default: false,
    },
    deleteButton: {
      type: Boolean,
      default: false,
    },
    closeButton: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    sortButton: {
      type: Boolean,
      default: false,
    },
    sortASC: {
      type: Boolean,
      default: false,
    },
    filterButton: {
      type: Boolean,
      default: false,
    },
    filtering: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.title-wrapper {
  display: flex;
  height: 36px;
  .title-text {
    margin-top: 2px;
  }
}
</style>
