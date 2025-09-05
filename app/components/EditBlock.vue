<script setup lang="ts">
import type { TokensResult } from "shiki";
import type { Command, CommandOptions } from "~~/types/page";

const props = defineProps<{
  block: Omit<Block, "renderedMd">;
  tokens?: TokensResult;
  previewPage?: boolean;
  colorMode: string;
}>();
const element = useTemplateRef("element");
const emits = defineEmits<{
  updateBlock: [text: string];
  saveNow: [];
  updateCaretPosition: [event: Event];
}>();
const snackbarStore = useSnackbar();
const undoRedo = useUndoRedo();

const updateBlock = (text: string) => {
  emits("updateBlock", text);
  undoRedo.pushState(text);
};
const redo = () => {
  if (!undoRedo.canRedo.value) {
    return;
  }
  const newText = undoRedo.redo();
  if (newText) {
    updateBlock(newText);
  }
};
const undo = () => {
  const newText = undoRedo.undo();
  if (newText) {
    updateBlock(newText);
  }
};
onUnmounted(() => {
  undoRedo.clear();
});

const editMenuOpen = ref(false);
const fileUploadOpen = ref(false);
const slash = (event: KeyboardEvent) => {
  if (event.key !== "/") {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  editMenuOpen.value = true;
};
//https://dev.to/shivams136/simple-markdown-insertion-in-the-text-using-pure-javascript-pl4
const insertFormating = (
  txtarea: HTMLTextAreaElement,
  text: string,
  defaultTxt = "",
  text2 = "",
) => {
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
    if (front.slice(-textLen) === text && back.slice(0, text2Len) === text2) {
      front = front.slice(0, front.length - textLen);
      back = back.slice(text2Len);
      text = "";
      text2 = "";
      mode = 2;
    } else if (
      middle.slice(0, textLen) === text &&
      middle.slice(-text2Len) === text2
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
const onEditMenuSelect = (
  command: Command | undefined,
  commandOptions: CommandOptions | undefined,
) => {
  editMenuOpen.value = false;
  const textArea = element.value;
  if (!textArea) {
    console.error("no text area");
    return;
  }
  setTimeout(() => {
    textArea?.focus();
  }, 0);
  if (command === "Upload Image") {
    fileUploadOpen.value = true;
    return;
  }
  insertFormating(textArea, ...getDefaultCommandItems(command, commandOptions));
  updateBlock(textArea.value);
};
const uploadImage = (file: File) => {
  const textArea = element.value;
  if (!textArea) return;
  const form = new FormData();
  form.append("file", file);
  $fetch("/api/private/photos", {
    method: "POST",
    body: form,
    query: {
      pageId: props.block.pageId,
      isCover: false,
    },
  })
    .then((res) => {
      if (!res || !res.pathname) {
        snackbarStore.enqueue("Failed to upload image", "error");
        return;
      }
      const fileName = file.name;
      fileUploadOpen.value = false;
      snackbarStore.enqueue("Image uploaded successfully", "success");
      setTimeout(() => {
        textArea?.focus();
      }, 0);
      insertFormating(textArea, "![", fileName, `](${res.pathname})`);
      updateBlock(textArea.value);
    })
    .catch((e) => {
      snackbarStore.enqueue(
        e.response?._data?.message || "Failed to upload image",
        "error",
      );
    });
};
const insertOrReplace = (textArea: HTMLTextAreaElement, text: string) => {
  const selectionStart = textArea.selectionStart;
  const selectionEnd = textArea.selectionEnd;
  const currentText = textArea.value;

  // If there's a selection, replace it; otherwise, insert at cursor
  const newText =
    currentText.slice(0, selectionStart) +
    text +
    currentText.slice(selectionEnd);

  updateBlock(newText);
  textArea.focus();
};
const updateBlockTextarea = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  updateBlock(target.value);
};
const onPaste = (event: ClipboardEvent) => {
  const clipboardData = event.clipboardData;
  if (!clipboardData) {
    return;
  }
  const items = clipboardData.items;
  for (const item of items) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        uploadImage(file);
        return;
      }
    }
  }
  const parser = new DOMParser();
  const html = clipboardData.getData("text/html");
  if (html) {
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");
    if (images.length > 0) {
      const image = images[0];
      const src = image?.getAttribute("src");
      if (src) {
        insertFormating(
          event.target as HTMLTextAreaElement,
          "![",
          "Image",
          `](${src})`,
        );
        updateBlock((event.target as HTMLTextAreaElement).value);
      }
    }
    const mdText = parseDom(doc.body);
    insertOrReplace(event.target as HTMLTextAreaElement, mdText);
    return;
  }
  const text = clipboardData.getData("text/plain");
  if (text) {
    insertOrReplace(event.target as HTMLTextAreaElement, text);
    return;
  }
};

