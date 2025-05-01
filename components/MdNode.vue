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
    class="text-2xl font-bold"
  >
    {{ node.text }}
  </h1>
  <h2
    v-if="node.type === 'heading' && node.depth === 2"
    class="text-xl font-bold"
  >
    {{ node.text }}
  </h2>
  <h3
    v-if="node.type === 'heading' && node.depth === 3"
    class="text-lg font-bold"
  >
    {{ node.text }}
  </h3>
  <p v-if="node.type === 'text'" class="inline">{{ node.text }}</p>
  <p v-if="node.type === 'paragraph'" class="inline">{{ node.text }}</p>
  <code
    v-if="node.type === 'inline-code'"
    class="inline rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-red-500"
    >{{ node.text }}</code
  >
  <b v-if="node.type === 'bold'" class="inline font-extrabold">{{
    node.text
  }}</b>
  <i v-if="node.type === 'italic'" class="inline italic">{{ node.text }}</i>
  <a
    v-if="node.type === 'link'"
    :href="node.href"
    class="text-blue-500 hover:underline"
    target="_blank"
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
