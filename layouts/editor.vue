<script setup lang="ts">
const auth = useAuth();
const { pages, currentPage, createPage, deletePage } = usePageState();

const showSearch = ref(false);
const showSettings = ref(false);
</script>

<template>
  <div v-if="auth.user.value">
    <div class="fixed bottom-0 left-0 right-0 top-0 m-0 overflow-hidden">
      <div class="relative m-0 flex h-full w-full overflow-hidden">
        <SidePanel
          :pages="pages"
          :current-page-id="currentPage?.id"
          @openSearch="showSearch = true"
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
  </div>
  <div v-else>
    <Login />
  </div>
</template>
