<script setup lang="ts">
import type { MdNode } from "~/shared/types";
const props = defineProps<{
  node: MdNode;
}>();
</script>

<template>
  <div v-if="node.items && node.items.length">
    <MdNode
      v-for="(item, index) in props.node.items"
      :key="index"
      :node="item"
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
  <p v-if="node.type === 'text'" class="my-5 inline leading-7 text-pretty">
    {{ node.text }}
  </p>
  <p v-if="node.type === 'paragraph'" class="my-5 inline leading-7 text-pretty">
    {{ node.text }}
  </p>
  <code
    v-if="node.type === 'inline-code'"
    class="inline rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-red-500"
    >{{ node.text }}</code
  >
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
