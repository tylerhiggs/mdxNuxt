<script lang="ts" setup>
import type { CollapsibleProps } from "~/shared/types";

const props = defineProps<{
  componentProps: CollapsibleProps;
}>();
const open = ref(false);
const buttonText = computed(() => {
  if (props.componentProps.name) {
    return props.componentProps.name;
  }
  return open.value
    ? props.componentProps.openText || "Hide"
    : props.componentProps.closeText || "Show";
});
</script>

<template>
  <UCollapsible
    :ui="{
      root: 'my-2',
      content: '*:first:mt-2.5 *:last:mb-0 *:my-1.5',
    }"
    v-model:open="open"
  >
    <UButton
      color="neutral"
      variant="ghost"
      :ui="{
        base: 'group relative rounded-xs inline-flex items-center gap-1.5 text-muted hover:text-default text-sm focus-visible:ring-2 focus-visible:ring-primary focus:outline-none',
        leadingIcon:
          'size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200',
        label: 'truncate',
      }"
      :icon="`i-heroicons-${props.componentProps.icon || 'chevron-down'}`"
    >
      {{ buttonText }}</UButton
    >
    <template #content>
      <slot />
    </template>
  </UCollapsible>
</template>
