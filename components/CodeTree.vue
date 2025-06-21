<script setup lang="ts">
import { type CodeTreeProps, type MdNode } from "~/shared/types";
import type { TreeItem } from "@nuxt/ui";

const props = defineProps<{
  node: MdNode;
}>();

const codeBlocks = computed(() => {
  return props.node.items?.filter((item) => item.type === "code-block") || [];
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
              value: item.text || "",
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
  items.sort((a, b) => a.label?.localeCompare(b.label || "") || 0);
  items.forEach((item) => {
    if (item.children) {
      sortTree(item.children);
    }
  });
  return items;
};

const _selected = ref<MdNode | undefined>(
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
const fileExtension = (name: string | undefined) => {
  const ext = name ? name.split(".").pop() : "";
  if (!ext) return "text";
  if (name === "nuxt.config.ts" || name === "nuxt.config.js") return "nuxt";
  if (name === "ts.config.json") return "nuxt";
  if (name === "package.json") return "node";
  if (ext === "ts" || ext === "type-ts") return "typescript";
  if (ext === "js") return "javascript";
  if (ext === "py") return "python";
  if (ext === "md") return "markdown";
  return ext;
};
const copyCode = () => {
  if (selected.value?.text) {
    navigator.clipboard
      .writeText(selected.value.text)
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
  <div class="m-2 flex h-64 w-full">
    <div
      class="rounded-l border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <UTree :items="treeItems" class="overflow-y-auto" />
    </div>
    <div
      class="group h-full overflow-auto rounded-r border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
    >
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

      <div class="relative overflow-auto">
        <div class="p-3 text-sm">
          <CodeBlock
            v-if="selected?.text"
            :code="selected?.text || ''"
            :language="selected?.language"
            :syntax-highlighted-tokens="
              colorMode.value === 'dark'
                ? selected?.darkSyntaxHighlightedTokens
                : selected?.syntaxHighlightedTokens
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
