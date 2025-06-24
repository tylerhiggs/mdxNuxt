<script setup lang="ts">
import type { Page, PageUpdate, Block, Command } from "@/types/page";
import { codeToTokens, type TokensResult } from "shiki";
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
  insertFormating("**", "", "**");
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
  insertFormating("__", "", "__");
  if (!element.value) {
    return;
  }
  emits("updateBlock", props.page.id, block.id, element.value.value);
};

const tab = (block: Block, remove = false) => {
  insertFormating("  ", "", "", remove);
  if (!element.value) {
    return;
  }
  emits("updateBlock", props.page.id, block.id, element.value.value);
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
  if (!element.value) {
    return;
  }
  emits("updateBlock", props.page.id, block.id, element.value.value);
};

//https://dev.to/shivams136/simple-markdown-insertion-in-the-text-using-pure-javascript-pl4
const insertFormating = (
  text: string,
  defaultTxt = "",
  text2 = "",
  remove = false,
) => {
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
watch([() => props.page.blocks, () => colorMode.value], async ([blocks]) => {
  if (!blocks || !blocks.length) {
    return;
  }
  const nodes = await Promise.all(
    blocks.map((block) => parseMd(block.textContent)),
  );
  mdNodes.value = nodes;
});

const syntaxHighlightedTokens = ref<TokensResult[]>([]);
watch([() => props.page.blocks, () => colorMode.value], async ([blocks]) => {
  if (!blocks || !blocks.length) {
    return;
  }
  syntaxHighlightedTokens.value = await Promise.all(
    blocks.map((block) =>
      codeToTokens(block.textContent, {
        lang: "mdc",
        theme:
          colorMode.value === "light"
            ? "material-theme-lighter"
            : "material-theme-darker",
      }),
    ),
  );
});

const editMenuOpen = ref(false);
const fileUploadOpen = ref(false);
const slash = (event: KeyboardEvent, block: Block) => {
  if (event.key !== "/") {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  editMenuOpen.value = true;
};

const onEditMenuSelect = (command: Command | undefined) => {
  editMenuOpen.value = false;
  setTimeout(() => {
    element.value?.focus();
  }, 0);

  switch (command) {
    case "Bold":
      insertFormating("**", "bold", "**");
      break;
    case "Italic":
      insertFormating("__", "italic", "__");
      break;
    case "Link":
      insertFormating("[link text](", "url", ")");
      break;
    case "Inline Code":
      insertFormating("`", "inline code", "`");
      break;
    case "Code Block":
      insertFormating("```ts\n", "const isFalse = (b: boolean) => !b", "\n```");
      break;
    case "Blockquote":
      insertFormating("> ", "", "");
      break;
    case "Image":
      fileUploadOpen.value = true;
      break;
    case "Inline Code - Syntax Highlighted":
      insertFormating("`", "inline code", "`{lang='ts'}");
      break;
    case "Inline Code - Success":
      insertFormating("`", "inline code", "`{color='success'}");
      break;
    case "Inline Code - Warning":
      insertFormating("`", "inline code", "`{color='warning'}");
      break;
    case "Inline Code - Error":
      insertFormating("`", "inline code", "`{color='error'}");
      break;
    case "Inline Code - Info":
      insertFormating("`", "inline code", "`{color='info'}");
      break;
    case "Ordered List":
      insertFormating("\n1. ", "List item", "");
      break;
    case "Unordered List":
      insertFormating("\n- ", "List item", "");
      break;
    default:
      insertFormating("/", "", "");
      break;
  }
};

const uploadImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  $fetch("/api/private/photos", {
    method: "POST",
    body: form,
    query: {
      pageId: props.page.id,
    },
  })
    .then((res) => {
      if (res && res.pathname) {
        const fileName = file.name;
        fileUploadOpen.value = false;
        snackbarStore.enqueue("Image uploaded successfully", "success");
        setTimeout(() => {
          element.value?.focus();
        }, 0);
        insertFormating("![", fileName, `](${res.pathname})`);
      } else {
        snackbarStore.enqueue("Failed to upload image", "error");
      }
    })
    .catch(() => {
      snackbarStore.enqueue("Failed to upload image", "error");
    });
};
</script>

<template>
  <div
    class="z-0 flex h-full flex-auto flex-col dark:bg-stone-900 dark:text-white"
  >
    <EditMenu v-model:open="editMenuOpen" @optionSelected="onEditMenuSelect" />
    <FileUploadModal
      v-model:open="fileUploadOpen"
      @save="uploadImage"
      accept="image/*"
    />
    <div class="relative flex flex-initial flex-col">
      <PageNav
        :page="props.page"
        :saved="props.isSaved"
        :previewPage="previewPage"
        :nodes="mdNodes || []"
        @favoritePage="favoritePage"
        @togglePreview="previewPage = !previewPage"
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
        <div class="z-0 flex flex-initial justify-center">
          <div class="flex w-8/12 flex-col">
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
          class="relative flex w-full flex-auto flex-col items-center pb-8"
        >
          <div
            class="relative mt-4 flex w-full px-2 sm:w-8/12 lg:px-0"
            :class="{ 'sm:w-11/12': previewPage }"
          >
            <div class="flex w-full text-lg">
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
                        backgroundColor: token.bgColor,
                      }"
                    >{{token.content}}</span></span></code>
              </pre>
            </div>
            <textarea
              ref="elements"
              :id="`${block.id}`"
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
              @keydown.tab.prevent="() => tab(block)"
              @keydown.shift.tab.prevent="() => tab(block, true)"
              @keydown="
                (event) => {
                  paren(event, block);
                  slash(event, block);
                }
              "
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
