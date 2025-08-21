<script setup lang="ts">
import type { MdNode } from "~~/shared/types";
defineProps<{
  nodes: MdNode[][];
  page: {
    title?: string;
    emoji?: string;
    coverUrl?: string;
    showOutline?: boolean;
    userId?: number;
    lastUpdatedByName?: string;
    createdByName?: string;
    user?: {
      name: string;
    };
  };
  narrowView?: boolean;
  noTitle?: boolean;
  showAuthor?: boolean;
}>();
</script>

<template>
  <div class="grid grid-cols-12">
    <div
      class="col-span-12 flex flex-col p-4"
      :class="{
        'md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3':
          !narrowView,
      }"
    >
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
      <div v-if="!noTitle" class="mb-4 flex items-center gap-4">
        <div class="text-5xl">{{ page.emoji }}</div>
        <h1 class="text-4xl font-bold">{{ page.title }}</h1>
      </div>
      <h2 v-if="page.user" class="text-muted mb-3 text-xl font-semibold">
        {{ page.user.name }}
      </h2>
      <div v-for="(block, i) in nodes" :key="`block-${i}`">
        <div v-for="node in block" :key="node.id">
          <MdNode :node="node" />
        </div>
      </div>
    </div>
    <div
      v-if="!narrowView && page.showOutline"
      class="lg-flex-col sticky top-0 col-span-12 hidden max-h-screen md:col-span-2 lg:col-span-2 lg:flex"
    >
      <Outline v-if="nodes.length > 0" :nodes="nodes.flat()" />
    </div>
  </div>
</template>
