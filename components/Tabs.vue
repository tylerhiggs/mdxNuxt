<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { MdNode, TabItemProps } from "~/shared/types";
const props = defineProps<{
  node: MdNode;
}>();
const items = computed(() => {
  return (
    props.node.items
      ?.filter((item) => item.type === "tabs-item")
      ?.map((item) => {
        const componentProps = item.componentProps as TabItemProps | undefined;
        return {
          label: componentProps?.label || "",
          icon: componentProps?.icon
            ? `i-heroicons-${componentProps.icon}`
            : undefined,
          node: item,
        } satisfies TabsItem;
      }) || []
  );
});
</script>

<template>
  <UTabs :items="items" variant="link" :ui="{ root: 'my-5 gap-4' }">
    <template #content="{ item }">
      <MdNode
        v-for="(node, index) in item.node.items"
        :key="index"
        :node="node"
      />
    </template>
  </UTabs>
</template>
