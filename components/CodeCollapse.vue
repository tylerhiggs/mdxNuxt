<script setup lang="ts">
import type { CodeCollapseProps, ComponentNode } from "~/shared/types";
const props = defineProps<{
  node: ComponentNode;
}>();
const componentProps = computed(() => {
  return props.node.componentProps as CodeCollapseProps | undefined;
});
const propIcon = computed(() => {
  return componentProps.value?.icon
    ? `i-heroicons-${componentProps.value.icon}`
    : undefined;
});
const collapsed = ref(!componentProps.value?.open);
const codeBlock = computed(() => {
  return props.node.items?.find((item) => item.type === "code-block");
});
const filename = computed(() => {
  return codeBlock.value?.name || "";
});
const colorMode = useColorMode();
const snackbar = useSnackbar();
const copyCode = () => {
  if (codeBlock.value?.syntaxHighlightedTokens) {
    const text = codeBlock.value.syntaxHighlightedTokens
      .map((line) => line.map((token) => token.content).join(""))
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      snackbar.enqueue("code copied to clipboard", "success");
    });
  }
};
</script>

<template>
  <div class="group shadow-sm">
    <MyCard>
      <template #header>
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-1">
            <UIcon
              :name="`i-vscode-icons:file-type-${fileExtension(filename)}`"
            />
            <h3 class="text-sm">{{ filename }}</h3>
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
        <div
          class="p-3 text-sm"
          :class="{
            'max-h-72 overflow-y-auto pb-16': !collapsed,
            'max-h-48 overflow-hidden': collapsed,
          }"
        >
          <CodeBlock
            :language="codeBlock?.language"
            :syntax-highlighted-tokens="
              colorMode.value === 'dark'
                ? codeBlock?.darkSyntaxHighlightedTokens
                : codeBlock?.syntaxHighlightedTokens
            "
          />
        </div>
        <div
          class="from-muted absolute right-0 bottom-0 left-0 m-0 flex h-16 items-center justify-center rounded bg-linear-to-t to-transparent"
        >
          <UButton
            :icon="
              collapsed
                ? propIcon || 'i-heroicons-chevron-down'
                : propIcon || 'i-heroicons-chevron-up'
            "
            color="neutral"
            size="sm"
            variant="subtle"
            @click="collapsed = !collapsed"
          >
            {{
              collapsed
                ? componentProps?.openText || componentProps?.name || "Expand"
                : componentProps?.closeText ||
                  componentProps?.name ||
                  "Collapse"
            }}
          </UButton>
        </div>
      </template>
    </MyCard>
  </div>
</template>
