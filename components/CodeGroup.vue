<script setup lang="ts">
import { type CodeGroupProps, type MdNode } from "~/shared/types";
const props = defineProps<{
  node: MdNode;
}>();
const componentProps = computed(() => {
  return props.node.componentProps as CodeGroupProps | undefined;
});
const codeGroups = computed(() => {
  return props.node.items?.filter((item) => item.type === "code-block") || [];
});

const _tabIndex = ref<number>(
  componentProps.value?.defaultValue
    ? (codeGroups.value.findIndex(
        (item, i) =>
          item.name === componentProps.value?.defaultValue ||
          i === Number(componentProps.value?.defaultValue),
      ) ?? 0)
    : 0,
);
const tabIndex = computed({
  get: () => (_tabIndex.value === -1 ? 0 : _tabIndex.value),
  set: (value) => {
    _tabIndex.value = value;
  },
});
const copyCode = () => {
  const codeBlock = codeGroups.value[tabIndex.value];
  if (codeBlock?.text) {
    navigator.clipboard
      .writeText(codeBlock.text)
      .then(() => {
        useSnackbar().enqueue("Code copied to clipboard", "success");
      })
      .catch(() => {
        useSnackbar().enqueue("Failed to copy code", "error");
      });
  }
};
const colorMode = useColorMode();
const fileExtension = (name: string | undefined) => {
  return name ? name.split(".").pop() : "";
};
</script>

<template>
  <div
    class="group my-2 rounded border border-neutral-200 bg-neutral-50 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div
      class="flex items-center justify-between border-b border-neutral-300 px-2 py-1 dark:border-neutral-600"
    >
      <div class="flex max-w-11/12 items-center gap-1 overflow-x-auto">
        <UButton
          v-for="(item, index) in codeGroups"
          :key="index"
          :color="'neutral'"
          :active="tabIndex === index"
          :icon="`i-vscode-icons:file-type-${fileExtension(item.name)}`"
          :variant="tabIndex === index ? 'subtle' : 'ghost'"
          @click="tabIndex = index"
        >
          {{ item.name }}
        </UButton>
      </div>
      <UButton
        class="invisible group-hover:visible"
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-heroicons-clipboard-document"
        @click="copyCode"
      />
    </div>

    <div class="relative">
      <div class="p-3 text-sm">
        <CodeBlock
          v-if="codeGroups[tabIndex]?.text"
          :code="codeGroups[tabIndex]?.text || ''"
          :language="codeGroups[tabIndex]?.language"
          :syntax-highlighted-tokens="
            colorMode.value === 'dark'
              ? codeGroups[tabIndex]?.darkSyntaxHighlightedTokens
              : codeGroups[tabIndex]?.syntaxHighlightedTokens
          "
        />
      </div>
    </div>
  </div>
</template>
