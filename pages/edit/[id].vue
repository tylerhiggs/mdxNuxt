<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "editor",
  validate({ params }) {
    return typeof params.id === "string";
  },
});
const emojiDataStore = useEmojiData();
const { selectPage, isSaved, currentPage, updatePage, updateBlock } =
  usePageState();
const route = useRoute();
watch(
  () => route.params.id,
  (paramId) => {
    console.log("paramId", paramId);
    const strParamId = paramId as string;
    if (currentPage.value?.id !== strParamId) {
      selectPage(strParamId as string);
    }
  },
);
onMounted(() => {
  emojiDataStore.getEmojiData();
  selectPage(route.params.id as string);
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
