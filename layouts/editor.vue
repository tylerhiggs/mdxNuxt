<script setup lang="ts">
const { pages, currentPage, createPage, deletePage } = usePageState();
const auth = useAuth();
const showSearch = ref(false);
const showSettings = ref(false);

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
  <div
    v-if="auth.loggedIn && auth.dbUser.value"
    class="fixed top-0 right-0 bottom-0 left-0 m-0 overflow-hidden"
  >
    <div class="relative m-0 flex h-full w-full overflow-hidden">
      <SidePanel
        :pages="pages || []"
        :current-page-id="currentPage?.id"
        @toggle-search="showSearch = !showSearch"
        @openSettings="showSettings = true"
        @createPage="createPage"
        @delete-page="deletePage"
      />
      <slot />
      <SearchDialog :open="showSearch" @close="showSearch = false" />
      <SettingsDialog :open="showSettings" @close="showSettings = false" />
      <SnackBar />
      <OuterToolTip />
    </div>
  </div>
</template>
