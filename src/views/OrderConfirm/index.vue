<template>
{{cardId}}
</template>

<script setup>
  import {  } from 'vue'
  const { cardId } = defineProps({
    cardId: {
      type: String,
      required: true
    }
  })
</script>

<style lang="scss" scoped></style>