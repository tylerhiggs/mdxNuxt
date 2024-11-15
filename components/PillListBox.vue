<script setup lang="ts" generic="T extends { id: string }">
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const props = defineProps<{
  items: T[];
  selected: T;
  getTitle: (item: T) => string;
}>();

const emit = defineEmits<{
  select: [string];
}>();
</script>

<template>
  <Listbox
    :modelValue="props.selected"
    @update:modelValue="(value: T) => emit('select', value.id)"
    by="id"
    as="div"
    class="relative"
  >
    <ListboxButton
      class="flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-sm text-gray-400 hover:bg-gray-100"
    >
      <slot></slot>
      <ChevronDownIcon class="ml-1 size-4" />
    </ListboxButton>
    <ListboxOptions
      class="absolute z-10 mt-1 flex max-h-60 w-32 flex-col overflow-y-auto overflow-x-hidden rounded-md bg-white p-1 shadow-lg"
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
  </Listbox>
</template>
