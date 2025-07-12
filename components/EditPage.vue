<script setup lang="ts">
import type { Block, Command, CommandOptions } from "@/types/page";
import { codeToTokens } from "shiki";
import type { TokensResult } from "shiki";
import type { MdNode } from "~/shared/types";
const snackbarStore = useSnackbar();

const { currentPage: page, updatePage, updateBlock } = usePageState();

const previewPage = ref(false);
const focusedBlockId = ref(
  page.value?.blocks.length ? page.value.blocks[0].id : undefined,
);
const element = computed(() => {
  return elements.value.find((el) => Number(el.id) === focusedBlockId.value);
});
const elements = ref<HTMLTextAreaElement[]>([]);
const caretPosition = ref(0);

watch(element, (el) => {
  if (el) {
    el.focus();
  }
});

const updateBlockTextarea = (event: Event, block: Block) => {
  const target = event.target as HTMLTextAreaElement;
  if (!page.value) {
    return;
  }
  updateBlock(page.value.id, block.id, target.value);
};

const platformConsistent = (event: KeyboardEvent) => {
  if (navigator.platform.toLocaleLowerCase().includes("mac")) {
    return event.metaKey;
  }
  return event.ctrlKey;
};

const bold = (event: KeyboardEvent, block: Block) => {
  event.preventDefault(); // Prevent the default browser action
  if (!platformConsistent(event)) {
    return;
  }
  insertFormating("**", "", "**");
  if (!element.value || !page.value) {
    return;
  }
  updateBlock(page.value.id, block.id, element.value.value);
};

const italic = (event: KeyboardEvent, block: Block) => {
  event.preventDefault(); // Prevent the default browser action
  if (!platformConsistent(event)) {
    return;
  }
  insertFormating("__", "", "__");
  if (!element.value || !page.value) {
    return;
  }
  updateBlock(page.value.id, block.id, element.value.value);
};

const tab = (block: Block) => {
  insertFormating("  ", "", "");
  if (!element.value || !page.value) {
    return;
  }
  updateBlock(page.value.id, block.id, element.value.value);
};

const paren = (event: KeyboardEvent, block: Block) => {
  const parens: Record<string, string> = {
    "(": ")",
    "{": "}",
    "[": "]",
    "<": ">",
  };
  if (!(event.key in parens) && !Object.values(parens).includes(event.key)) {
    return;
  }
  if (event.key in parens) {
    event.preventDefault();
    insertFormating(event.key, "", parens[event.key]);
  } else if (Object.values(parens).includes(event.key) && element.value) {
    const textarea = element.value;
    const caretPos = textarea.selectionStart;
    const text = textarea.value;
    const charAfterCaret = text.charAt(caretPos);

    if (charAfterCaret === event.key) {
      event.preventDefault();
      // Move the caret after the existing closing parenthesis
      textarea.setSelectionRange(caretPos + 1, caretPos + 1);
      textarea.focus();
    }
  }
  if (!element.value || !page.value) {
    return;
  }
  updateBlock(page.value.id, block.id, element.value.value);
};

