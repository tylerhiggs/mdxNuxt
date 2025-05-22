<script setup lang="ts">
import type { Page, PageUpdate, Block } from "@/types/page";
import { codeToTokens, type TokensResult } from "shiki";
import { parseMd } from "~/shared/parseMd";
import type { MdNode } from "~/shared/types";
const snackbarStore = useSnackbar();
const props = defineProps<{
  page: Page;
  isSaved: boolean;
}>();

const emits = defineEmits<{
  updatePage: [page: PageUpdate, instantSave?: boolean];
  updateBlock: [pageId: number, blockId: number, content: string];
}>();

const previewPage = ref(false);
const focusedBlockId = ref(
  props.page.blocks.length ? props.page.blocks[0].id : undefined,
);
const element = computed(() => {
  return elements.value.find((el) => Number(el.id) === focusedBlockId.value);
});
const elements = ref<HTMLTextAreaElement[]>([]);

watch(element, (el) => {
  if (el) {
    el.focus();
  }
});

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

const updateBlockTextarea = (event: Event, block: Block) => {
  const target = event.target as HTMLTextAreaElement;
  emits("updateBlock", props.page.id, block.id, target.value);
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
  insertFormating("**");
  if (!element.value) {
    return;
  }
  emits("updateBlock", props.page.id, block.id, element.value.value);
};

const italic = (event: KeyboardEvent, block: Block) => {
  event.preventDefault(); // Prevent the default browser action
  if (!platformConsistent(event)) {
    return;
  }
  insertFormating("__");
  if (!element.value) {
    return;
  }
  emits("updateBlock", props.page.id, block.id, element.value.value);
};

const tab = (block: Block) => {
  insertFormating("  ");
  if (!element.value) {
    return;
  }
  emits("updateBlock", props.page.id, block.id, element.value.value);
};

const paren = (event: KeyboardEvent, block: Block) => {
  if (event.key !== "(" && event.key !== ")") {
    return;
  }
  if (event.key === "(") {
    event.preventDefault();
    insertFormating("(", "", ")");
  } else if (event.key === ")" && element.value) {
    const textarea = element.value;
    const caretPos = textarea.selectionStart;
    const text = textarea.value;
    const charAfterCaret = text.charAt(caretPos);

    if (charAfterCaret === ")") {
      event.preventDefault();
      // Move the caret after the existing closing parenthesis
      textarea.setSelectionRange(caretPos + 1, caretPos + 1);
      textarea.focus();
    }
  }
  if (!element.value) {
    return;
  }
  emits("updateBlock", props.page.id, block.id, element.value.value);
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
  if (text2 == "") {
    text2 = text;
  }
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
};

const mdNodes = ref<MdNode[][]>([]);
watch(
  () => props.page.blocks,
  async (blocks) => {
    if (!blocks || !blocks.length) {
      return;
    }
    const nodes = await Promise.all(
      blocks.map((block) => parseMd(block.textContent)),
    );
    mdNodes.value = nodes;
  },
);

const syntaxHighlightedTokens = ref<TokensResult[]>([]);
watch(
  () => props.page.blocks,
  async () => {
    const { blocks } = props.page;
    if (!blocks || !blocks.length) {
      return;
    }
    syntaxHighlightedTokens.value = await Promise.all(
      blocks.map((block) =>
        codeToTokens(block.textContent, {
          lang: "markdown",
          theme: import.meta.client
            ? window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "vitesse-dark"
              : "vitesse-light"
            : "vitesse-light",
        }),
      ),
    );
  },
);
</script>

