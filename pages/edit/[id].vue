<script setup lang="ts">
definePageMeta({
  layout: "editor",
});
const emojiDataStore = useEmojiData();
const { selectPage, currentPage } = usePageState();
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
    <EditPage v-if="currentPage" />

    <div v-else>
      <div>
        <UIcon
          name="i-heroicons-arrow-path"
          class="h-5 w-5 animate-spin text-white"
        />
      </div>
    </div>
  </ClientOnly>
</template>
