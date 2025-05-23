<script setup lang="ts">
import type { MdNode } from "~/shared/types";
const props = defineProps<{
  node: MdNode;
  preview?: boolean;
}>();
</script>

<template>
  <div v-if="node.items && node.items.length">
    <MdNode
      v-for="(item, index) in props.node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </div>
  <h1
    v-if="node.type === 'heading' && node.depth === 1"
    class="text-highlighted mb-8 text-4xl font-bold"
  >
    {{ node.text }}
  </h1>
  <h2
    v-if="node.type === 'heading' && node.depth === 2"
    class="text-highlighted relative mt-12 mb-6 text-2xl font-bold"
  >
    {{ node.text }}
  </h2>
  <h3
    v-if="node.type === 'heading' && node.depth === 3"
    class="text-highlighted relative mt-8 mb-3 text-xl font-bold"
  >
    {{ node.text }}
  </h3>
  <h4
    v-if="node.type === 'heading' && node.depth === 4"
    class="text-highlighted relative mt-6 mb-2 text-lg font-bold"
  >
    {{ node.text }}
  </h4>
  <h5
    v-if="node.type === 'heading' && node.depth === 5"
    class="text-highlighted relative mt-4 mb-1 text-base font-bold"
  >
    {{ node.text }}
  </h5>
  <h6
    v-if="node.type === 'heading' && node.depth === 6"
    class="text-highlighted relative mt-2 mb-1 text-sm font-bold"
  >
    {{ node.text }}
  </h6>
  <div
    v-if="
      node.type === 'heading' && node.depth && node.depth > 3 && props.preview
    "
    class="mb-2 rounded border border-yellow-300 bg-yellow-100 px-3 py-2 text-sm text-yellow-800"
  >
    Warning: Heading levels greater than 3 are not recommended.
  </div>
  <p v-if="node.type === 'text'" class="my-5 inline leading-7 text-pretty">
    {{ node.text }}
  </p>
  <p v-if="node.type === 'paragraph'" class="my-5 inline leading-7 text-pretty">
    {{ node.text }}
  </p>
  <code
    v-if="node.type === 'inline-code'"
    class="inline rounded-md border px-1.5 py-0.5 font-mono text-sm font-medium"
    :class="{
      'border-error/25 bg-error/10 text-error': node.color === 'error',
      'border-warning/25 bg-warning/10 text-warning': node.color === 'warning',
      'border-info/25 bg-info/10 text-info': node.color === 'info',
      'border-success/25 bg-success/10 text-success': node.color === 'success',
      'border-primary/25 bg-primary/10 text-primary': node.color === 'primary',
      'border-secondary/25 bg-secondary/10 text-secondary':
        node.color === 'secondary',
      'border-muted text-highlighted bg-muted':
        !node.color ||
        [
          'error',
          'warning',
          'info',
          'success',
          'primary',
          'secondary',
        ].includes(node.color),
    }"
  >
    <span
      v-if="
        node.type === 'inline-code' &&
        node.language &&
        node.syntaxHighlightedTokens &&
        node.syntaxHighlightedTokens.length === 1
      "
      v-for="token in node.syntaxHighlightedTokens[0]"
      :style="{
        color: token.color,
      }"
    >
      {{ token.content }}
    </span>
    <template v-else>
      {{ node.text }}
    </template>
  </code>
  <!-- <code
    v-if="
      node.type === 'inline-code' &&
      node.language &&
      node.syntaxHighlightedTokens &&
      node.syntaxHighlightedTokens.length === 1
    "
    class="inline rounded-md border px-1.5 py-0.5 font-mono text-sm font-medium"
    :class="{
      'border-error/25 bg-error/10': node.color === 'error',
      'border-warning/25 bg-warning/10': node.color === 'warning',
      'border-info/25 bg-info/10': node.color === 'info',
      'border-success/25 bg-success/10': node.color === 'success',
      'border-primary/25 bg-primary/10': node.color === 'primary',
      'border-secondary/25 bg-secondary/10': node.color === 'secondary',
      'border-muted text-highlighted bg-muted': node.color === 'neutral',
    }"
  >
    <span
      v-for="token in node.syntaxHighlightedTokens[0]"
      :style="{
        color: token.color,
      }"
    >
      {{ token.content }}
    </span>
  </code> -->
  <strong v-if="node.type === 'bold'" class="inline font-extrabold">{{
    node.text
  }}</strong>
  <em v-if="node.type === 'italic'" class="inline italic">{{ node.text }}</em>
  <a
    v-if="node.type === 'link'"
    :href="node.href"
    class="text-primary hover:border-primary focus-visible:outline-primary hover:[&>code]:border-primary hover:[&>code]:text-primary border-b border-transparent font-medium [&>code]:border-dashed"
    target="_blank"
    :external="true"
    rel="noopener noreferrer"
  >
    {{ node.text }}
  </a>
  <ul v-if="node.type === 'list-item'" class="list-disc pl-5">
    <li v-for="(item, index) in node.items" :key="index">{{ item.text }}</li>
  </ul>
  <CodeBlock
    v-if="node.type === 'code-block' && node.text"
    :code="node.text"
    :language="node.language"
    :syntaxHighlightedTokens="node.syntaxHighlightedTokens"
    :showlineNumbers="false"
  />
</template>
