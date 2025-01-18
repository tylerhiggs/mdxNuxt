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
  updateBlock: [pageId: string, blockId: string, content: string];
}>();

const focusedBlockId = ref(
  props.page.blocks.length ? props.page.blocks[0].id : undefined,
);
const element = computed(() => {
  return elements.value.find((el) => el.id === focusedBlockId.value);
});
const elements = ref<HTMLElement[]>([]);

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
const updateBlock = (event: Event, block: Block) => {
  const target = event.target as HTMLDivElement;
  const caretPosition = getCaretPosition();
  latestCaretPos.value = caretPosition;
  emits("updateBlock", props.page.id, block.id, target.innerText);
  nextTick(() => {
    resetCaretPositionToLatestValue(caretPosition);
  });
};

onBeforeUpdate(() => {
  latestCaretPos.value = getCaretPosition();
});

onUpdated(() => {
  if (element.value && getCaretPosition() !== latestCaretPos.value) {
    resetCaretPositionToLatestValue(latestCaretPos.value);
  }
});

/**
 * Get the current caret position in the contenteditable element
 */
const getCaretPosition = () => {
  try {
    const selection = window.getSelection();
    if (selection && element.value) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element.value);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      console.log("returning caret pos", preCaretRange.toString().length);
      return preCaretRange.toString().length;
    }
    console.error(
      `returning 0 because ${selection ? "element" : "selection"} is null`,
    );
    return 0;
  } catch (e) {
    console.error("Unable to get the caret position: ", e);
    return 0;
  }
};

const latestCaretPos = ref(0);

const resetCaretPositionToLatestValue = (index: number) => {
  const selection = window.getSelection();
  if (selection && element.value) {
    const range = document.createRange();
    let charCount = 0;
    let nodeStack = [element.value];
    let node,
      foundStart = false;

    while ((node = nodeStack.pop()) && !foundStart) {
      if (node.nodeType === 3) {
        // Text node
        const nextCharCount =
          charCount +
          (node.nodeType === 3 ? (node as unknown as Text).length : 0);
        if (index <= nextCharCount) {
          range.setStart(node, index - charCount);
          foundStart = true;
        } else {
          charCount = nextCharCount;
        }
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i] as HTMLElement);
        }
      }
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

const onEnter = (event: KeyboardEvent, block: Block) => {
  event.preventDefault();
  const selection = window.getSelection();
  if (!selection) return;
  const range = selection.getRangeAt(0);
  const br = document.createElement("br");
  range.insertNode(br);
  range.setStartAfter(br);
  range.collapse(true);
  latestCaretPos.value += 1;
};

const keydown = (event: KeyboardEvent, block: Block) => {
  console.log("keydown", event.key);
  if (
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowDown"
  ) {
    latestCaretPos.value = getCaretPosition();
  }
  if ((event.metaKey || event.ctrlKey) && event.key === "b") {
    event.preventDefault(); // Prevent the default browser action

    const selection = window.getSelection();
    if (!selection) return;
    const range = selection.getRangeAt(0);

    if (range && !selection.isCollapsed) {
      // Wrap the selected text in ** for bold
      const selectedText = selection.toString();
      const boldedText = `**${selectedText}**`;

      // Replace the selected text with bolded text
      range.deleteContents();
      range.insertNode(document.createTextNode(boldedText));

      // Move the caret to the end of the bolded text
      selection.collapseToEnd();

      // Update the content state
      updateBlock(event, block);
    } else {
      // No text selected; insert ** for bold typing
      const boldMarkers = "**";
      const textNode = document.createTextNode(boldMarkers);
      const laterTextNode = document.createTextNode(boldMarkers);

      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.insertNode(laterTextNode);
      range.collapse(true);

      // Update the content state
      updateBlock(event, block);
    }
  }
};

const click = (block: Block) => {
  focusedBlockId.value = block.id;
  latestCaretPos.value = getCaretPosition();
};
</script>

<style scoped>
.textarea {
  display: block;
  overflow: hidden;
  min-height: 80%;
  line-height: 20px;
}

.textarea[contenteditable]:empty::before {
  content: "Write something, or type / to use commands";
  color: gray;
}
</style>

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
      <span
        contenteditable
        @input="(event) => updateBlock(event, block)"
        @keydown.meta.b="(event) => keydown(event, block)"
        @keydown.ctrl.b="(event) => keydown(event, block)"
        @keydown.right="(event) => keydown(event, block)"
        @keydown.left="(event) => keydown(event, block)"
        @keydown.up="(event) => keydown(event, block)"
        @keydown.down="(event) => keydown(event, block)"
        @keydown.enter="(event) => onEnter(event, block)"
        @click="() => click(block)"
        v-for="block in page.blocks"
        :key="block.id"
        ref="elements"
        :id="block.id"
        v-html="block.textContent"
        class="textarea mt-4 w-8/12 resize-none border-none bg-transparent text-lg outline-none dark:text-white"
      >
      </span>
    </div>
  </div>
</template>
