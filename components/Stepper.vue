<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import type { MdNode, StepperProps } from "~/shared/types";
const props = defineProps<{
  node: MdNode;
}>();

const items = computed(() => {
  const level = Number(
    (props.node.componentProps as StepperProps | undefined)?.level || 3,
  );
  if (isNaN(level) || level < 2 || level > 4) {
    return [];
  }
  const res = [] as StepperItem[];
  props.node.items?.forEach((item) => {
    if (item.type === "heading" && item.depth === level) {
      res.push({
        titleNode: item,
        contentNodes: [] as MdNode[],
      } satisfies StepperItem);
      return;
    }
    res.at(-1)?.contentNodes.push(item);
  });
  return res;
});
</script>

<template>
  <UStepper
    :disabled="true"
    :defaultValue="-1"
    :items="items"
    orientation="vertical"
    :ui="{
      root: 'w-full',
    }"
  >
    <template #title="{ item }">
      <MdNode :node="item.titleNode" />
    </template>
    <template #description="{ item }">
      <div class="w-full">
        <MdNode
          v-for="(node, index) in item.contentNodes"
          :key="index"
          :node="node"
        />
      </div>
    </template>
  </UStepper>
</template>
