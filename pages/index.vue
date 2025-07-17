<script setup lang="ts">
import type { MdNode } from "~/shared/types";

const { data: page } = useFetch("/api/public/pages/home", {
  method: "GET",
  transform: (data) => {
    return "body" in data ? data.body : null;
  },
});
const nodes = computed<MdNode[][]>(
  () =>
    page.value?.blocks
      .filter((block) => block.type === "text")
      .map((block) => block.renderedMd || []) || [],
);
</script>

<template>
  <main>
    <RenderedPage v-if="page" :nodes="nodes" :page="page" />
    <div v-else>
      <div>
        <UIcon
          name="i-heroicons-arrow-path"
          class="h-5 w-5 animate-spin text-white"
        />
      </div>
    </div>
  </main>
</template>
