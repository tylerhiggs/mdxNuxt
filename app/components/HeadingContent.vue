<script setup lang="ts">
import type { HeadingNode } from "~/shared/types";
defineProps<{
  node: HeadingNode;
  href: string;
}>();
</script>

<template>
  <a
    :href="href"
    class="group text-neutral-500 sm:-ms-2 sm:ps-2 dark:text-neutral-300"
  >
    <span
      class="bg-elevated hover:text-primary text-muted invisible absolute top-1/2 -ms-8 -translate-y-1/2 rounded-md p-1 sm:flex sm:group-hover:visible"
    >
      <UIcon name="i-heroicons-hashtag" size="xs" class="size-4" />
    </span>
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </a>
</template>
