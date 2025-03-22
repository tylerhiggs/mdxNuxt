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
  updateBlock: [pageId: number, blockId: number, content: string];
}>();

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

const openParen = (event: KeyboardEvent, block: Block) => {
  if (event.key !== "(") {
    return;
  }
  event.preventDefault(); // Prevent the default browser action
  insertFormating("(", "", ")");
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
  const scrollPos = txtarea.scrollTop;
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
  txtarea.scrollTop = scrollPos;
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

    <div
      class="field-sizing-content flex h-full w-full resize-y flex-col items-center"
    >
      <textarea
        v-for="block in page.blocks"
        ref="elements"
        :id="`${block.id}`"
        :value="block.textContent"
        class="text-md mt-4 min-h-full w-8/12 resize-none border-none bg-transparent font-sans text-lg font-normal outline-none dark:text-white"
        @input="(event) => updateBlockTextarea(event, block)"
        @keydown.meta.b="(event) => bold(event, block)"
        @keydown.ctrl.b="(event) => bold(event, block)"
        @keydown.meta.i="(event) => italic(event, block)"
        @keydown.ctrl.i="(event) => italic(event, block)"
        @keydown="(event) => openParen(event, block)"
      />
    </div>
  </div>
</template>
