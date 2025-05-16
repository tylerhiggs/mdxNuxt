<script setup lang="ts">
const userStore = useAuth();
defineProps<{
  workspaceTitle: string;
  userFirstLetter: string;
}>();
</script>

<template>
  <div
    v-if="userStore.user.value"
    class="flex items-center justify-between p-2 text-gray-500"
  >
    <p class="text-xs">{{ userStore.user.value?.email }}</p>
    <button class="rounded-md p-1 hover:bg-gray-200">
      <UIcon name="i-heroicons-ellipsis-horizontal" class="size-4" />
    </button>
  </div>
  <div class="items-center-justify-center flex py-2 hover:bg-gray-100">
    <div v-if="userStore.dbUser.value?.avatar"></div>
    <div
      class="ml-6 flex size-8 items-center justify-center rounded-md bg-gray-300 text-gray-500"
      v-else
    >
      {{ userFirstLetter }}
    </div>
    <div class="ml-4 flex flex-col items-center justify-center">
      <p class="text-sm font-bold text-slate-800">{{ workspaceTitle }}</p>
    </div>
  </div>
  <hr class="border-t border-gray-200" />
  <div class="flex flex-col bg-gray-50 p-1">
    <button
      class="flex items-center rounded-md p-1 text-xs text-gray-500 hover:bg-gray-200"
      @click="userStore.signOut"
    >
      Sign out
    </button>
  </div>
</template>
