<script setup lang="ts">
import type { MdNode } from "~/shared/types";

const props = defineProps<{
  previewPage: boolean;
  nodes: MdNode[][];
}>();

const {
  isSaved: saved,
  currentPage: page,
  updatePage,
  selectPage,
} = usePageState();
const favoritePage = () => {
  const [id, isFavorite] = [page.value?.id, page.value?.isFavorite];
  if (!id) {
    console.warn("Favorite page called with invalid data", { id, isFavorite });
    return;
  }
  updatePage({ id, isFavorite: !isFavorite }, true);
};
const toggleShowOutline = () => {
  if (!page.value) {
    console.warn("No page selected");
    return;
  }
  updatePage({ id: page.value.id, showOutline: !page.value.showOutline }, true);
};
const emits = defineEmits<{
  togglePreview: [];
}>();
const pageState = usePageState();
const snackbarStore = useSnackbar();

const publicize = async () => {
  if (!page.value) {
    console.warn("No page selected");
    return;
  }
  const p = { ...page.value };
  if (p.isPublic) {
    console.warn("Page is already public");
    return;
  }
  await pageState.updatePage(
    {
      id: p.id,
      isPublic: true,
    },
    true,
  );
};
const hostname = useRequestURL().origin;

const copyLink = () => {
  if (!page.value) {
    console.warn("No page selected");
    return;
  }
  navigator.clipboard.writeText(`${hostname}/public/${page.value.id}`);
  snackbarStore.enqueue("Link copied to clipboard", "success");
};

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      snackbarStore.enqueue("Link copied to clipboard", "success");
    })
    .catch((error) => {
      console.error("Failed to copy text to clipboard:", error);
      snackbarStore.enqueue("Failed to copy text", "error");
    });
};
const copyMd = () => {
  if (!page.value) {
    console.warn("No page selected");
    return;
  }
  const md = page.value.blocks.map((block) => block.textContent).join("\n\n");
  copyToClipboard(md);
};
const copyJson = () => {
  if (!page.value) {
    console.warn("No page selected");
    return;
  }
  const json = JSON.stringify(page.value, null, 2);
  copyToClipboard(json);
};

defineShortcuts({
  meta_e: {
    handler: () => emits("togglePreview"),
    usingInput: true,
  },
  meta_shift_o: () => {
    if (!page.value) {
      console.warn("No page selected");
      return;
    }
    publicize();
  },
});
</script>

<template>
  <header
    v-if="page"
    class="flex w-full flex-row items-center justify-between p-2"
  >
    <button
      v-for="(p, index) in page.path"
      :key="p.id"
      class="flex items-center rounded-xs p-0.5 text-gray-700 hover:bg-gray-200 dark:text-stone-300 dark:hover:bg-stone-700"
      @click="() => selectPage(p.id)"
    >
      <p v-if="index !== 0" class="mx-2 text-gray-500 dark:text-stone-400">/</p>
      <p class="text-sm">{{ page.emoji }}</p>
      <p class="ml-2 text-sm">{{ page.title || "Untitled" }}</p>
    </button>
    <div class="flex items-center gap-1">
      <UIcon
        v-if="saved"
        name="i-heroicons-check"
        class="size-5 text-emerald-400"
        aria-label="Saved"
      />
      <p v-else class="text-gray-500">...Saving</p>
      <p v-if="page" class="ml-2 text-xs font-semibold text-gray-400">
        Last Edited
        {{
          new Date(page.lastUpdatedAt).toLocaleString("en-US", {
            timeStyle: "short",
            dateStyle: "short",
          })
        }}
      </p>
      <UTooltip text="Preview page to the side" :kbds="['meta', 'E']">
        <UButton
          icon="i-heroicons-eye"
          variant="ghost"
          color="neutral"
          size="sm"
          :class="{
            'text-muted': !props.previewPage,
            'text-primary-300 hover:text-primary-500': props.previewPage,
          }"
          @click="() => emits('togglePreview')"
        />
      </UTooltip>
      <UPopover class="relative">
        <UTooltip
          text="Share or publish to the web"
          :kbds="['meta', 'shift', 'O']"
        >
          <UButton
            variant="ghost"
            color="neutral"
            class="flex items-center rounded-md px-1 py-0.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Share
          </UButton>
        </UTooltip>
        <template #content>
          <div v-if="!page?.isPublic" class="w-96 p-4">
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
                    <p class="text-sm">{{ page?.emoji }}</p>
                    <p class="ml-2 text-sm font-semibold">
                      {{ page?.title }}
                    </p>
                  </div>
                  <div class="h-48">
                    <RenderedPage
                      v-if="props.nodes.length === 1"
                      :nodes="[props.nodes.at(0)?.slice(0, 100) || []]"
                      :page="page"
                      :narrow-view="true"
                      :no-title="true"
                      class="mt-2"
                    />
                    <div
                      class="absolute right-0 bottom-0 left-0 h-16 bg-linear-to-t from-white to-transparent dark:from-stone-800"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="bg-primary-500 hover:bg-primary-600 my-2 w-full rounded-md py-1 text-sm font-semibold text-white"
              @click="publicize"
            >
              Publish
            </button>
          </div>
          <div v-else class="p-3">
            <div class="text-md font-bold">Share link</div>
            <div class="mt-2 border-t pt-2"></div>
            <div class="flex items-center justify-between gap-1">
              <a
                :href="`${hostname}/public/${page.id}`"
                target="_blank"
                class="text-primary hover:border-primary focus-visible:outline-primary hover:[&>code]:border-primary hover:[&>code]:text-primary border-b border-transparent font-medium [&>code]:border-dashed"
              >
                {{ `${hostname}/public/${page.id}` }}
              </a>
              <UButton
                icon="i-heroicons-link"
                variant="ghost"
                color="neutral"
                @click="copyLink"
              >
                Copy
              </UButton>
            </div>
          </div>
        </template>
      </UPopover>
      <button
        class="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        @click="favoritePage"
      >
        <UIcon
          :name="
            page?.isFavorite ? 'i-heroicons-solid-star' : 'i-heroicons-star'
          "
          class="size-5"
          :class="{ 'text-yellow-200': page?.isFavorite }"
          aria-label="Favorite"
        />
      </button>
      <UPopover mode="hover">
        <UButton
          icon="i-heroicons-clipboard-document"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="copyMd()"
        />
        <template #content>
          <UButtonGroup orientation="vertical">
            <UButton variant="ghost" color="neutral" @click="copyMd()">
              Copy Markdown
            </UButton>
            <UButton variant="ghost" color="neutral" @click="copyJson()">
              Copy JSON
            </UButton>
          </UButtonGroup>
        </template>
      </UPopover>
      <UTooltip :text="page?.showOutline ? 'Hide Outline' : 'Show Outline'">
        <UButton
          icon="i-heroicons-list-bullet"
          :variant="page?.showOutline ? 'solid' : 'ghost'"
          :color="page?.showOutline ? 'secondary' : 'neutral'"
          size="sm"
          @click="toggleShowOutline()"
        />
      </UTooltip>
    </div>
  </header>
</template>
