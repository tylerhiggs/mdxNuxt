<script setup lang="ts">
defineRouteRules({
  prerender: true,
});
const page = {
  title: "Extended Markdown Editor - Typography",
  emoji: "🎨",
  showOutline: true,
  blocks: [
    {
      type: "text",
      renderedMd: await parseMd((await import("~~/home.md?raw")).default),
    },
  ],
};
const pageTitle = computed(() => {
  return page?.title || "No Page Title";
});
const pageEmojiPath = computed(() => {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${page?.emoji || "📄"}</text></svg>`;
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

const nodes = page.blocks
  .filter((block) => block.type === "text")
  .map((block) => block.renderedMd || []);
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
