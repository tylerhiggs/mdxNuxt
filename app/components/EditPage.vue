<script setup lang="ts">
import { createHighlighter } from "shiki";
import type { TokensResult } from "shiki";
import type { MdNode } from "~~/shared/types";
const snackbarStore = useSnackbar();

const { currentPage: page, updatePage, updateBlock, saveNow } = usePageState();
const previewPage = ref(false);
const fullscreenPreview = ref(false);
defineShortcuts({
  meta_shift_e: {
    handler: () => {
      fullscreenPreview.value = !fullscreenPreview.value && previewPage.value;
    },
    usingInput: true,
  },
});
const element = (blockId: number) => {
  const blockElement = document.getElementById(`block-${blockId}`) as
    | HTMLTextAreaElement
    | undefined;
  if (!blockElement) {
    console.warn(`No block found with ID ${blockId} in page ${page.value?.id}`);
  }
  return blockElement;
};

const colorMode = useColorMode();
const mdNodes = ref<MdNode[][]>([]);
watchDebounced(
  [() => page.value?.blocks, () => colorMode.value],
  async ([blocks]) => {
    if (!blocks || !blocks.length) {
      return;
    }
    const nodes = await Promise.all(
      blocks.map((block) => parseMd(block.textContent)),
    );
    mdNodes.value = nodes;
  },
  { immediate: true, debounce: 1000 },
);
const editorHighlighterPromise = createHighlighter({
  themes: ["material-theme-lighter", "material-theme-palenight"],
  langs: ["mdc"],
});

const syntaxHighlightedTokens = ref<TokensResult[]>([]);
onMounted(async () => {
  const blocks = page.value?.blocks;
  if (!blocks || !blocks.length) {
    return;
  }
  const editorHighlighter = await editorHighlighterPromise;
  const tokens = await Promise.all(
    blocks.map((block) =>
      editorHighlighter.codeToTokens(block.textContent, {
        lang: "mdc",
        theme:
          colorMode.value === "light"
            ? "material-theme-lighter"
            : "material-theme-palenight",
      }),
    ),
  );
  syntaxHighlightedTokens.value = tokens;
});
watch(
  [() => page.value?.blocks, () => colorMode.value],
  async ([blocks, colorMode], [oldBlocks]) => {
    if (!blocks || !blocks.length) {
      return;
    }

    const difference = diffLines(
      oldBlocks?.map((b) => b.textContent).join("\n") || "",
      blocks.map((b) => b.textContent).join("\n"),
    );
    const editorHighlighter = await editorHighlighterPromise;
    for (const change of difference?.changes || []) {
      if (change.type === "changed") {
        if (!syntaxHighlightedTokens.value[0]?.tokens?.[change.lineNum]) {
          return;
        }
        const rehighlightedLine = editorHighlighter.codeToTokens(
          change.content,
          {
            lang: "mdc",
            theme:
              colorMode === "light"
                ? "material-theme-lighter"
                : "material-theme-palenight",
          },
        ).tokens[0];
        if (!rehighlightedLine) continue;
        syntaxHighlightedTokens.value[0].tokens[change.lineNum] =
          rehighlightedLine;
        continue;
      }
      if (change.type === "added") {
        if (!syntaxHighlightedTokens.value[0]?.tokens) {
          continue;
        }
        const newTokens = editorHighlighter.codeToTokens(change.content, {
          lang: "mdc",
          theme:
            colorMode === "light"
              ? "material-theme-lighter"
              : "material-theme-palenight",
        }).tokens;
        syntaxHighlightedTokens.value[0].tokens.splice(
          change.lineNum,
          0,
          ...newTokens,
        );
        continue;
      }
      if (change.type === "removed") {
        syntaxHighlightedTokens.value[0]?.tokens?.splice(change.lineNum, 1);
        continue;
      }
    }
  },
  { deep: true },
);

const fileUploadOpen = ref(false);

const uploadCoverImage = (file: File) => {
  const blockId = page.value?.blocks?.at(0)?.id;
  if (!blockId) return;
  const textArea = element(blockId);
  if (!textArea) return;
  const form = new FormData();
  form.append("file", file);
  $fetch("/api/private/photos", {
    method: "POST",
    body: form,
    query: {
      pageId: page.value?.id,
      isCover: true,
    },
  })
    .then((res) => {
      if (!res || !res.pathname) {
        snackbarStore.enqueue("Failed to upload image", "error");
        return;
      }
      if (!page.value?.id) {
        console.warn("No page found to update cover URL");
        return;
      }
      updatePage({
        id: page.value.id,
        coverUrl: res.pathname,
      });
      fileUploadOpen.value = false;
      return;
    })
    .catch((e) => {
      snackbarStore.enqueue(
        e.response?._data?.message || "Failed to upload image",
        "error",
      );
    });
};
</script>

<template>
  <div
    :id="`page-${page?.id}`"
    class="z-0 flex h-full flex-auto flex-col dark:bg-stone-900 dark:text-white"
  >
    <FileUploadModal
      v-model:open="fileUploadOpen"
      accept="image/*"
      @save="uploadCoverImage"
    />
    <div class="relative flex flex-initial flex-col">
      <PageNav
        :preview-page="previewPage"
        :nodes="mdNodes || []"
        @toggle-preview="previewPage = !previewPage"
      />
    </div>
    <div class="relative flex w-full flex-auto overflow-hidden">
      <div
        class="flex h-full flex-col overflow-y-auto"
        :class="{
          'w-full': !previewPage,
          'w-7/12': previewPage,
        }"
      >
        <PageHeader v-if="page" @upload-cover="fileUploadOpen = true" />
        <div
          v-for="(block, i) in page?.blocks"
          :key="block.id"
          class="relative flex w-full flex-auto flex-col items-center pb-8"
        >
          <EditBlock
            v-if="block"
            :block="block"
            :tokens="syntaxHighlightedTokens[i]"
            :preview-page="previewPage"
            :color-mode="colorMode.value"
            @update-block="
              (text: string) => updateBlock(block.pageId, block.id, text)
            "
            @save-now="saveNow"
          />
        </div>
      </div>
      <div
        v-if="previewPage"
        class="relative flex w-5/12 flex-col overflow-y-auto border-l border-l-stone-300"
      >
        <UModal v-model:open="fullscreenPreview" fullscreen :close="true">
          <UTooltip text="Expand to fullscreen" :kbds="['meta', 'shift', 'E']">
            <UButton
              icon="i-heroicons-arrows-pointing-out"
              color="neutral"
              variant="ghost"
              class="sticky top-2 right-2 flex self-end"
            />
          </UTooltip>
          <template #body>
            <RenderedPage v-if="page" :nodes="mdNodes" :page="page" />
          </template>
          <template #close>
            <UTooltip text="Close preview" :kbds="['meta', 'shift', 'E']">
              <UButton
                icon="i-heroicons-arrows-pointing-in"
                color="neutral"
                variant="ghost"
                class="absolute top-2 right-2"
              />
            </UTooltip>
          </template>
        </UModal>
        <div class="w-full p-5">
          <RenderedPage
            v-if="page"
            :nodes="mdNodes"
            :page="page"
            :narrow-view="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
