<script setup lang="ts">
import type { CardProps } from "~/shared/types";
defineProps<{
  componentProps: CardProps;
}>();
</script>

<template>
  <UCard
    v-bind="componentProps"
    :ui="{
      body: 'p-2 sm:p-3',
      root: [
        'border border-neutral-200 group my-2',
        componentProps.color === 'neutral' &&
          'hover:border-neutral-600 hover:bg-neutral-200',
        componentProps.color === 'error' &&
          'hover:border-error/25 hover:bg-error/10',
        componentProps.color === 'success' &&
          'hover:border-success/25 hover:bg-success/10',
        componentProps.color === 'warning' &&
          'hover:border-warning/25 hover:bg-warning/10',
        componentProps.color === 'info' &&
          'hover:border-info/25 hover:bg-info/10',
        componentProps.color === 'primary' &&
          'hover:border-primary/25 hover:bg-primary/10',
        componentProps.color === 'secondary' &&
          'hover:border-secondary/25 hover:bg-secondary/10',
        (!componentProps.color ||
          ![
            'error',
            'warning',
            'info',
            'success',
            'primary',
            'secondary',
          ].includes(componentProps.color)) &&
          'hover:border-muted hover:bg-muted',
      ].filter(Boolean),
    }"
  >
    <a
      class="flex justify-between text-neutral-500 dark:text-neutral-500"
      v-if="componentProps.link"
      :href="componentProps.link"
      target="_blank"
    >
      <div class="flex flex-col justify-center gap-1">
        <UIcon
          v-if="componentProps.icon"
          :name="`i-heroicons-${componentProps.icon}`"
          class="h-5 w-5 p-3 text-current"
          :class="{
            'text-primary': componentProps.color === 'primary',
            'text-secondary': componentProps.color === 'secondary',
            'text-success': componentProps.color === 'success',
            'text-warning': componentProps.color === 'warning',
            'text-error': componentProps.color === 'error',
            'text-info': componentProps.color === 'info',
          }"
        />
        <p
          v-if="componentProps.title"
          class="text-lg font-semibold text-neutral-900"
        >
          {{ componentProps.title }}
        </p>
        <slot />
      </div>
      <div class="flex flex-col">
        <UIcon
          name="i-heroicons-arrow-up-right"
          :class="{
            'group-hover:text-primary': componentProps.color === 'primary',
            'group-hover:text-secondary': componentProps.color === 'secondary',
            'group-hover:text-success': componentProps.color === 'success',
            'group-hover:text-warning': componentProps.color === 'warning',
            'group-hover:text-error': componentProps.color === 'error',
            'group-hover:text-info': componentProps.color === 'info',
          }"
        />
      </div>
    </a>
    <div v-else class="flex flex-col justify-center gap-1 text-neutral-500">
      <UIcon
        v-if="componentProps.icon"
        :name="`i-heroicons-${componentProps.icon}`"
        class="h-5 w-5 text-current"
      />
      <p
        v-if="componentProps.title"
        class="text-lg font-semibold text-neutral-900"
      >
        {{ componentProps.title }}
      </p>
      <slot />
    </div>
  </UCard>
</template>
