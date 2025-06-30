<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from "@nuxt/ui";
import type { Command, CommandOptions } from "~/types/page";

const open = defineModel<boolean>("open");
const emits = defineEmits<{
  optionSelected: [Command | undefined, CommandOptions | undefined];
}>();
const searchTerm = ref("");

const options = computed(
  () =>
    [
      {
        id: "custom-input",
        items: [
          {
            label: "Custom Input",
            suffix: `Insert '/${searchTerm.value}'`,
            icon: "i-heroicons-cursor-arrow-rays",
            commandOptions: {
              name: `/${searchTerm.value}`,
            },
          },
        ],
      },
      {
        id: "media",
        label: "Media",
        items: [
          {
            label: "Upload Image",
            suffix: "Insert an image",
            icon: "i-heroicons-photo",
          },
          {
            label: "Image Url",
            suffix: "Insert an image URL",
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
      {
        id: "components",
        label: "Components",
        items: [
          {
            label: "Accordion",
            suffix: "Insert an accordion component",
            icon: "i-heroicons-arrow-long-down",
          },
          {
            label: "Badge",
            suffix: "Insert a badge component",
            icon: "i-heroicons-check-badge",
          },
          {
            label: "Callout",
            suffix: "Insert a callout component",
            icon: "i-heroicons-chat-bubble-oval-left",
          },
          {
            label: "Note",
            suffix: "Insert a note component",
            icon: "i-heroicons-information-circle",
          },
          {
            label: "Tip",
            suffix: "Insert a tip component",
            icon: "i-heroicons-light-bulb",
          },
          {
            label: "Warning",
            suffix: "Insert a warning component",
            icon: "i-heroicons-exclamation-triangle",
          },
          {
            label: "Caution",
            suffix: "Insert a caution component",
            icon: "i-heroicons-exclamation-circle",
          },
          {
            label: "Card",
            suffix: "Insert a card component",
            icon: "i-heroicons-credit-card",
          },
          {
            label: "Card Group",
            suffix: "Insert a card group component",
            icon: "i-heroicons-credit-card",
          },
          {
            label: "Code Collapse",
            suffix: "Insert a collapsible code block component",
            icon: "i-heroicons-code-bracket-square",
          },
          {
            label: "Code Group",
            suffix: "Insert a code group component",
            icon: "i-heroicons-code-bracket-square",
          },
          {
            label: "Code Tree",
            suffix: "Insert a code tree component",
            icon: "i-heroicons-code-bracket-square",
          },
          {
            label: "Collapsible",
            suffix: "Insert a collapsible component",
            icon: "i-heroicons-chevron-down",
          },
          {
            label: "Field",
            suffix: "Insert a field component",
            icon: "i-heroicons-bars-3-center-left",
          },
          {
            label: "Field Group",
            suffix: "Insert a field group component",
            icon: "i-heroicons-bars-3-center-left",
          },
          {
            label: "Tabs",
            suffix: "Insert a tabs component",
            icon: "i-heroicons-square-2-stack",
          },
          {
            label: "Steps",
            suffix: "Insert a steps component",
            icon: "i-heroicons-numbered-list",
          },
        ],
      },
      {
        id: "icons",
        label: "Icons",
        items: icons.map((icon) => ({
          label: "Icon",
          suffix: `Insert the ${icon} icon`,
          icon: `i-heroicons-${icon}`,
          commandOptions: {
            name: icon,
          },
        })),
      },
      {
        id: "kbd",
        label: "Key Bindings",
        slot: "kbd" as const,
        items: [
          {
            label: "Key Binding",
            suffix: "Insert a key binding",
          },
          ...specialKeys.map((key) => ({
            label: "Key Binding" as Command,
            suffix: `Insert a key binding for ${key}`,
            commandOptions: {
              name: key,
            },
          })),
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
        v-model:search-term="searchTerm"
        @update:model-value="
          (value) =>
            emits(
              'optionSelected',
              value.label as Command,
              value.commandOptions,
            )
        "
      >
        <template #kbd-leading="{ item }">
          <div>
            <UKbd :value="item.commandOptions?.name || 'K'" />
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
