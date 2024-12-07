<script setup lang="ts">
import {
  ChevronRightIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  StarIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import type { PageItem } from "@/types/page";
const props = defineProps<{
  page: PageItem;
  selected: boolean;
}>();
const emit = defineEmits<{
  addPage: [];
  toggleFavorite: [];
  duplicatePrivate: [];
  delete: [];
}>();

const copyLink = () => {
  console.log("Copy link");
};

const metaKey = navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl";

const isOpen = ref(false);
</script>

<template>
  <NuxtLink
    class="group/pageitem flex items-center justify-between rounded-md py-1 hover:bg-gray-200 focus:border-transparent focus:outline-none focus:ring-0 dark:hover:bg-stone-700"
    :class="{ 'bg-gray-200 font-semibold dark:bg-stone-700': props.selected }"
    :to="`/edit/${props.page.id}`"
  >
    <div class="flex">
      <button
        class="invisible absolute ml-3 rounded-md hover:bg-gray-200 group-hover/pageitem:visible dark:hover:bg-stone-600"
        @click="(isOpen = !isOpen), $event.stopPropagation()"
      >
        <ChevronRightIcon v-if="!isOpen" class="size-5 text-gray-400" />
        <ChevronDownIcon v-else class="size-5 text-gray-400" />
      </button>
      <p class="ml-3 text-sm group-hover/pageitem:invisible">
        {{ props.page.emoji }}
      </p>
      <p
        class="ml-3 overflow-hidden truncate text-ellipsis text-sm text-black dark:text-gray-400"
      >
        {{ props.page.title || "Untitled" }}
      </p>
    </div>
    <div class="flex items-center">
      <Popover class="relative" v-slot="{ open }">
        <ToolTip
          message="Delete, duplicate, and more..."
          position="bottom"
          :disabled="open"
        >
          <PopoverButton
            class="invisible flex items-center rounded-md p-0.5 hover:bg-gray-300 group-hover/pageitem:visible dark:hover:bg-stone-600"
          >
            <EllipsisHorizontalIcon class="size-5 text-gray-400" />
          </PopoverButton>
        </ToolTip>
        <PopoverPanel
          class="absolute flex w-56 flex-col text-nowrap rounded-lg bg-white dark:bg-stone-700 dark:text-stone-300"
        >
          <button
            @click="emit('toggleFavorite')"
            class="mx-0.5 mt-0.5 flex items-center text-nowrap rounded-md p-0.5 text-xs hover:bg-gray-200 dark:hover:bg-stone-700"
          >
            <StarIcon
              v-if="!page.isFavorite"
              class="mr-2 size-5 text-gray-400"
            />
            <StarIcon v-else class="mr-2 size-5 fill-amber-300" />

            <span v-if="page.isFavorite">Add to Favorites</span>
            <span v-else>Remove from Favorites</span>
          </button>
          <hr class="my-1 border-gray-200" />
          <button
            @click="copyLink"
            class="mx-0.5 flex items-center rounded-md p-0.5 text-xs hover:bg-gray-300"
          >
            <LinkIcon class="mr-2 size-5 text-gray-400" />
            <span>Copy link</span>
          </button>
          <button
            @click="emit('duplicatePrivate')"
            class="flex items-center rounded-md p-0.5 text-xs hover:bg-gray-300"
          >
            <DocumentDuplicateIcon class="mr-2 size-5 text-gray-400" />
            <span>Duplicate</span>
          </button>
          <button
            class="flex items-center justify-between rounded-md p-0.5 text-xs hover:bg-gray-300"
          >
            <div class="flex items-center">
              <PencilSquareIcon class="mr-2 size-5 text-gray-400" />
              <span>Rename</span>
            </div>
            <div class="mr-2 font-mono text-gray-400">
              {{ metaKey }}+Shift+R
            </div>
          </button>
          <button
            class="flex items-center justify-between rounded-md p-0.5 text-xs hover:bg-gray-300"
          >
            <div class="flex items-center">
              <ArrowUturnLeftIcon class="mr-2 size-5 text-gray-400" />
              <span>Move to</span>
            </div>
            <div class="mr-2 font-mono text-gray-400">
              {{ metaKey }}+Shift+P
            </div>
          </button>
          <button
            @click="emit('delete')"
            class="flex items-center rounded-md p-0.5 text-xs hover:bg-gray-300"
          >
            <TrashIcon class="mr-2 size-5 text-gray-400" />
            <span>Delete</span>
          </button>
          <hr class="my-1 border-gray-200" />
          <div>
            <p class="flex text-xs text-gray-400">
              Last edited by {{ page.lastUpdatedByName }}
            </p>
            <p class="mb-2 flex text-xs text-gray-400">
              {{ new Date(page.lastUpdatedAt).toLocaleString() }}
            </p>
          </div>
        </PopoverPanel>
      </Popover>

      <ToolTip message="Add a page inside" position="bottom">
        <button
          class="invisible flex items-center rounded-md p-0.5 hover:bg-gray-300 group-hover/pageitem:visible dark:hover:bg-stone-600"
          @click="emit('addPage'), $event.stopPropagation()"
        >
          <PlusIcon class="size-5 text-gray-400" />
        </button>
      </ToolTip>
    </div>
  </NuxtLink>
</template>
