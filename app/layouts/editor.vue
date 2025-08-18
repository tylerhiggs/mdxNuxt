<script setup lang="ts">
import { ClientOnly } from "#components";

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
  <ClientOnly>
    <div v-if="auth.loggedIn && auth.dbUser.value" class="m-0 h-screen">
      <div class="relative m-0 flex h-full w-full">
        <SidePanel
          :pages="pages || []"
          :current-page-id="currentPage?.id"
          @toggle-search="showSearch = !showSearch"
          @open-settings="showSettings = true"
          @create-page="createPage"
          @delete-page="deletePage"
        />
        <slot />
        <SearchDialog v-model:open="showSearch" @close="showSearch = false" />
        <SettingsDialog v-model:open="showSettings" />
        <SnackBar />
        <OuterToolTip />
      </div>
    </div>
  </ClientOnly>
</template>
