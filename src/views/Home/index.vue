<template>
  <home-nav></home-nav>
  <home-main class="home-main"></home-main>
  <layout-footer></layout-footer>
</template>

<script setup>
  // import {  } from 'vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
import HomeNav from './components/HomeNav.vue'
import HomeMain from './components/HomeMain2.vue'
</script>

<style lang="scss" scoped>
.home-main {
  padding: 50px 0;
  background-color: #f7f7f7;
}
</style>
