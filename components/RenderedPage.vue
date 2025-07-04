<script setup lang="ts">
import type { MdNode } from "~/shared/types";
defineProps<{
  nodes: MdNode[][];
  page: {
    title: string;
    emoji: string;
    coverUrl?: string;
  };
}>();
</script>

<template>
  <div class="flex justify-center">
    <div class="flex w-8/12 flex-col p-4">
      <div v-if="page.coverUrl" class="h-64 w-full">
        <img
          :src="
            !/^https?:\/\//.test(page.coverUrl)
              ? `/api/private/avatars/${page.coverUrl}`
              : page.coverUrl
          "
          alt="Page Cover"
          style="object-position: center 20%"
          class="h-64 w-full object-cover"
        />
      </div>
      <div class="mb-4 flex items-center gap-4">
        <div class="text-5xl">{{ page.emoji }}</div>
        <h1 class="text-4xl font-bold">{{ page.title }}</h1>
      </div>
      <div v-for="(block, i) in nodes" :key="i">
        <div v-for="node in block">
          <MdNode :node="node" />
        </div>
      </div>
    </div>
  </div>
</template>
