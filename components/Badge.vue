<script setup lang="ts">
import type { BadgeProps } from "~/shared/types";
defineProps<{
  componentProps?: BadgeProps;
}>();
</script>

<template>
  <UBadge
    :ui="{
      base: [
        'rounded-full *:m-0 **:leading-4',
        componentProps?.color === 'primary' ||
        !componentProps ||
        !componentProps.color ||
        ![
          'primary, secondary, info, success, warning, error, neutral',
        ].includes(componentProps?.color)
          ? 'bg-primary/10 text-primary ring ring-inset ring-primary/25'
          : '',
        componentProps?.color === 'secondary'
          ? 'bg-secondary/10 text-secondary ring ring-inset ring-secondary/25'
          : '',
        componentProps?.color === 'success'
          ? 'bg-success/10 text-success ring ring-inset ring-success/25'
          : '',
        componentProps?.color === 'warning'
          ? 'bg-warning/10 text-warning ring ring-inset ring-warning/25'
          : '',
        componentProps?.color === 'neutral'
          ? 'bg-neutral/10 text-neutral ring ring-inset ring-neutral/25'
          : '',
        componentProps?.color === 'error'
          ? 'bg-error/10 text-error ring ring-inset ring-error/25'
          : '',
        componentProps?.color === 'info'
          ? 'bg-info/10 text-info ring ring-inset ring-info/25'
          : '',
      ],
    }"
    :color="componentProps?.color || 'primary'"
  >
    <slot />
  </UBadge>
</template>
