<script setup lang="ts">
import type { EmojiData, Tone } from "#build/imports";
import type { DropdownMenuItem } from "@nuxt/ui";

const PAGE_SIZE = 20;

const emits = defineEmits<{
  select: [emoji: string];
}>();

const focusedItemIndex = ref(0);

const emojiDataStore = useEmojiData();

const searchHtmlInput = ref<HTMLInputElement | null>(null);
const search = ref("");
const skinTone = ref<Tone | null>(null);
const skinToneEmoji = computed(() => {
  if (!skinTone.value) return "🖐️";
  return skinTone.value === "light"
    ? "🖐🏻"
    : skinTone.value === "medium-light"
      ? "🖐🏼"
      : skinTone.value === "medium"
        ? "🖐🏽"
        : skinTone.value === "medium-dark"
          ? "🖐🏾"
          : "🖐🏿";
});

watch(searchHtmlInput, (input) => {
  if (input) {
    input.focus();
  }
});

watch(
  search,
  (value) => {
    if (value) {
      numEmojis.value = PAGE_SIZE;
    }
  },
  { immediate: false },
);

const numEmojis = ref(PAGE_SIZE);

const { data: filteredEmojis } = useAsyncData(
  computed(() => search.value + numEmojis.value),
  () => {
    return new Promise<{
      filteredEmojiData: EmojiData[];
      groupedFilteredEmojiData: { [group: string]: EmojiData[] };
    }>((resolve) => {
      if (!search.value) {
        const filtered = Object.values(emojiDataStore.emojiData.value).reduce(
          (acc, emojis) => {
            acc.push(...emojis);
            return acc;
          },
          [],
        );
        const grouped = getGroupedFilteredEmojiData(filtered);
        resolve({
          filteredEmojiData: filtered,
          groupedFilteredEmojiData: grouped,
        });
        return;
      }
      const searchValue = search.value.toLocaleLowerCase();
      const filtered = emojiDataStore.searchEmoji(searchValue);
      if (filtered.length > numEmojis.value) {
        filtered.splice(numEmojis.value);
      }
      const grouped = getGroupedFilteredEmojiData(filtered);
      resolve({
        filteredEmojiData: filtered,
        groupedFilteredEmojiData: grouped,
      });
    });
  },
  {
    lazy: true,
  },
);

const getGroupedFilteredEmojiData = (filteredData: EmojiData[]) => {
  const res =
    search.value !== ""
      ? filteredData.reduce(
          (acc, emoji) => {
            if (!acc[emoji.group]) {
              acc[emoji.group] = [];
            }
            acc[emoji.group].push(emoji);
            return acc;
          },
          {} as { [group: string]: EmojiData[] },
        )
      : emojiDataStore.emojiData.value;
  let ret = {} as { [group: string]: EmojiData[] };
  let left = numEmojis.value;
  if (!res) return ret;
  Object.keys(res)
    .filter((key) => res[key].length)
    .forEach((key) => {
      if (left <= 0) return;
      ret[key] = res[key].slice(0, numEmojis.value);
      left -= res[key].length;
    });
  return ret;
};

const handleScroll = (event: Event) => {
  if (!event.target) return;
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
    console.log("load more emojis");
    numEmojis.value += PAGE_SIZE * 3;
  }
};

const selectRandomEmoji = () => {
  const flatEmojis = Object.values(emojiDataStore.emojiData.value).reduce(
    (acc, emojis) => {
      acc.push(...emojis);
      return acc;
    },
    [] as EmojiData[],
  );
  const randomIndex = Math.floor(Math.random() * flatEmojis.length);
  const emojiItem = flatEmojis[randomIndex];
  const char =
    emojiItem.altColors && skinTone.value
      ? emojiItem.altColors[skinTone.value]
      : emojiItem.char;
  if (!char) {
    console.error("No emoji found");
    return;
  }
  emits("select", char);
};

const tones: { tone: Tone | null; char: string }[] = [
  {
    tone: null,
    char: "🖐️",
  },
  {
    tone: "light",
    char: "🖐🏻",
  },
  {
    tone: "medium-light",
    char: "🖐🏼",
  },
  {
    tone: "medium",
    char: "🖐🏽",
  },
  {
    tone: "medium-dark",
    char: "🖐🏾",
  },
  {
    tone: "dark",
    char: "🖐🏿",
  },
];

const items = computed(
  () =>
    tones.map((tone) => ({
      label: tone.char,
      type: "checkbox" as const,
      checked: tone.tone === skinTone.value,
      onUpdateChecked: (_: boolean) => {
        skinTone.value = tone.tone;
      },
    })) satisfies DropdownMenuItem[],
);

