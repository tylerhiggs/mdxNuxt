<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
const authStore = useAuth();
</script>

<template>
  <div v-if="authStore.loading.value">
    <ArrowPathIcon class="h-5 w-5 animate-spin text-white" />
  </div>
  <div v-else-if="authStore.user.value">
    <slot />
  </div>
  <div v-else>
    <Login />
  </div>
</template>
