<script setup lang="ts">
const props = defineProps<{
  title: string;
  selected?: boolean;
}>();
const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="flex items-center rounded-md py-1 hover:bg-gray-200 focus:border-transparent focus:ring-0 focus:outline-hidden dark:hover:bg-stone-700"
    :class="{ 'bg-gray-200 font-semibold': props.selected }"
    @click="() => emit('click')"
  >
    <slot></slot>
    <p class="ml-3 text-xl md:text-sm">{{ props.title }}</p>
  </button>
</template>
