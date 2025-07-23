<script setup lang="ts">
import type { ThemedToken } from "shiki";
const props = defineProps<{
  language?: string;
  syntaxHighlightedTokens?: ThemedToken[][];
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
}>();
const getBackgroundColor = (tokenIndex: number, lineIndex: number) => {
  if (
    tokenIndex &&
    props.syntaxHighlightedTokens &&
    props.syntaxHighlightedTokens.at(lineIndex)?.at(tokenIndex - 1)?.content ===
      "#" &&
    props.syntaxHighlightedTokens
      .at(lineIndex)
      ?.at(tokenIndex)
      ?.content.split(";")
      ?.at(0)
      ?.split("")
      .every((c) => parseInt(c, 16) >= 0)
  ) {
    return `#${props.syntaxHighlightedTokens
      .at(lineIndex)
      ?.at(tokenIndex)
      ?.content.split(";")
      ?.at(0)}`;
  }
  return props.syntaxHighlightedTokens?.at(lineIndex)?.at(tokenIndex)?.bgColor;
};
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
          class="rounded"
          :style="{
            color: token.color,
            backgroundColor: getBackgroundColor(tokenIndex, lineIndex),
          }"
        >{{token.content}}</span>
      </div>
    </code>
  </pre>
</template>
