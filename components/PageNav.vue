<script setup lang="ts">
import type { Page } from "@/types/page";
import { UIcon } from "#components";
import type { MdNode } from "~/shared/types";
const props = defineProps<{
  saved: boolean;
  page: Page;
  previewPage: boolean;
  nodes: MdNode[][];
}>();

const emits = defineEmits<{
  favoritePage: [];
  selectPage: [number];
  togglePreview: [];
}>();
const tooltipStore = useTooltip();
const pageState = usePageState();
const snackbarStore = useSnackbar();

const publicize = async () => {
  const page = { ...props.page };
  if (page.isPublic) {
    console.warn("Page is already public");
    return;
  }
  await pageState.updatePage(
    {
      id: page.id,
      isPublic: true,
    },
    true,
  );
};
const hostname = useRequestURL().origin;

const copyLink = () => {
  navigator.clipboard.writeText(`${hostname}/public/${props.page.id}`);
  snackbarStore.enqueue("Link copied to clipboard", "success");
};

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
      v-for="(page, index) in page.path"
      :key="page.id"
      class="flex items-center rounded-xs p-0.5 text-gray-700 hover:bg-gray-200 dark:text-stone-300 dark:hover:bg-stone-700"
      @click="() => emits('selectPage', page.id)"
    >
      <p v-if="index !== 0" class="mx-2 text-gray-500 dark:text-stone-400">/</p>
      <p class="text-sm">{{ page.emoji }}</p>
      <p class="ml-2 text-sm">{{ page.title || "Untitled" }}</p>
    </button>
    <div class="flex items-center">
      <UIcon
        name="i-heroicons-check"
        v-if="props.saved"
        class="size-5 text-emerald-400"
        aria-label="Saved"
      />
      <p v-else class="text-gray-500">...Saving</p>
      <p class="ml-2 text-xs font-semibold text-gray-400">
        Last Edited
        {{
          new Date(props.page.lastUpdatedAt).toLocaleString("en-US", {
            timeStyle: "short",
            dateStyle: "short",
          })
        }}
      </p>
      <button
        :class="{
          'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200':
            !props.previewPage,
          'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300':
            props.previewPage,
        }"
        class="ml-2 flex cursor-pointer items-center rounded-md px-1 py-0.5 text-xs font-semibold"
        @click="() => emits('togglePreview')"
      >
        <span>Preview</span>
      </button>
      <UPopover class="relative">
        <UButton
          variant="ghost"
          color="neutral"
          class="ml-2 flex items-center rounded-md px-1 py-0.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
          @mouseover="mouseover"
          @mouseleave="mouseleave"
          @click="mouseleave"
        >
          Share
        </UButton>
        <template #content>
          <div v-if="!props.page.isPublic" class="w-96 p-4">
            <div class="text-md font-bold">Publish to web</div>
            <div class="text-sm text-gray-500">
              Share your page with anyone by publishing it to the web.
            </div>
            <div class="mt-2 border-t pt-2"></div>
            <div class="m-0.5 mt-2 overflow-hidden rounded-md border">
              <div class="relative border-t border-gray-200 bg-white">
                <div
                  class="flex items-center justify-start space-x-1 bg-gray-200 p-1"
                >
                  <span class="h-2 w-2 rounded-full bg-red-500"></span>
                  <span class="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span class="h-2 w-2 rounded-full bg-green-500"></span>
                </div>
                <div class="bg-white p-4 dark:bg-stone-800">
                  <div class="mb-2 flex items-center">
                    <p class="text-sm">{{ props.page.emoji }}</p>
                    <p class="ml-2 text-sm font-semibold">
                      {{ props.page.title }}
                    </p>
                  </div>
                  <div class="h-32 text-sm text-gray-700">
                    <MdNode
                      v-for="(node, i) in props.nodes[0] || []"
                      :key="i"
                      :node="node"
                      :preview="true"
                      v-if="props.page.blocks.length"
                    />
                    <div
                      class="absolute right-0 bottom-0 left-0 h-16 bg-linear-to-t from-white to-transparent dark:from-stone-800"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="my-2 w-full rounded-md bg-blue-500 py-1 text-sm font-semibold text-white hover:bg-blue-600"
              @click="publicize"
            >
              Publish
            </button>
          </div>
          <div v-else class="p-3">
            <div class="text-md font-bold">Share link</div>
            <div class="mt-2 border-t pt-2"></div>
            <div class="flex items-center justify-between">
              <a
                :href="`${hostname}/public/${props.page.id}`"
                target="_blank"
                class="w-full rounded-md px-2 py-1 text-sm text-blue-500 hover:underline"
              >
                {{ `${hostname}/public/${props.page.id}` }}
              </a>
              <button
                class="ml-2 rounded-md bg-blue-500 px-2 py-1 text-sm font-semibold text-white hover:bg-blue-600"
                @click="copyLink"
              >
                Copy
              </button>
            </div>
          </div>
        </template>
      </UPopover>
      <button
        class="ml-2 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        @click="() => emits('favoritePage')"
      >
        <UIcon
          name="i-heroicons-star"
          class="size-5"
          :class="{ 'fill-yellow-200': page.isFavorite }"
          aria-label="Favorite"
        />
      </button>
    </div>
  </header>
</template>
