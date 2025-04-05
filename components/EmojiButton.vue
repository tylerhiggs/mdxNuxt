<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import type { EmojiData, Tone } from "#build/imports";

const tooltipStore = useTooltip();
const props = defineProps<{
  skinTone: Tone | null;
  emoji: EmojiData;
}>();
const emits = defineEmits<{
  select: [emoji: string];
}>();

const chars = computed(() => {
  if (!props.emoji.altColors) return [props.emoji.char];
  return [props.emoji.char, ...Object.values(props.emoji.altColors)];
});

const mouseover = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  tooltipStore.show(props.emoji.name, rect.right, rect.top, "top");
};
</script>

<template>
  <Listbox v-if="props.emoji.altColors" class="relative" as="div">
    <ListboxButton
      as="button"
      class="rounded-xs p-1 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
      @mouseover="mouseover"
      @mouseleave="tooltipStore.hide"
    >
      {{ skinTone ? props.emoji.altColors[skinTone] : props.emoji.char }}
    </ListboxButton>
    <ListboxOptions class="absolute">
      <div class="absolute z-50 flex flex-col rounded-lg bg-white p-1 shadow-sm">
        <ListboxOption
          as="button"
          v-for="e in chars"
          :key="e"
          @click="() => e && emits('select', e)"
          class="rounded-md p-0.5 hover:bg-gray-100"
        >
          {{ e }}
        </ListboxOption>
      </div>
    </ListboxOptions>
  </Listbox>
  <button
    class="rounded-xs p-1 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
    @click="() => emits('select', props.emoji.char)"
    @mouseenter="mouseover"
    @mouseleave="tooltipStore.hide"
  >
    {{
      props.emoji.altColors && skinTone
        ? props.emoji.altColors[skinTone]
        : props.emoji.char
    }}
  </button>
</template>
