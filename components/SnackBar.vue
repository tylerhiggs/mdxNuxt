<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/outline";
const snackbarStore = useSnackbar();
</script>

<template>
  <div
    class="absolute bottom-4 left-4 right-4 flex w-full flex-col items-center"
  >
    <div
      class="group m-2 flex items-center justify-between rounded-lg px-2 py-0.5 text-white shadow-md"
      :class="
        snackbar.type === 'error'
          ? 'bg-red-500'
          : snackbar.type === 'success'
            ? 'bg-emerald-500'
            : snackbar.type === 'warning'
              ? 'bg-yellow-500'
              : snackbar.type === 'info'
                ? 'bg-slate-900'
                : 'bg-slate-900'
      "
      v-for="snackbar in snackbarStore.queue.value"
      :key="snackbar.id"
    >
      <p class="mr-0.5">{{ snackbar.message }}</p>
      <XCircleIcon
        class="hidden size-5 cursor-pointer group-hover:block"
        @click="snackbarStore.dequeue(snackbar.id)"
      />
    </div>
  </div>
</template>
