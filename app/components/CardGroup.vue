<script setup lang="ts">
import type { CardProps, ComponentNode } from "~~/shared/types";
const props = defineProps<{
  node: ComponentNode;
}>();
const cardItems = computed(() => {
  return (props.node.items?.filter((item) => item.type === "card") ||
    []) as ComponentNode[];
});
</script>

<template>
  <div class="my-0 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
    <Card
      v-for="(item, index) in cardItems"
      :key="index"
      :component-props="(item.componentProps as CardProps | undefined) || {}"
    >
      <MdNode v-for="n in item.items" :key="n.id" :node="n" />
    </Card>
  </div>
</template>