const incrementFocusedItemIndex = (n: number) => {
  const len = filteredEmojis.value?.filteredEmojiData?.length || 0;
  const newIndex = focusedItemIndex.value + n;
  if (newIndex < 0) {
    focusedItemIndex.value = 0;
  } else if (newIndex >= len) {
    focusedItemIndex.value = len - 1;
  } else {
    focusedItemIndex.value = newIndex;
  }
};
const selectEmoji = () => {
  const emojiItem =
    filteredEmojis.value?.filteredEmojiData[focusedItemIndex.value];
  const char = emojiItem?.char;
  if (!char) {
    console.error("No emoji found");
    return;
  }
  // Click on the button with id 'char'
  const button = document.getElementById(char);
  if (button) {
    button.click();
  }
};

const focusableIds = ["emojiSearch", "randomEmojiButton", "skinToneButton"];
const handleTabKey = (num: number) => {
  console.log("handleTabKey", num);
  const currentIndex = focusableIds.indexOf(document.activeElement?.id || "");
  if (currentIndex === -1) {
    console.error("No focusable element found");
    return;
  }
  const nextIndex =
    (currentIndex + num + focusableIds.length) % focusableIds.length;
  const nextElement = document.getElementById(focusableIds[nextIndex]);
  if (!nextElement) {
    console.error("No next element found");
    return;
  }
  nextElement.focus();
};

const select = (emoji: string) => {
  emits("select", emoji);
  searchHtmlInput.value?.focus();
};
</script>

<template>
  <div class="w-80 rounded-lg bg-white shadow-lg">
    <div class="flex items-center p-1">
      <div
        class="m-1 flex w-full cursor-text items-center justify-between rounded-sm border border-gray-300 bg-gray-100 p-1 focus-within:border-blue-200"
        @click="searchHtmlInput?.focus()"
      >
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="size-4 text-gray-500"
        />
        {{}}
        <input
          :id="focusableIds[0]"
          ref="searchHtmlInput"
          type="text"
          class="ml-1 w-full border-none bg-transparent text-sm text-gray-700 focus:outline-hidden"
          placeholder="Filter..."
          v-model="search"
          @keydown.down.prevent.stop="incrementFocusedItemIndex(4)"
          @keydown.up.prevent.stop="incrementFocusedItemIndex(-4)"
          @keydown.left.prevent.stop="incrementFocusedItemIndex(-1)"
          @keydown.right.prevent.stop="incrementFocusedItemIndex(1)"
          @keydown.enter.prevent.stop="selectEmoji()"
          @keydown.tab.exact.prevent.stop="handleTabKey(1)"
          @keydown.shift.tab.prevent.stop="handleTabKey(-1)"
        />
        <button
          v-if="search"
          class="flex items-center justify-center"
          @click="search = ''"
        >
          <UIcon
            name="i-heroicons-x-circle-20-solid"
            class="size-4 text-gray-400 hover:text-gray-500"
          />
        </button>
      </div>
      <ToolTip message="Select a random emoji" position="bottom">
        <button
          @click="selectRandomEmoji"
          :id="focusableIds[1]"
          @keydown.tab.exact.prevent.stop="handleTabKey(1)"
          @keydown.shift.tab.prevent.stop="handleTabKey(-1)"
          class="flex size-7 items-center justify-center rounded-sm border border-gray-300 hover:bg-gray-300 focus:bg-gray-300"
        >
          <UIcon name="i-heroicons-swatch" class="size-4 text-gray-500" />
        </button>
      </ToolTip>
      <UDropdownMenu :items="items">
        <UButton
          :id="focusableIds[2]"
          @keydown.tab.exact.prevent.stop="handleTabKey(1)"
          @keydown.shift.tab.prevent.stop="handleTabKey(-1)"
          variant="ghost"
          color="neutral"
          class="relative mx-1 flex size-7 items-center justify-center rounded-sm border border-gray-300 hover:bg-gray-300 focus:bg-gray-300"
        >
          <ToolTip message="Select skin tone" position="bottom">
            {{ skinToneEmoji }}
          </ToolTip>
        </UButton>
      </UDropdownMenu>
    </div>
    <div
      @scroll="handleScroll"
      class="relative h-80 overflow-x-visible overflow-y-scroll"
    >
      <div v-if="(filteredEmojis?.filteredEmojiData?.length || 0) > 120">
        <div
          v-for="group in Object.keys(
            filteredEmojis?.groupedFilteredEmojiData || {},
          )"
          :key="group"
          class="w-full border-t border-gray-300"
        >
          <h2 class="p-1 text-sm font-semibold">{{ group }}</h2>
          <div class="flex justify-center">
            <div class="grid grid-cols-4 p-1">
              <div
                v-for="(emoji, i) in filteredEmojis?.groupedFilteredEmojiData?.[
                  group
                ] || []"
                :key="emoji.char"
                class="aspect-square"
              >
                <EmojiButton
                  :skinTone="skinTone"
                  :emoji="emoji"
                  @select="select"
                  :focused="focusedItemIndex === i"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-wrap p-1">
        <EmojiButton
          v-for="(emoji, i) in filteredEmojis?.filteredEmojiData || []"
          :key="emoji.char"
          :skinTone="skinTone"
          :emoji="emoji"
          @select="select"
          :focused="focusedItemIndex === i"
        />
      </div>
    </div>
  </div>
</template>
