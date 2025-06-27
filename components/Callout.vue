<script setup lang="ts">
import type { CalloutProps } from "~/shared/types";

defineProps<{
  componentProps: Partial<CalloutProps>;
}>();
</script>

<template>
  <div
    class="my-2 rounded p-3"
    :class="{
      'border border-neutral-400 bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-100':
        componentProps.color === 'neutral',
      'border-error/25 bg-error/10 text-error-600 dark:text-error-300 [&_a]:text-error [&_a]:hover:border-error border':
        componentProps.color === 'error',
      'border-success/25 bg-success/10 text-success-600 dark:text-success-300 [&_a]:text-success [&_a]:hover:border-success border':
        componentProps.color === 'success',
      'border-warning/25 bg-warning/10 text-warning-600 dark:text-warning-300 [&_a]:text-warning [&_a]:hover:border-warning border':
        componentProps.color === 'warning',
      'border-info/25 bg-info/10 text-info-600 dark:text-info-300 [&_a]:text-info [&_a]:hover:border-info border':
        componentProps.color === 'info',
      'border-primary/25 bg-primary/10 text-primary-600 dark:text-primary-300 [&_a]:text-primary [&_a]:hover:border-primary border':
        componentProps.color === 'primary',
      'border-secondary/25 bg-secondary/10 text-secondary-600 dark:text-secondary-300 [&_a]:text-secondary [&_a]:hover:border-secondary border':
        componentProps.color === 'secondary',
      'border-muted bg-muted text-highlighted border':
        !componentProps.color ||
        ![
          'error',
          'warning',
          'info',
          'success',
          'primary',
          'secondary',
        ].includes(componentProps.color),
    }"
  >
    <template v-if="componentProps.link">
      <a :href="componentProps.link" target="_blank">
        <div class="flex items-center gap-2">
          <UIcon
            v-if="componentProps.icon"
            :name="`i-heroicons-${componentProps.icon}`"
            class="h-5 w-5 text-current"
          />
          <div class="flex flex-col">
            <slot />
          </div>
        </div>
      </a>
    </template>
    <template v-else>
      <div class="flex items-center gap-2">
        <UIcon
          v-if="componentProps.icon"
          :name="`i-heroicons-${componentProps.icon}`"
          class="h-5 w-5 text-current"
        />
        <div class="flex flex-col">
          <slot />
        </div>
      </div>
    </template>
  </div>
</template>
