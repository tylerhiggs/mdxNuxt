<script setup lang="ts">
const authStore = useAuth();
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center bg-slate-200">
    <div
      class="flex w-4/12 flex-col items-center rounded-lg bg-slate-50 pb-8 pt-4 shadow-lg"
    >
      <h1 class="mb-8 text-4xl font-bold text-slate-900">Sign In</h1>
      <GoogleButton @click="authStore.signInWithGoogle" />
    </div>
  </div>
</template>
