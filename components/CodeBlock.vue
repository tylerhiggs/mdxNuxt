<script setup lang="ts">
import type { ThemedToken } from "shiki";
const props = defineProps<{
  code: string;
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
    <code class="flex flex-col">
      <div
        v-if="props.syntaxHighlightedTokens"
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
      <span v-else>{{ props.code }}</span>
    </code>
  </pre>
</template>
