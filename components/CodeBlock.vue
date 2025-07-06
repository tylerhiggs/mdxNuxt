<script setup lang="ts">
import type { ThemedToken } from "shiki";
const props = defineProps<{
  language?: string;
  syntaxHighlightedTokens?: ThemedToken[][];
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
}>();
</script>

<template>
  <pre
    class="flex"
    :style="{
      'white-space-collapse': 'preserve',
    }"
  >
    <code v-if="props.syntaxHighlightedTokens" class="flex flex-col">
      <div
        v-for="(line, lineIndex) in props.syntaxHighlightedTokens"
        :key="lineIndex"
        class="line min-h-[1lh] flex"
      >
        <span
          v-for="(token, tokenIndex) in line"
          :key="tokenIndex"
          :style="{
            color: token.color,
          }"
        >{{token.content}}</span>
      </div>
    </code>
  </pre>
</template>
