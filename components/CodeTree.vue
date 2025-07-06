<script setup lang="ts">
import type {
  ComponentNode,
  CodeTreeProps,
  CodeBlockNode,
} from "~/shared/types";
import type { TreeItem } from "@nuxt/ui";

const props = defineProps<{
  node: ComponentNode;
}>();

const expandAll = computed(() => {
  return (
    (props.node.componentProps as CodeTreeProps | undefined)?.expandAll ?? false
  );
});

const codeBlocks = computed(() => {
  return (props.node.items?.filter((item) => item.type === "code-block") ||
    []) as CodeBlockNode[];
});

const treeItems = computed(() =>
  sortTree(
    codeBlocks.value.reduce(
      (acc, item) => {
        const path = item.name?.split("/") || [];
        let currentNodesChildren = acc;
        path.forEach((part, index) => {
          if (index === path.length - 1) {
            currentNodesChildren.push({
              label: part,
              icon: `i-vscode-icons-file-type-${fileExtension(part)}`,
              type: "code-block",
              onSelect: () => {
                selected.value = item;
              },
            } satisfies TreeItem);
            return;
          }
          if (!currentNodesChildren.find((node) => node.label === `${part}/`)) {
            const children = [] as TreeItem[];
            currentNodesChildren.push({
              label: `${part}/`,
              children,
              defaultExpanded: expandAll.value,
            } satisfies TreeItem);
            currentNodesChildren = children;
          } else {
            currentNodesChildren = currentNodesChildren.find(
              (node) => node.label === `${part}/`,
            )!.children!;
          }
        });
        return acc;
      },
      [] as (TreeItem & { value?: string })[],
    ),
  ),
);

const sortTree = (items: TreeItem[]) => {
  items.sort((a, b) => {
    if (a.children && !b.children) return -1;
    if (!a.children && b.children) return 1;
    return a.label?.localeCompare(b.label || "") || 0;
  });
  items.forEach((item) => {
    if (item.children) {
      sortTree(item.children);
    }
  });
  return items;
};

const _selected = ref<CodeBlockNode | undefined>(
  codeBlocks.value.find(
    (item) =>
      item.name ===
      (props.node.componentProps as CodeTreeProps | undefined)?.defaultValue,
  ),
);
const selected = computed({
  get: () =>
    codeBlocks.value.find((item) => item.name === _selected.value?.name),
  set: (value) => {
    _selected.value = value;
  },
});

const currentIcon = computed(() => {
  return selected.value?.name
    ? `i-vscode-icons:file-type-${fileExtension(selected.value.name)}`
    : "i-vscode-icons:file-type-text";
});
const colorMode = useColorMode();

const copyCode = () => {
  if (selected.value?.syntaxHighlightedTokens) {
    const text = selected.value.syntaxHighlightedTokens
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
</script>

<template>
  <div class="flex h-64 w-full">
    <div
      class="min-w-4/12 overflow-auto rounded-l border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <UTree :items="treeItems" />
    </div>
    <div
      class="group h-full min-w-8/12 overflow-auto *:h-full *:rounded-l-none"
    >
      <MyCard>
        <template #header>
          <div
            class="flex items-center justify-between border-b border-neutral-300 px-2 py-1 dark:border-neutral-600"
          >
            <div class="flex max-w-11/12 items-center gap-1 overflow-x-auto">
              <UIcon :name="currentIcon" />
              {{ selected?.name?.split("/").pop() || "Code" }}
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
          <div class="relative overflow-auto">
            <div class="p-3 text-sm">
              <CodeBlock
                :language="selected?.language"
                :syntax-highlighted-tokens="
                  colorMode.value === 'dark'
                    ? selected?.darkSyntaxHighlightedTokens
                    : selected?.syntaxHighlightedTokens
                "
              />
            </div>
          </div>
        </template>
      </MyCard>
    </div>
  </div>
</template>