//https://dev.to/shivams136/simple-markdown-insertion-in-the-text-using-pure-javascript-pl4
const insertFormating = (text: string, defaultTxt = "", text2 = "") => {
  const txtarea = element.value;
  if (!txtarea) {
    console.error(
      `No text area found in insertFormating(${text}, ${defaultTxt}, ${text2})`,
    );
    return;
  }
  const selectStart = txtarea.selectionStart;
  const selectEnd = txtarea.selectionEnd;
  const caretPos = txtarea.selectionStart;
  let mode = 0;
  let front = txtarea.value.substring(0, caretPos);
  let back = txtarea.value.substring(selectEnd, txtarea.value.length);
  let middle = txtarea.value.substring(caretPos, selectEnd);

  // Sets ending tag as opening tag if empty

  const textLen = text.length;
  const text2Len = text2.length;

  if (selectStart === selectEnd) {
    middle = defaultTxt;
    mode = 1;
  } else {
    if (front.slice(-textLen) == text && back.slice(0, text2Len) == text2) {
      front = front.slice(0, front.length - textLen);
      back = back.slice(text2Len);
      text = "";
      text2 = "";
      mode = 2;
    } else if (
      middle.slice(0, textLen) == text &&
      middle.slice(-text2Len) == text2
    ) {
      middle = middle.slice(textLen, middle.length - text2Len);
      text = "";
      text2 = "";
      mode = 3;
    }
  }
  txtarea.value = front + text + middle + text2 + back;
  if (selectStart !== selectEnd) {
    if (mode === 0) {
      txtarea.selectionStart = selectStart + textLen;
      txtarea.selectionEnd = selectEnd + textLen;
    } else if (mode === 2) {
      txtarea.selectionStart = selectStart - textLen;
      txtarea.selectionEnd = selectEnd - textLen;
    } else if (mode === 3) {
      txtarea.selectionStart = selectStart;
      txtarea.selectionEnd = selectEnd - textLen - text2Len;
    }
  } else {
    txtarea.selectionStart = selectStart + textLen;
    txtarea.selectionEnd = txtarea.selectionStart + middle.length;
  }
  txtarea.focus();

  // Manually dispatch input event so undo works
  const event =
    typeof InputEvent === "function"
      ? new InputEvent("input", { bubbles: true, inputType: "insertText" })
      : new Event("input", { bubbles: true });
  txtarea.dispatchEvent(event);
};

const colorMode = useColorMode();
const mdNodes = ref<MdNode[][]>([]);
watch([() => page.value?.blocks, () => colorMode.value], async ([blocks]) => {
  if (!blocks || !blocks.length) {
    return;
  }
  const nodes = await Promise.all(
    blocks.map((block) => parseMd(block.textContent)),
  );
  mdNodes.value = nodes;
});

const syntaxHighlightedTokens = ref<TokensResult[]>([]);
watch(
  [() => page.value?.blocks, () => colorMode.value, caretPosition],
  async ([blocks, colorMode, caretPosition]) => {
    if (!blocks || !blocks.length) {
      return;
    }
    const tokens = await Promise.all(
      blocks.map((block) =>
        codeToTokens(block.textContent, {
          lang: "mdc",
          theme:
            colorMode === "light"
              ? "material-theme-lighter"
              : "material-theme-palenight",
        }),
      ),
    );
    const caretLineIndex =
      (element.value?.value ?? "").slice(0, caretPosition).split("\n").length -
        1 || 0;
    syntaxHighlightedTokens.value = tokens.map((blockTokenResult) => ({
      ...blockTokenResult,
      tokens: blockTokenResult.tokens.map((line, index) =>
        index === caretLineIndex && !line.length
          ? [{ content: "Press '/' for commands", color: "gray", offset: 0 }]
          : line,
      ),
    }));
  },
);

const editMenuOpen = ref(false);
const fileUploadOpen = ref(false);
const isFileUploadCover = ref(false);
const slash = (event: KeyboardEvent) => {
  if (event.key !== "/") {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  editMenuOpen.value = true;
};

const onEditMenuSelect = (
  command: Command | undefined,
  commandOptions: CommandOptions | undefined,
) => {
  editMenuOpen.value = false;
  setTimeout(() => {
    element.value?.focus();
  }, 0);
  if (command === "Upload Image") {
    fileUploadOpen.value = true;
    isFileUploadCover.value = false;
    return;
  }
  insertFormating(...getDefaultCommandItems(command, commandOptions));
};

const uploadImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  $fetch("/api/private/photos", {
    method: "POST",
    body: form,
    query: {
      pageId: page.value?.id,
      isCover: isFileUploadCover.value,
    },
  })
    .then((res) => {
      if (!res || !res.pathname) {
        snackbarStore.enqueue("Failed to upload image", "error");
        return;
      }
      if (isFileUploadCover.value) {
        if (!page.value) {
          console.warn("No page found to update cover URL");
          return;
        }
        updatePage({
          id: page.value.id,
          coverUrl: res.pathname,
        });
        fileUploadOpen.value = false;
        return;
      }
      const fileName = file.name;
      fileUploadOpen.value = false;
      snackbarStore.enqueue("Image uploaded successfully", "success");
      setTimeout(() => {
        element.value?.focus();
      }, 0);
      insertFormating("![", fileName, `](${res.pathname})`);
    })
    .catch(() => {
      snackbarStore.enqueue("Failed to upload image", "error");
    });
};

