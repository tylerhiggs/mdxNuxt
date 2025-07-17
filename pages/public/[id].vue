<script setup lang="ts">
import type { MdNode } from "~/shared/types";

definePageMeta({
  layout: false,
  validate({ params }) {
    return typeof params.id === "string" && !isNaN(Number(params.id));
  },
});
const route = useRoute();

const { data: page } = useFetch(() => `/api/public/pages/${route.params.id}`, {
  method: "GET",
  transform: (data) => {
    return "body" in data ? data.body : null;
  },
});

const pageTitle = computed(() => {
  return page.value?.title || "No Page Title";
});

const pageEmojiPath = computed(() => {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${page.value?.emoji || "📄"}</text></svg>`;
});

watch(
  pageEmojiPath,
  (newPath) => {
    document?.querySelector("link[rel='icon']")?.setAttribute("href", newPath);
  },
  { immediate: true },
);

useHead({
  title: pageTitle,
  link: [
    {
      rel: "icon",
      href: pageEmojiPath,
    },
  ],
});

const nodes = computed<MdNode[][]>(
  () =>
    page.value?.blocks
      .filter((block) => block.type === "text")
      .map((block) => block.renderedMd || []) || [],
);
</script>

<template>
  <main class="min-h-screen">
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
