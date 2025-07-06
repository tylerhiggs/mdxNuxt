<script setup lang="ts" generic="T extends { id: string }">
import { UDropdownMenu } from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  items: T[];
  selected: T;
  getTitle: (item: T) => string;
  iconName: string;
}>();

const emit = defineEmits<{
  select: [string];
}>();

const menuItems = computed(() =>
  props.items.map(
    (item) =>
      ({
        label: props.getTitle(item),
        icon: "i-heroicons-check",
        onSelect: () => emit("select", item.id),
      }) as DropdownMenuItem,
  ),
);
</script>

<template>
  <UDropdownMenu
    :model-value="props.selected"
    by="id"
    as="div"
    class="relative"
    :items="menuItems"
    @update:model-value="(value: T) => emit('select', value.id)"
  >
    <UButton
      class="flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-sm text-gray-400 hover:bg-gray-100"
    >
      <UIcon :name="props.iconName" class="size-4" />
      {{ props.selected.id === props.items[0].id ? "Sort" : props.selected.id }}
      <UIcon name="i-heroicons-chevron-down" class="ml-1 size-4" />
    </UButton>
  </UDropdownMenu>
</template>
