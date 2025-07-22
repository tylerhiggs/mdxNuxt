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
      body: 'p-2 sm:p-3 [p]:m-0',
      root: ['border border-neutral-200 group my-2'],
    }"
  >
    <a
      v-if="componentProps.link"
      class="flex justify-between text-neutral-500 dark:text-neutral-300"
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
          class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
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
    <div
      v-else
      class="flex flex-col justify-center gap-1 text-neutral-500 dark:text-neutral-300"
    >
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
