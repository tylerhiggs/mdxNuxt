<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { EmojiData, Tone } from "#build/imports";

const props = defineProps<{
  skinTone: Tone | null;
  emoji: EmojiData;
  focused: boolean;
}>();
const emits = defineEmits<{
  select: [emoji: string];
}>();

const chars = computed(() => {
  if (!props.emoji.altColors) return [props.emoji.char];
  return [props.emoji.char, ...Object.values(props.emoji.altColors)];
});

const items = computed(
  () =>
    chars.value.map((label) => ({
      label,
      type: "checkbox" as const,
      onSelect: () => {
        if (!label) return;
        emits("select", label);
      },
    })) satisfies DropdownMenuItem[],
);
</script>

<template>
  <UDropdownMenu v-if="props.emoji.altColors" :items="items">
    <UTooltip
      :text="props.emoji.name"
      :delay-duration="0"
      :content="{ side: 'top' }"
      :show="true"
    >
      <UButton
        :id="props.emoji.char"
        variant="ghost"
        color="neutral"
        class="rounded-xs p-1 text-6xl hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
        :class="{ 'bg-gray-100': props.focused }"
      >
        {{
          props.skinTone
            ? props.emoji.altColors[props.skinTone]
            : props.emoji.char
        }}
      </UButton>
    </UTooltip>
  </UDropdownMenu>
  <UTooltip
    v-else
    :text="props.emoji.name"
    :delay-duration="0"
    :content="{ side: 'top' }"
  >
    <UButton
      :id="props.emoji.char"
      variant="ghost"
      color="neutral"
      class="rounded-xs p-1 text-6xl hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
      :class="{ 'bg-gray-100': props.focused }"
      @click="() => emits('select', props.emoji.char)"
    >
      {{
        props.emoji.altColors && props.skinTone
          ? props.emoji.altColors[props.skinTone]
          : props.emoji.char
      }}
    </UButton>
  </UTooltip>
</template>
