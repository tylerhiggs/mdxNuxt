<script setup lang="ts">
import type { EmojiData, Tone } from "#build/imports";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { MagnifyingGlassIcon, SwatchIcon } from "@heroicons/vue/24/outline";
import { XCircleIcon } from "@heroicons/vue/24/solid";

const PAGE_SIZE = 120;

const emits = defineEmits<{
  select: [emoji: string];
}>();

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

const numEmojis = ref(PAGE_SIZE);

const filteredEmojiData = ref<EmojiData[]>(
  Object.values(emojiDataStore.emojiData.value).reduce((acc, emojis) => {
    acc.push(...emojis);
    return acc;
  }, []),
);

watch(search, (value) => {
  numEmojis.value = PAGE_SIZE;
  if (!value) {
    filteredEmojiData.value = Object.values(
      emojiDataStore.emojiData.value,
    ).reduce((acc, emojis) => {
      acc.push(...emojis);
      return acc;
    }, []);
    return;
  }
  const searchValue = value.toLocaleLowerCase();
  filteredEmojiData.value = emojiDataStore.searchEmoji(searchValue);
});

const groupedFilteredEmojiData = computed(() => {
  const res =
    search.value !== ""
      ? filteredEmojiData.value.reduce(
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
  Object.keys(res)
    .filter((key) => res[key].length)
    .forEach((key) => {
      if (left <= 0) return;
      ret[key] = res[key].slice(0, numEmojis.value);
      left -= res[key].length;
    });
  return ret;
});

const handleScroll = (event: Event) => {
  if (!event.target) return;
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
    numEmojis.value += PAGE_SIZE;
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
</script>

<template>
  <div class="w-80 rounded-lg bg-white shadow-lg">
    <div class="flex items-center p-1">
      <div
        class="m-1 flex w-full cursor-text items-center justify-between rounded-sm border border-gray-300 bg-gray-100 p-1 focus-within:border-blue-200"
        @click="searchHtmlInput?.focus()"
      >
        <MagnifyingGlassIcon class="size-4 text-gray-500" />
        <input
          ref="searchHtmlInput"
          type="text"
          class="ml-1 w-full border-none bg-transparent text-sm text-gray-700 focus:outline-hidden"
          placeholder="Filter..."
          v-model="search"
        />
        <button
          v-if="search"
          class="flex items-center justify-center"
          @click="search = ''"
        >
          <XCircleIcon class="size-4 text-gray-400 hover:text-gray-500" />
        </button>
      </div>
      <ToolTip message="Select a random emoji" position="bottom">
        <button
          @click="selectRandomEmoji"
          class="flex size-7 items-center justify-center rounded-sm border border-gray-300 hover:bg-gray-300"
        >
          <SwatchIcon class="size-4 text-gray-500" />
        </button>
      </ToolTip>
      <Listbox v-slot="{ open }" as="div" class="relative">
        <ListboxButton
          as="button"
          class="relative mx-1 flex size-7 items-center justify-center rounded-sm border border-gray-300 hover:bg-gray-300"
        >
          <ToolTip
            message="Select skin tone"
            position="bottom"
            :disabled="open"
          >
            {{ skinToneEmoji }}
          </ToolTip>
        </ListboxButton>
        <ListboxOptions
          as="div"
          class="absolute z-50 flex origin-top-right rounded-lg bg-white p-1 shadow-sm"
        >
          <ListboxOption
            v-for="tone in tones"
            :key="tone.char"
            as="button"
            @click="skinTone = tone.tone"
            class="rounded-md p-0.5 hover:bg-gray-100"
            :class="{ 'bg-gray-200': skinTone === tone.tone }"
          >
            {{ tone.char }}
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
    <div
      @scroll="handleScroll"
      class="relative h-80 overflow-x-visible overflow-y-scroll"
    >
      <div v-if="filteredEmojiData.length > 120">
        <div
          v-for="group in Object.keys(groupedFilteredEmojiData)"
          :key="group"
          class="w-full border-t border-gray-300"
        >
          <h2 class="p-1 text-sm font-semibold">{{ group }}</h2>
          <div class="relative flex flex-wrap justify-around p-1">
            <EmojiButton
              v-for="emoji in groupedFilteredEmojiData[group]"
              :key="emoji.char"
              :skinTone="skinTone"
              :emoji="emoji"
              @select="(e) => emits('select', e)"
            />
          </div>
        </div>
      </div>
      <div v-else class="relative flex flex-wrap p-1">
        <EmojiButton
          v-for="emoji in filteredEmojiData"
          :key="emoji.char"
          :skinTone="skinTone"
          :emoji="emoji"
          @select="(e) => emits('select', e)"
        />
      </div>
    </div>
  </div>
</template>
