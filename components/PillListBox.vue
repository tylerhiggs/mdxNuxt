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
    :modelValue="props.selected"
    @update:modelValue="(value: T) => emit('select', value.id)"
    by="id"
    as="div"
    class="relative"
  >
    <ListboxButton
      class="flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-sm text-gray-400 hover:bg-gray-100"
    >
      <UIcon :name="props.iconName" class="size-4" />
      {{ props.selected.id === props.items[0].id ? "Sort" : props.selected.id }}
      <UIcon name="i-heroicons-chevron-down" class="ml-1 size-4" />
    </ListboxButton>
    <ListboxOptions
      class="absolute z-10 mt-1 flex max-h-60 w-32 flex-col overflow-x-hidden overflow-y-auto rounded-md bg-white p-1 shadow-lg"
    >
      <ListboxOption
        v-for="item in props.items"
        :key="item.id"
        :value="item"
        :disabled="item === props.selected"
        v-slot="{ selected, active }"
        as="template"
      >
        <button
          class="relative my-0.5 w-full rounded-md px-1 text-sm text-slate-600 hover:bg-gray-100"
          :class="[selected ? 'bg-gray-100' : '', active ? 'bg-gray-100' : '']"
        >
          {{ props.getTitle(item) }}
        </button>
      </ListboxOption>
    </ListboxOptions>
  </UDropdownMenu>
</template>
