<script setup lang="ts">
import { sanitizeUrl } from "@braintree/sanitize-url";
import type { HeadingOutlineItem } from "~~/shared/types";
defineProps<{
  items: HeadingOutlineItem[];
}>();
const { visibleElementIds } = useElementVisibilityState();
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id" class="ps-4">
      <a
        class="focus-visible:outline-primary py-1 text-sm transition-colors"
        :class="
          visibleElementIds?.includes(item.id)
            ? 'text-primary font-semibold'
            : 'text-muted hover:text-default'
        "
        :href="sanitizeUrl(`#${item.id}`)"
        >{{ item.label }}</a
      >
      <OutlineItems v-if="item.items.length" :items="item.items" />
    </li>
  </ul>
</template>
