<script setup lang="ts">
import {
  ChevronRightIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import type { DropdownMenuItem } from "@nuxt/ui";
import type { PageItem } from "@/types/page";
const pageState = usePageState();
const props = defineProps<{
  page: PageItem;
  selected: boolean;
}>();
const emit = defineEmits<{
  addPage: [];
}>();

const copyLink = () => {
  console.log("Copy link");
};

const menuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: props.page.isFavorite ? "Remove from favorites" : "Add to favorites",
    icon: "i-heroicons-star",
    onSelect: () =>
      pageState.updatePage(
        { id: props.page.id, isFavorite: !props.page.isFavorite },
        true,
      ),
  },
  {
    label: "Copy link",
    icon: "i-heroicons-link",
    onSelect: () => copyLink(),
  },
  {
    label: "Duplicate",
    icon: "i-heroicons-document-duplicate",
    onSelect: () => pageState.duplicatePage(props.page.id),
  },
  {
    label: "Rename",
    icon: "i-heroicons-pencil-square",
    onSelect: () => console.log("Rename"),
    kbds: ["meta", "shift", "r"],
  },
  {
    label: "Move to",
    icon: "i-heroicons-arrow-uturn-left",
    onSelect: () => console.log("Move to"),
    kbds: ["meta", "shift", "p"],
  },
  {
    label: "Delete",
    icon: "i-heroicons-trash",
    onSelect: () => pageState.deletePage(props.page.id),
  },
]);

const isOpen = ref(false);
</script>

<template>
  <NuxtLink
    class="group/pageitem flex items-center justify-between rounded-md py-1 hover:bg-gray-200 focus:border-transparent focus:ring-0 focus:outline-hidden dark:hover:bg-stone-700"
    :class="{ 'bg-gray-200 font-semibold dark:bg-stone-700': props.selected }"
    :to="`/edit/${props.page.id}`"
  >
    <div class="flex">
      <button
        class="invisible absolute ml-3 rounded-md group-hover/pageitem:visible hover:bg-gray-200 dark:hover:bg-stone-600"
        @click="((isOpen = !isOpen), $event.stopPropagation())"
      >
        <ChevronRightIcon v-if="!isOpen" class="size-5 text-gray-400" />
        <ChevronDownIcon v-else class="size-5 text-gray-400" />
      </button>
      <p class="ml-3 text-sm group-hover/pageitem:invisible">
        {{ props.page.emoji }}
      </p>
      <p
        class="ml-3 truncate overflow-hidden text-sm text-ellipsis text-black dark:text-gray-400"
      >
        {{ props.page.title || "Untitled" }}
      </p>
    </div>
    <div class="flex items-center">
      <UDropdownMenu :items="menuItems">
        <ToolTip message="Delete, duplicate, and more..." position="bottom">
          <UButton
            class="invisible flex items-center rounded-md p-0.5 group-hover/pageitem:visible hover:bg-gray-300 dark:hover:bg-stone-600"
            variant="ghost"
          >
            <EllipsisHorizontalIcon class="size-5 text-gray-400" />
          </UButton>
        </ToolTip>
      </UDropdownMenu>

      <ToolTip message="Add a page inside" position="bottom">
        <button
          class="invisible flex items-center rounded-md p-0.5 group-hover/pageitem:visible hover:bg-gray-300 dark:hover:bg-stone-600"
          @click="(emit('addPage'), $event.stopPropagation())"
        >
          <PlusIcon class="size-5 text-gray-400" />
        </button>
      </ToolTip>
    </div>
  </NuxtLink>
</template>
