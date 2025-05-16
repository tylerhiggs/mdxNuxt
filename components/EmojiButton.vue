<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
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

const items = computed(() => {
  chars.value.map((label) => ({
    label,
    value: label,
    type: "checkbox" as const,
    checked: label === props.emoji.char,
    onUpdateChecked: (_: boolean) => {
      label && emits("select", label);
    },
    onSelect: (e: Event) => {
      e.preventDefault();
    },
  })) satisfies DropdownMenuItem[];
});
</script>

<template>
  <UDropdownMenu v-if="props.emoji.altColors" class="relative" :items="items">
    <UButton
      variant="ghost"
      color="neutral"
      class="rounded-xs p-1 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
      @mouseover="mouseover"
      @mouseleave="tooltipStore.hide"
    >
      {{
        props.skinTone
          ? props.emoji.altColors[props.skinTone]
          : props.emoji.char
      }}
    </UButton>
    <template #content class="absolute">
      <UCommandPalette
        v-for="e in chars"
        :key="e"
        @click="() => e && emits('select', e)"
        class="rounded-md p-0.5 hover:bg-gray-100"
      >
        {{ e }}
      </UCommandPalette>
    </template>
  </UDropdownMenu>
  <button
    class="rounded-xs p-1 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
    @click="() => emits('select', props.emoji.char)"
    @mouseenter="mouseover"
    @mouseleave="tooltipStore.hide"
  >
    {{
      props.emoji.altColors && props.skinTone
        ? props.emoji.altColors[props.skinTone]
        : props.emoji.char
    }}
  </button>
</template>
