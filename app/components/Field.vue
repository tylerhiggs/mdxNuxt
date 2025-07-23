<script setup lang="ts">
import type { FieldProps } from "~~/shared/types";

defineProps<{
  componentProps: FieldProps;
}>();
</script>

<template>
  <div class="my-2 w-full">
    <div class="my-2 flex items-center gap-3 font-mono text-sm">
      <span v-if="componentProps.name" class="text-primary">{{
        componentProps.name
      }}</span>

      <div class="flex items-center gap-1.5 text-xs">
        <span
          v-if="componentProps.type"
          class="bg-elevated text-toned rounded-sm px-1.5 py-0.5"
          >{{ componentProps.type }}</span
        >
        <span
          v-if="componentProps.required"
          class="bg-error/10 text-error rounded-sm px-1.5 py-0.5"
          >required</span
        >
      </div>
    </div>
    <slot />
  </div>
</template>
