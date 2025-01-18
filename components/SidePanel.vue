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

const userStore = useAuth();

const props = defineProps<{
  pages: PageItem[];
  currentPageId?: string;
}>();

const emit = defineEmits<{
  openSettings: [];
  openSearch: [];
  createPage: [];
  deletePage: [string];
}>();

const isOpen = ref(true);
const favoritePages = computed(() =>
  props.pages.filter((page) => page.isFavorite),
);
const privatePages = computed(() =>
  props.pages.filter((page) => !page.isFavorite),
);

const userFirstLetter = computed(() => {
  return (
    userStore.user.value?.displayName?.charAt(0).toUpperCase() ||
    userStore.user.value?.email?.charAt(0).toUpperCase() ||
    "U"
  );
});

const workspaceTitle = computed(() => {
  return `${userStore.user.value?.displayName || userStore.user.value?.email || "User"}'s Workspace`;
});

const ctrlOrCmd = navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl";
const toggleSidePanelCommand = `${ctrlOrCmd}+\\`;
const toggleSearchCommand = `${ctrlOrCmd}+K`;
</script>

<template>
  <nav
    v-if="userStore.user.value && isOpen"
    class="group relative bottom-0 left-0 top-0 flex h-full w-64 flex-col bg-slate-50 px-1 py-0.5 dark:bg-stone-800"
  >
    <Popover class="relative w-full">
      <PopoverButton
        class="flex w-full items-center justify-between rounded-md border-transparent p-2 hover:bg-gray-200 focus:border-transparent focus:outline-none focus:ring-0 dark:hover:bg-stone-700"
      >
        <div v-if="userStore.user.value.hasPhoto"></div>
        <div
          class="flex aspect-square size-6 items-center justify-center rounded-md bg-gray-300 text-xs text-gray-500 dark:bg-stone-700 dark:text-stone-300"
          v-else
        >
          {{ userFirstLetter }}
        </div>
        <div
          class="mx-2 overflow-hidden truncate text-ellipsis text-sm text-black dark:text-white"
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
            class="invisible ml-0.5 flex items-center rounded-md p-0.5 text-2xl hover:bg-gray-300 group-hover:visible dark:hover:bg-stone-600"
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
    <ToolTip
      message="Search and quickly jump to a page"
      position="right"
      :command="toggleSearchCommand"
    >
      <DefaultPanelItem
        @click="emit('openSearch')"
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
      @delete="() => emit('deletePage', page.id)"
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
