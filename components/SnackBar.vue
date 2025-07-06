<script setup lang="ts">
const snackbarStore = useSnackbar();
</script>

<template>
  <div
    class="absolute right-4 bottom-4 left-4 flex w-full flex-col items-center"
  >
    <div
      v-for="snackbar in snackbarStore.queue.value"
      :key="snackbar.id"
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
    >
      <p class="mr-0.5">{{ snackbar.message }}</p>
      <UIcon
        name="i-heroicons-x-circle"
        class="hidden size-5 cursor-pointer group-hover:block"
        @click="snackbarStore.dequeue(snackbar.id)"
      />
    </div>
  </div>
</template>
