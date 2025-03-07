<script setup lang="ts">
import { CheckIcon, StarIcon } from "@heroicons/vue/24/outline";
import type { Page } from "@/types/page";
const props = defineProps<{
  saved: boolean;
  page: Page;
}>();
const emits = defineEmits<{
  favoritePage: [];
  selectPage: [string];
}>();
const tooltipStore = useTooltip();

const mouseover = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  tooltipStore.show(
    "Share or publish to the web",
    rect.right,
    rect.bottom,
    "bottom",
    "⌘⇧O",
  );
};

const mouseleave = () => {
  tooltipStore.hide();
};
</script>

<template>
  <header class="flex w-full flex-row items-center justify-between p-2">
    <button
      v-for="(page, index) in props.page.path"
      :key="page.id"
      class="flex items-center rounded-sm p-0.5 text-gray-700 hover:bg-gray-200 dark:text-stone-300 dark:hover:bg-stone-700"
      @click="() => emits('selectPage', page.id)"
    >
      <p v-if="index !== 0" class="mx-2 text-gray-500 dark:text-stone-400">/</p>
      <p class="text-sm">{{ page.emoji }}</p>
      <p class="ml-2 text-sm">{{ page.title }}</p>
    </button>
    <div class="flex items-center">
      <CheckIcon
        v-if="props.saved"
        class="size-5 text-emerald-400"
        aria-label="Saved"
      />
      <p v-else class="text-gray-500">...Saving</p>
      <p class="ml-2 text-xs">
        Last Edited
        {{
          new Date(props.page.lastUpdatedAt).toLocaleString("en-US", {
            timeStyle: "short",
            dateStyle: "short",
          })
        }}
      </p>
      <button
        class="ml-2 flex items-center text-gray-500 hover:text-gray-700"
        @click="() => emits('favoritePage')"
        @mouseover="mouseover"
        @mouseleave="mouseleave"
      >
        Share
      </button>
      <button
        class="ml-2 flex items-center text-gray-500 hover:text-gray-700"
        @click="() => emits('favoritePage')"
      >
        <StarIcon
          class="size-5"
          :class="{ 'fill-yellow-200': page.isFavorite }"
          aria-label="Favorite"
        />
      </button>
    </div>
  </header>
</template>