const updateCaretPosition = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  setTimeout(() => {
    caretPosition.value = target.selectionStart;
  }, 0);
};
</script>

<template>
  <div
    class="z-0 flex h-full flex-auto flex-col dark:bg-stone-900 dark:text-white"
  >
    <EditMenu v-model:open="editMenuOpen" @option-selected="onEditMenuSelect" />
    <FileUploadModal
      v-model:open="fileUploadOpen"
      accept="image/*"
      @save="uploadImage"
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
        <PageHeader
          v-if="page"
          @upload-cover="
            fileUploadOpen = true;
            isFileUploadCover = true;
          "
        />
        <div
          v-for="(block, i) in page?.blocks"
          :key="block.id"
          class="relative flex w-full flex-auto flex-col items-center pb-8"
        >
          <div
            v-if="syntaxHighlightedTokens?.[i]?.tokens"
            class="relative mt-4 flex w-full px-2 sm:w-8/12 lg:px-0"
            :class="{ 'sm:w-11/12': previewPage }"
          >
            <div class="flex w-full text-lg">
              <pre
                class="relative flex flex-col overflow-x-auto text-lg break-words whitespace-pre-wrap"
              >
                <code class="relative flex flex-col"><span
                    v-for="(line, lineIndex) in syntaxHighlightedTokens[i].tokens"
                    :key="lineIndex"
                    class="line block indent-0 relative min-h-[1lh]"
                  ><span
                      v-for="(token, tokenIndex) in line"
                      :key="tokenIndex"
                      :style="{
                        color: token.color,
                        backgroundColor: token.bgColor,
                      }"
                    >{{token.content}}</span></span></code>
              </pre>
            </div>
            <textarea
              :id="`${block.id}`"
              ref="elements"
              :spellcheck="false"
              :value="block.textContent"
              :style="{
                caretColor:
                  colorMode.value === 'dark'
                    ? 'var(--color-neutral-100)'
                    : 'var(--color-neutral-900)',
              }"
              class="absolute inset-0 field-sizing-content h-full w-full resize-none overflow-visible border-none bg-transparent font-mono text-lg font-normal whitespace-pre-wrap text-transparent outline-hidden"
              @input="(event) => updateBlockTextarea(event, block)"
              @keydown.meta.b="(event) => bold(event, block)"
              @keydown.ctrl.b="(event) => bold(event, block)"
              @keydown.meta.i="(event) => italic(event, block)"
              @keydown.ctrl.i="(event) => italic(event, block)"
              @keydown.tab.prevent.exact="() => tab(block)"
              @keydown.shift.tab.prevent="() => tab(block)"
              @keydown="
                (event) => {
                  updateCaretPosition(event);
                  paren(event, block);
                  slash(event);
                }
              "
              @click="
                (event) => {
                  updateCaretPosition(event);
                }
              "
            />
          </div>
        </div>
      </div>
      <div
        v-if="previewPage"
        class="relative flex w-5/12 flex-col overflow-y-auto border-l border-l-stone-300"
      >
        <UModal fullscreen :close="true">
          <UButton
            icon="i-heroicons-arrows-pointing-out"
            color="neutral"
            class="absolute top-2 right-2"
          />
          <template #body>
            <RenderedPage v-if="page" :nodes="mdNodes" :page="page" />
          </template>
          <template #close>
            <UButton
              icon="i-heroicons-arrows-pointing-in"
              color="neutral"
              class="absolute top-2 right-2"
            />
          </template>
        </UModal>
        <div class="w-full *:*:w-full">
          <RenderedPage v-if="page" :nodes="mdNodes" :page="page" />
        </div>
      </div>
    </div>
  </div>
</template>
