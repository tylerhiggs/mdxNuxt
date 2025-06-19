<script setup lang="ts">
import type { BadgeProps } from "~/shared/types";
defineProps<{
  componentProps?: BadgeProps;
}>();
</script>

<template>
  <UBadge v-bind="componentProps">
    <slot />
  </UBadge>
</template>
