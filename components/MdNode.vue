<script setup lang="ts">
import type { MdNode } from "~/shared/types";
const props = defineProps<{
  node: MdNode;
}>();
</script>

<template>
  <div v-if="node.items && node.items.length">
    <div v-for="(item, index) in props.node.items" :key="index">
      <MdNode :node="item" />
    </div>
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
  <p v-if="node.type === 'paragraph'">{{ node.text }}</p>
  <code
    v-if="node.type === 'inline-code'"
    class="rounded bg-gray-100 px-1 py-0.5 text-red-500"
    >{{ node.text }}</code
  >
  <b v-if="node.type === 'bold'" class="font-extrabold">{{ node.text }}</b>
  <i v-if="node.type === 'italic'" class="italic">{{ node.text }}</i>
</template>
