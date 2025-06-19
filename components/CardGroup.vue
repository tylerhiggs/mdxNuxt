<script setup lang="ts">
import { type CardProps, type MdNode } from "~/shared/types";
const props = defineProps<{
  node: MdNode;
}>();
const cardItems = computed(() => {
  return props.node.items?.filter((item) => item.type === "card") || [];
});
</script>

<template>
  <div class="my-0 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
    <Card
      v-for="(item, index) in cardItems"
      :key="index"
      :componentProps="(item.componentProps as CardProps | undefined) || {}"
    >
      <MdNode
        v-for="(node, nodeIndex) in item.items"
        :key="nodeIndex"
        :node="node"
      />
    </Card>
  </div>
</template>
