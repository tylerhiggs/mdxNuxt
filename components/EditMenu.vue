<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from "@nuxt/ui";
import type { Command } from "~/types/page";

const open = defineModel<boolean>("open");
const emits = defineEmits<{
  optionSelected: [Command | undefined];
}>();

const options = computed(
  () =>
    [
      {
        id: "media",
        label: "Media",
        items: [
          {
            label: "Image",
            suffix: "Insert an image",
            icon: "i-heroicons-photo",
          },
        ],
      },
      {
        id: "Text-Formatting",
        label: "Text Formatting",
        items: [
          {
            label: "Bold",
            suffix: "Insert bold text",
            icon: "i-heroicons-bold",
          },
          {
            label: "Italic",
            suffix: "Insert italic text",
            icon: "i-heroicons-italic",
          },
          {
            label: "Link",
            suffix: "Insert a link",
            icon: "i-heroicons-link",
          },
          {
            label: "Inline Code",
            suffix: "Insert inline code",
            icon: "i-heroicons-code-bracket",
          },
          {
            label: "Inline Code - Syntax Highlighted",
            suffix: "Insert inline code with syntax highlighting",
            icon: "i-heroicons-code-bracket",
          },
          {
            label: "Inline Code - Success",
            suffix: "Insert inline code with success style",
            icon: "i-heroicons-code-bracket",
          },
          {
            label: "Inline Code - Warning",
            suffix: "Insert inline code with warning style",
            icon: "i-heroicons-code-bracket",
          },
          {
            label: "Inline Code - Error",
            suffix: "Insert inline code with error style",
            icon: "i-heroicons-code-bracket",
          },
          {
            label: "Inline Code - Info",
            suffix: "Insert inline code with info style",
            icon: "i-heroicons-code-bracket",
          },
          {
            label: "Ordered List",
            suffix: "Insert an ordered list",
            icon: "i-heroicons-numbered-list",
          },
          {
            label: "Unordered List",
            suffix: "Insert an unordered list",
            icon: "i-heroicons-list-bullet",
          },
          {
            label: "Code Block",
            suffix: "Insert a code block",
            icon: "i-heroicons-code-bracket-square",
          },
          {
            label: "Blockquote",
            suffix: "Insert a blockquote",
            icon: "i-heroicons-bookmark-square",
          },
          {
            label: "Divider",
            suffix: "Insert a divider",
            icon: "i-heroicons-minus",
          },
          {
            label: "Heading 1",
            suffix: "Insert a heading 1",
            icon: "i-heroicons-h1",
          },
          {
            label: "Heading 2",
            suffix: "Insert a heading 2",
            icon: "i-heroicons-h2",
          },
          {
            label: "Heading 3",
            suffix: "Insert a heading 3",
            icon: "i-heroicons-h3",
          },
        ],
      },
    ] satisfies CommandPaletteGroup<CommandPaletteItem & { label: Command }>[],
);
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCommandPalette
        :groups="options"
        @update:model-value="
          (value) => emits('optionSelected', value.label as Command)
        "
      />
    </template>
  </UModal>
</template>
