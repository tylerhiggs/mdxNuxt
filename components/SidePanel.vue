<script setup lang="ts">
import {
  ChevronDoubleLeftIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  InboxIcon,
} from "@heroicons/vue/24/outline";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
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
});

const isOpen = ref(true);
const favoritePages = computed(() =>
  props.pages.filter((page) => page.isFavorite),
);
const privatePages = computed(() =>
  props.pages.filter((page) => !page.isFavorite),
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

const ctrlOrCmd = "⌘";

const toggleSidePanelCommand = `${ctrlOrCmd}+\\`;
const toggleSearchCommand = `${ctrlOrCmd}+K`;

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
    class="group relative top-0 bottom-0 left-0 flex h-full w-64 flex-col bg-slate-50 px-1 py-0.5 dark:bg-stone-800"
  >
    <ClientOnly>
      <Popover class="relative w-full">
        <PopoverButton
          v-if="userFirstLetter"
          class="flex w-full items-center justify-between rounded-md border-transparent p-2 hover:bg-gray-200 focus:border-transparent focus:ring-0 focus:outline-hidden dark:hover:bg-stone-700"
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
          <ChevronDownIcon
            class="size-4 font-bold text-gray-500 dark:text-stone-400"
          />
          <ToolTip
            message="Close sidebar"
            position="bottom"
            :command="toggleSidePanelCommand"
          >
            <button
              @click="isOpen = false"
              class="invisible ml-0.5 flex items-center rounded-md p-0.5 text-2xl group-hover:visible hover:bg-gray-300 dark:hover:bg-stone-600"
            >
              <ChevronDoubleLeftIcon
                class="size-5 font-bold text-gray-500 dark:text-stone-400 dark:hover:text-white"
              />
            </button>
          </ToolTip>
          <ToolTip message="Create a new page" position="right">
            <button
              @click.prevent="emit('createPage')"
              class="flex items-center rounded-md p-1 text-2xl hover:bg-gray-300 dark:hover:bg-stone-600"
            >
              <PencilSquareIcon
                class="size-5 font-bold text-gray-600 dark:text-stone-100"
              />
            </button>
          </ToolTip>
        </PopoverButton>

        <PopoverPanel
          class="absolute left-8 z-10 w-64 rounded-lg bg-white shadow-xl"
        >
          <ProfilePopup
            :workspaceTitle="workspaceTitle"
            :userFirstLetter="userFirstLetter"
          />
        </PopoverPanel>
      </Popover>
    </ClientOnly>
    <ToolTip
      message="Search and quickly jump to a page"
      position="right"
      :command="toggleSearchCommand"
    >
      <DefaultPanelItem
        @click="emit('toggleSearch')"
        class="w-full pl-3 font-medium text-gray-400"
        title="Search"
      >
        <MagnifyingGlassIcon class="size-4" />
      </DefaultPanelItem>
    </ToolTip>
    <ToolTip message="View recent updates and notifications" position="right">
      <DefaultPanelItem
        class="w-full pl-3 font-medium text-gray-400"
        title="Inbox"
      >
        <InboxIcon class="size-4" />
      </DefaultPanelItem>
    </ToolTip>
    <ToolTip message="Manage your account and settings" position="right">
      <DefaultPanelItem
        class="w-full pl-3 font-medium text-gray-400"
        title="Settings"
        @click="emit('openSettings')"
      >
        <Cog6ToothIcon class="size-4" />
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
    <p class="my-0.5 ml-3 text-xs font-normal text-gray-400">Private</p>
    <PagePanelItem
      v-for="page in privatePages"
      :key="page.id"
      :page="page"
      :selected="page.id === currentPageId"
    />
  </nav>
</template>
