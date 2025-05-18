<script setup lang="ts">
import type { ThemedToken } from "shiki";
const props = defineProps<{
  code: string;
  language?: string;
  syntaxHighlightedTokens?: ThemedToken[][];
  showlineNumbers?: boolean;
}>();
</script>

<template>
  <div
    class="rounded-lg bg-stone-50 text-sm shadow-sm *:overflow-auto dark:bg-stone-800 **:[.line]:isolate **:[.line]:not-last:min-h-[1lh]"
  >
    <pre
      class="flex p-5"
      :style="{
        'white-space-collapse': 'preserve',
      }"
    >
      <code class="flex flex-col">
        <div
          v-if="props.syntaxHighlightedTokens"
          v-for="(line, lineIndex) in props.syntaxHighlightedTokens"
          :key="lineIndex"
          class="line flex"
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
  </div>
</template>
