<script setup lang="ts">
const snackbarStore = useSnackbar();
</script>
<template>
  <button @click="snackbarStore.enqueue('custom message', 'error')">
    trigger snack
  </button>
</template>
