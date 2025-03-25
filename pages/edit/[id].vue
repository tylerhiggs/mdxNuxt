<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "editor",
});
const emojiDataStore = useEmojiData();
const { selectPage, isSaved, currentPage, updatePage, updateBlock } =
  usePageState();
const route = useRoute();
const snackbar = useSnackbar();
watch(
  () => route.params.id,
  (paramId) => {
    console.log("paramId", paramId);
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
  <EditPage
    v-if="currentPage"
    :page="currentPage"
    :isSaved="isSaved"
    @updatePage="updatePage"
    @updateBlock="updateBlock"
  />

  <div v-else>
    <div><ArrowPathIcon class="h-5 w-5 animate-spin text-white" /></div>
  </div>
</template>
