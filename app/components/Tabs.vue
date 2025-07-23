<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { ComponentNode, TabItemProps } from "~~/shared/types";
const props = defineProps<{
  node: ComponentNode;
}>();
const items = computed(() => {
  return (
    (
      props.node.items.filter(
        (item) => item.type === "tabs-item",
      ) as ComponentNode[]
    )?.map((item) => {
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

const defaultValue = computed(() => {
  const componentProps = props.node.componentProps as
    | { defaultValue?: string | number }
    | undefined;
  const res = items.value.findIndex(
    (item, index) =>
      componentProps?.defaultValue === item.label ||
      componentProps?.defaultValue === index ||
      componentProps?.defaultValue === index.toString(),
  );
  return res !== -1 ? res.toString() : undefined;
});
</script>

<template>
  <UTabs
    :items="items"
    variant="link"
    :ui="{ root: 'my-5 gap-4' }"
    :default-value="defaultValue"
  >
    <template #content="{ item }">
      <div v-for="n in item.node.items" :key="n.id">
        <MdNode :node="n" />
      </div>
    </template>
  </UTabs>
</template>
