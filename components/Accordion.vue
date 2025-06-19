<script setup lang="ts">
import type {
  AccordionItemProps,
  MdNode,
  AccordionProps,
} from "~/shared/types";
import type { AccordionItem } from "@nuxt/ui";

const props = defineProps<{
  node: MdNode;
}>();
const componentProps = props.node.componentProps as AccordionProps | undefined;
const items = computed(
  () =>
    (props.node.items || [])
      .filter((item) => item.type === "accordion-item")
      .map(
        (item) =>
          ({
            ...item.componentProps,
            ...item,
            icon: (item.componentProps as AccordionItemProps)?.icon
              ? `i-heroicons-${(item.componentProps as AccordionItemProps).icon}`
              : undefined,
          }) as MdNode & AccordionItemProps,
      ) satisfies AccordionItem[],
);
</script>

<template>
  <div class="accordion-container my-4">
    <UAccordion :type="componentProps?.type" :items="items">
      <template #body="{ item }">
        <MdNode v-for="(node, index) in item.items" :key="index" :node="node" />
      </template>
    </UAccordion>
  </div>
</template>
