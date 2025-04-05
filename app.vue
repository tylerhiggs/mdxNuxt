<script setup lang="ts">
const { currentPage } = usePageState();

const pageTitle = computed(() => {
  return currentPage.value?.title || "Editor";
});

const pageEmojiPath = computed(() => {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${currentPage.value?.emoji || "📄"}</text></svg>`;
});

watch(
  pageEmojiPath,
  (newPath) => {
    document?.querySelector("link[rel='icon']")?.setAttribute("href", newPath);
  },
  { immediate: true },
);

useHead({
  title: pageTitle,
  link: [
    {
      rel: "icon",
      href: pageEmojiPath,
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
