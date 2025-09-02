<script setup lang="ts">
definePageMeta({
  layout: "editor",
  ssr: false,
});
defineRouteRules({
  ssr: false,
});
const emojiDataStore = useEmojiData();
const { selectPage, currentPage, pageStatus, pageGetError } = usePageState();
const route = useRoute();
const snackbar = useSnackbar();

watch(
  () => route.params.id,
  (paramId) => {
    const numParamId = Number(paramId as string);
    if (isNaN(numParamId)) {
      snackbar.enqueue("Invalid page ID", "error");
      return;
    }
    if (currentPage.value?.id !== numParamId) {
      selectPage(numParamId);
    }
  },
);
onMounted(() => {
  emojiDataStore.getEmojiData();
  const numParamId = Number(route.params.id as string);
  if (isNaN(numParamId)) {
    snackbar.enqueue("Invalid page ID", "error");
    return;
  }
  selectPage(numParamId);
});
</script>

<template>
  <ClientOnly>
    <div
      v-if="pageStatus === 'pending' || pageStatus === 'idle'"
      class="flex h-screen w-full items-center justify-center"
    >
      <div>
        <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 animate-spin" />
      </div>
    </div>
    <div
      v-else-if="pageStatus === 'error'"
      class="flex h-screen w-full items-center justify-center"
    >
      <div class="text-center">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="text-error-500 mx-auto mb-4 h-10 w-10"
        />
        <h2 class="mb-2 text-2xl font-bold">Error Loading Page</h2>
        <p class="">
          There was an error loading the page. Please try again later.
        </p>
        <p class="text-gray-600 dark:text-gray-400">{{ pageGetError }}</p>
      </div>
    </div>

    <EditPage v-else-if="currentPage" />

    <div v-else>
      <div>
        <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 animate-spin" />
      </div>
    </div>
  </ClientOnly>
</template>
