<script setup lang="ts">
definePageMeta({
  layout: "restricted",
});
const {
  pages,
  currentPage,
  createPage,
  updatePage,
  isSaved,
  deletePage,
  selectPage,
  getPages,
} = usePageState();
const userStore = useAuth();
watch(
  () => userStore.user.value,
  async (user) => {
    if (user) {
      getPages();
    }
  },
);

const showSearch = ref(false);
const showSettings = ref(false);
</script>

<template>
  <div>
    <SidePanel
      :pages="pages"
      :current-page-id="currentPage?.id"
      @openSearch="showSearch = true"
      @openSettings="showSettings = true"
      @createPage="createPage"
      @delete-page="deletePage"
      @open-page="selectPage"
    />
    <SearchDialog :open="showSearch" @close="showSearch = false" />
    <SettingsDialog :open="showSettings" @close="showSettings = false" />
  </div>
</template>
