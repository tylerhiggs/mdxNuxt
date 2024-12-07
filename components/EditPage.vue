<script setup lang="ts">
import {
  PhotoIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/vue/24/solid";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import type { Page, PageUpdate, Block } from "@/types/page";
const snackbarStore = useSnackbar();
const props = defineProps<{
  page: Page;
  isSaved: boolean;
}>();

const emits = defineEmits<{
  updatePage: [page: PageUpdate, instantSave?: boolean];
  updateBlock: [block: Block, instantSave?: boolean];
}>();

const updateTitle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emits("updatePage", { id: props.page.id, title: target.value });
};
const favoritePage = () => {
  emits(
    "updatePage",
    { id: props.page.id, isFavorite: !props.page.isFavorite },
    true,
  );
};
const selectEmoji = (emoji: string) => {
  emits("updatePage", { id: props.page.id, emoji }, true);
};
const updateBlock = (block: Block, instantSave?: boolean) => {
  emits("updateBlock", block, instantSave);
};
</script>

<template>
  <div class="absolute inset-0 left-64 z-0 dark:bg-stone-900 dark:text-white">
    <PageNav :page="page" :saved="isSaved" @favoritePage="favoritePage" />

    <div class="relative z-0 flex w-full justify-center overflow-y-auto">
      <div class="flex h-full w-8/12 flex-col">
        <div class="group pt-12">
          <Popover class="relative">
            <PopoverButton
              class="flex rounded-md border-none text-7xl hover:bg-gray-100 focus:outline-none dark:hover:bg-stone-600"
            >
              {{ page.emoji }}
            </PopoverButton>
            <PopoverPanel class="fixed z-50">
              <LazyEmojiPicker @select="selectEmoji" />
            </PopoverPanel>
          </Popover>
          <div
            class="invisible my-1 flex items-center text-xs text-gray-400 group-hover:visible"
          >
            <button
              class="mr-1 flex items-center rounded-md p-1 hover:bg-gray-100 dark:hover:bg-stone-600"
              @click="() => snackbarStore.enqueue('Not implemented', 'warning')"
            >
              <PhotoIcon class="mr-2 size-5" />
              Add cover
            </button>
            <button
              class="flex items-center rounded-md p-1 hover:bg-gray-100 dark:hover:bg-stone-600"
              @click="() => snackbarStore.enqueue('Not implemented', 'warning')"
            >
              <ChatBubbleBottomCenterTextIcon class="mr-2 size-5" />
              Add comment
            </button>
          </div>

          <h1 class="mt-1 w-full text-4xl font-bold">
            <input
              type="text"
              :value="page.title"
              @input="updateTitle"
              placeholder="Untitled"
              class="w-full outline-none dark:bg-inherit"
            />
          </h1>
        </div>
      </div>
    </div>

    <div class="flex h-full w-full flex-col items-center">
      Todo: put editor content here
    </div>
  </div>
</template>
