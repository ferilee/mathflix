<template>
  <router-view></router-view>
  <DemoTour />
  <AppDialog />
</template>

<script setup lang="ts">
import DemoTour from "./components/DemoTour.vue";
import AppDialog from "./components/AppDialog.vue";
</script>

<style>
/* Global styles are in style.css */
</style>
