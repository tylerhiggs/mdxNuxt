<script setup lang="ts">
import type {
  AccordionItemProps,
  AccordionProps,
  ComponentNode,
} from "~/shared/types";
import type { AccordionItem } from "@nuxt/ui";

const props = defineProps<{
  node: ComponentNode;
}>();
const componentProps = props.node.componentProps as AccordionProps | undefined;
const items = computed(
  () =>
    (
      (props.node.items || []).filter(
        (item) => item.type === "accordion-item",
      ) as ComponentNode[]
    ).map(
      (item) =>
        ({
          ...item.componentProps,
          ...item,
          icon: (item.componentProps as AccordionItemProps)?.icon
            ? `i-heroicons-${(item.componentProps as AccordionItemProps).icon}`
            : undefined,
        }) as ComponentNode & AccordionItemProps,
    ) satisfies AccordionItem[],
);
</script>

<template>
  <div class="accordion-container my-4">
    <UAccordion :type="componentProps?.type" :items="items">
      <template #body="{ item }">
        <MdNode v-for="n in item.items" :key="n.id" :node="n" />
      </template>
    </UAccordion>
  </div>
</template>