<template>
  <div class="absolute inset-0 left-64 z-0 dark:bg-stone-900 dark:text-white">
    <div class="flex flex-initial flex-col">
      <PageNav
        :page="props.page"
        :saved="props.isSaved"
        :previewPage="previewPage"
        :nodes="mdNodes || []"
        @favoritePage="favoritePage"
        @togglePreview="previewPage = !previewPage"
      />
    </div>
    <div class="flex min-h-full w-full flex-auto">
      <div
        class="flex min-h-full flex-col overflow-y-auto"
        :class="{
          'w-full': !previewPage,
          'w-7/12': previewPage,
        }"
      >
        <div class="z-0 flex flex-initial justify-center">
          <div class="flex h-full w-8/12 flex-col">
            <div class="group pt-12">
              <UPopover>
                <UButton
                  variant="ghost"
                  color="neutral"
                  class="flex rounded-md border-none text-7xl hover:bg-gray-100 focus:outline-hidden dark:hover:bg-stone-600"
                >
                  {{ page.emoji }}
                </UButton>
                <template #content>
                  <LazyEmojiPicker @select="selectEmoji" />
                </template>
              </UPopover>
              <div
                class="invisible my-1 flex items-center text-xs text-gray-400 group-hover:visible"
              >
                <button
                  class="mr-1 flex items-center rounded-md p-1 hover:bg-gray-100 dark:hover:bg-stone-600"
                  @click="
                    () => snackbarStore.enqueue('Not implemented', 'warning')
                  "
                >
                  <UIcon name="i-heroicons-photo" class="mr-2 size-5" />
                  Add cover
                </button>
                <button
                  class="flex items-center rounded-md p-1 hover:bg-gray-100 dark:hover:bg-stone-600"
                  @click="
                    () => snackbarStore.enqueue('Not implemented', 'warning')
                  "
                >
                  <UIcon
                    name="i-heroicons-chat-bubble-bottom-center-text"
                    class="mr-2 size-5"
                  />
                  Add comment
                </button>
              </div>

              <h1 class="mt-1 w-full text-4xl font-bold">
                <input
                  type="text"
                  :value="page.title"
                  @input="updateTitle"
                  placeholder="Untitled"
                  class="w-full outline-hidden dark:bg-inherit"
                />
              </h1>
            </div>
          </div>
        </div>

        <div
          v-for="(block, i) in props.page.blocks"
          :key="block.id"
          class="relative flex h-full w-full flex-auto flex-col items-center overflow-y-auto"
        >
          <div class="relative mt-4 flex min-h-full w-8/12">
            <div class="flex text-lg">
              <pre
                class="relative flex flex-col overflow-x-auto text-lg break-words whitespace-pre-wrap"
              >
                <code class="relative flex flex-col"><span
                    v-if="syntaxHighlightedTokens?.[i]?.tokens"
                    v-for="(line, lineIndex) in syntaxHighlightedTokens[i].tokens"
                    :key="lineIndex"
                    class="line block indent-0 relative min-h-[1lh]"
                  ><span
                      v-for="(token) in line"
                      :style="{
                        color: token.color,
                      }"
                    >{{token.content}}</span></span></code>
              </pre>
            </div>
            <textarea
              ref="elements"
              :id="`${block.id}`"
              :value="block.textContent"
              class="absolute inset-0 min-h-full resize-none border-none bg-transparent font-mono text-lg font-normal whitespace-pre-wrap opacity-20 outline-hidden dark:text-white"
              @input="(event) => updateBlockTextarea(event, block)"
              @keydown.meta.b="(event) => bold(event, block)"
              @keydown.ctrl.b="(event) => bold(event, block)"
              @keydown.meta.i="(event) => italic(event, block)"
              @keydown.ctrl.i="(event) => italic(event, block)"
              @keydown.tab.prevent="() => tab(block)"
              @keydown="(event) => paren(event, block)"
            />
          </div>
        </div>
      </div>
      <div
        v-if="previewPage"
        class="flex w-5/12 flex-col overflow-y-auto border-l border-l-stone-300"
      >
        <div class="flex flex-initial items-center gap-2 p-4">
          <p class="text-5xl">{{ page.emoji }}</p>
          <p class="text-lg font-semibold">{{ page.title }}</p>
        </div>
        <div class="flex flex-auto flex-col p-4">
          <div
            v-for="(block, index) in page.blocks"
            :key="block.id"
            class="mb-4 text-lg"
          >
            <div
              v-if="
                block.type === 'text' &&
                block.renderedMd &&
                mdNodes?.length === page.blocks.length
              "
              v-for="node in mdNodes[index] || []"
            >
              <MdNode :node="node" :preview="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
