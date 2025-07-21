<script setup lang="ts">
import type { PageItem } from "@/types/page";

const auth = useAuth();

const props = defineProps<{
  pages: PageItem[];
  currentPageId?: number;
}>();

const emit = defineEmits<{
  openSettings: [];
  toggleSearch: [];
  createPage: [];
  toggleFavorite: [number];
  deletePage: [number];
}>();

defineShortcuts({
  meta_k: {
    handler: () => emit("toggleSearch"),
    usingInput: true,
  },
  meta_b: {
    handler: () => (isOpen.value = !isOpen.value),
    usingInput: true,
  },
});

const isOpen = ref(true);
const favoritePages = computed(() =>
  props.pages.filter((page) => page.isFavorite),
);
const privatePages = computed(() =>
  props.pages.filter((page) => !page.isFavorite && !page.isPublic),
);
const publicPages = computed(() =>
  props.pages.filter((page) => page.isPublic && !page.isFavorite),
);

const userFirstLetter = computed(() => {
  return (
    auth.user.value?.name.charAt(0).toUpperCase() ||
    auth.user.value?.email?.charAt(0).toUpperCase() ||
    "U"
  );
});

const workspaceTitle = computed(() => {
  return `${auth.user.value?.name || auth.user.value?.email || "User"}'s Workspace`;
});
const avatarUrl = computed(() => {
  return auth.dbUser.value?.avatar
    ? `/api/private/avatars/${auth.dbUser.value?.avatar}`
    : "";
});
</script>

<template>
  <nav
    v-if="
      isOpen &&
      auth.loggedIn &&
      auth.dbUser.value &&
      workspaceTitle &&
      userFirstLetter
    "
    class="group relative flex h-full w-64 flex-initial flex-col bg-slate-50 px-1 py-0.5 dark:bg-stone-800"
  >
    <ClientOnly>
      <div
        v-if="userFirstLetter"
        variant="ghost"
        color="neutral"
        class="flex w-full items-center justify-between rounded-md border-transparent p-2"
      >
        <img
          v-if="avatarUrl"
          :src="'/api/private/avatars/' + auth.dbUser.value.avatar"
          alt="Profile Picture"
          class="h-8 w-8 rounded-full"
        />
        <div
          v-else
          class="flex aspect-square size-6 items-center justify-center rounded-md bg-gray-300 text-xs text-gray-500 dark:bg-stone-700 dark:text-stone-300"
        >
          {{ userFirstLetter }}
        </div>
        <div
          class="mx-2 truncate overflow-hidden text-sm text-ellipsis text-black dark:text-white"
        >
          {{ workspaceTitle }}
        </div>
        <ToolTip message="Close sidebar" position="bottom" command="meta+b">
          <UButton
            variant="ghost"
            color="neutral"
            class="invisible ml-0.5 flex items-center rounded-md p-0.5 text-2xl group-hover:visible hover:bg-gray-300 dark:hover:bg-stone-600"
            @click="isOpen = false"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="size-5 font-bold text-gray-500 dark:text-stone-400 dark:hover:text-white"
            />
          </UButton>
        </ToolTip>
        <ToolTip message="Create a new page" position="right">
          <button
            class="flex items-center rounded-md p-1 text-2xl hover:bg-gray-300 dark:hover:bg-stone-600"
            @click.prevent.stop="emit('createPage')"
          >
            <UIcon
              name="i-heroicons-pencil-square"
              class="size-5 font-bold text-gray-600 dark:text-stone-100"
            />
          </button>
        </ToolTip>
      </div>
    </ClientOnly>
    <ToolTip
      message="Search and quickly jump to a page"
      position="right"
      command="meta+k"
    >
      <DefaultPanelItem
        class="w-full pl-3 font-medium text-gray-400"
        title="Search"
        @click="emit('toggleSearch')"
      >
        <UIcon name="i-heroicons-magnifying-glass" class="size-4" />
      </DefaultPanelItem>
    </ToolTip>
    <ToolTip message="Manage your account and settings" position="right">
      <DefaultPanelItem
        class="w-full pl-3 font-medium text-gray-400"
        title="Settings"
        @click="emit('openSettings')"
      >
        <UIcon name="i-heroicons-cog-6-tooth" class="size-4" />
      </DefaultPanelItem>
    </ToolTip>
    <p
      v-if="favoritePages.length"
      class="my-0.5 ml-3 text-xs font-normal text-gray-400"
    >
      Favorites
    </p>
    <PagePanelItem
      v-for="page in favoritePages"
      :key="page.id"
      :page="page"
      :selected="page.id === currentPageId"
    />
    <template v-if="publicPages.length">
      <p class="my-0.5 ml-3 text-xs font-normal text-gray-400">Public</p>
      <PagePanelItem
        v-for="page in publicPages"
        :key="page.id"
        :page="page"
        :selected="page.id === currentPageId"
      />
    </template>
    <template v-if="privatePages.length || props.pages.length === 0">
      <p class="my-0.5 ml-3 text-xs font-normal text-gray-400">Private</p>
      <PagePanelItem
        v-for="page in privatePages"
        :key="page.id"
        :page="page"
        :selected="page.id === currentPageId"
      />
    </template>
  </nav>
  <UTooltip
    v-else
    text="Open sidebar"
    :kbds="['meta', 'b']"
    :delay-duration="0"
  >
    <UButton
      variant="ghost"
      color="neutral"
      class="fixed top-12 left-2 z-50"
      icon="i-heroicons-chevron-double-right"
      @click="isOpen = true"
    />
  </UTooltip>
</template>