const platformConsistent = (event: KeyboardEvent) => {
  if (navigator.platform.toLocaleLowerCase().includes("mac")) {
    return event.metaKey;
  }
  return event.ctrlKey;
};
const bold = (event: KeyboardEvent) => {
  const target = event.target as HTMLTextAreaElement;
  if (!platformConsistent(event)) {
    return;
  }
  event.preventDefault();
  insertFormating(target, "**", "", "**");

  updateBlock(target.value);
};

const italic = (event: KeyboardEvent) => {
  event.preventDefault();
  const target = event.target as HTMLTextAreaElement;
  if (!platformConsistent(event)) {
    return;
  }
  insertFormating(target, "__", "", "__");
  updateBlock(target.value);
};

const tab = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  insertFormating(target, "  ", "", "");
  updateBlock(target.value);
};
const paren = (event: KeyboardEvent) => {
  const textarea = event.target as HTMLTextAreaElement;
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
    insertFormating(
      event.target as HTMLTextAreaElement,
      event.key,
      "",
      parens[event.key],
    );
  } else if (Object.values(parens).includes(event.key)) {
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
  updateBlock(textarea.value);
};
</script>

<template>
  <div class="relative flex w-full flex-auto flex-col items-center pb-8">
    <EditMenu v-model:open="editMenuOpen" @option-selected="onEditMenuSelect" />
    <FileUploadModal
      v-model:open="fileUploadOpen"
      accept="image/*"
      @save="uploadImage"
    />
    <div
      v-if="tokens?.tokens"
      class="relative mt-4 flex w-full px-2 sm:w-8/12 lg:px-0"
      :class="{ 'sm:w-11/12': previewPage }"
    >
      <div class="flex w-full text-lg">
        <pre
          class="relative flex flex-col overflow-x-auto text-lg break-words whitespace-pre-wrap"
        >
          <code class="relative flex flex-col"><span
              v-for="(line, lineIndex) in tokens.tokens"
              :key="lineIndex"
              class="line block indent-0 relative min-h-[1lh]"
            ><span
                v-for="(token, tokenIndex) in line"
                :key="tokenIndex"
                :style="{
                  color: token.color,
                }"
              >{{token.content}}</span></span></code>
        </pre>
      </div>
      <textarea
        :id="`block-${block.id}`"
        ref="element"
        :spellcheck="false"
        :value="block.textContent"
        :style="{
          caretColor:
            colorMode === 'dark'
              ? 'var(--color-neutral-100)'
              : 'var(--color-neutral-900)',
        }"
        class="absolute inset-0 field-sizing-content h-full w-full resize-none overflow-visible border-none bg-transparent font-mono text-lg font-normal whitespace-pre-wrap text-transparent outline-hidden"
        @input="(event) => updateBlockTextarea(event)"
        @paste.prevent="onPaste"
        @keydown.meta.b="bold"
        @keydown.ctrl.b="bold"
        @keydown.meta.i="italic"
        @keydown.ctrl.i="italic"
        @keydown.tab.prevent.exact="tab"
        @keydown.shift.tab.prevent="tab"
        @keydown.meta.s.prevent="() => emits('saveNow')"
        @keydown.ctrl.s.prevent="() => emits('saveNow')"
        @keydown.meta.z.prevent="undo"
        @keydown.ctrl.z.prevent="undo"
        @keydown.meta.y.prevent="redo"
        @keydown.ctrl.y.prevent="redo"
        @keydown="
          (event) => {
            emits('updateCaretPosition', event);
            paren(event);
            slash(event);
          }
        "
        @click="(e) => emits('updateCaretPosition', e)"
      />
    </div>
  </div>
</template>
