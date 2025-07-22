<script setup lang="ts">
import type { CodeGroupProps, ComponentNode } from "~/shared/types";
const props = defineProps<{
  node: ComponentNode;
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
  if (codeBlock?.syntaxHighlightedTokens) {
    const text = codeBlock.syntaxHighlightedTokens
      .map((line) => line.map((token) => token.content).join(""))
      .join("\n");
    navigator.clipboard
      .writeText(text)
      .then(() => {
        useSnackbar().enqueue("Code copied to clipboard", "success");
      })
      .catch(() => {
        useSnackbar().enqueue("Failed to copy code", "error");
      });
  }
};
const colorMode = useColorMode();
</script>

<template>
  <div class="group my-2 shadow-sm">
    <MyCard>
      <template #header>
        <div class="flex items-center justify-between px-2 py-1">
          <div class="flex max-w-11/12 items-center gap-1 overflow-x-auto">
            <UButton
              v-for="(item, index) in codeGroups"
              :key="index"
              :color="'neutral'"
              :active="tabIndex === index"
              :icon="fileIcon(item.name)"
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
      </template>
      <template #content>
        <div class="relative">
          <div class="p-3 text-sm">
            <CodeBlock
              :language="codeGroups[tabIndex]?.language"
              :syntax-highlighted-tokens="
                colorMode.value === 'dark'
                  ? codeGroups[tabIndex]?.darkSyntaxHighlightedTokens
                  : codeGroups[tabIndex]?.syntaxHighlightedTokens
              "
            />
          </div>
        </div>
      </template>
    </MyCard>
  </div>
</template>
