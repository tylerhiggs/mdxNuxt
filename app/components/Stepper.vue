<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import type { ComponentNode, MdNode, StepperProps } from "~/shared/types";
const props = defineProps<{
  node: ComponentNode;
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
    :default-value="-1"
    :items="items"
    orientation="vertical"
    :ui="{
      root: 'w-full',
      title: '*:mt-0',
    }"
  >
    <template #title="{ item }">
      <MdNode :node="item.titleNode" />
    </template>
    <template #description="{ item }">
      <div class="w-full">
        <MdNode v-for="n in item.contentNodes" :key="n.id" :node="n" />
      </div>
    </template>
  </UStepper>
</template>
