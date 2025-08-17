<script setup lang="ts">
import fs from "fs";

defineRouteRules({
  prerender: true,
});
definePageMeta({
  layout: false,
});
const { data: page } = await useAsyncData("home-page", async () => {
  const staticData = fs.readFileSync("server/assets/home.txt", "utf-8");
  return {
    title: "Extended Markdown Editor - Typography",
    emoji: "🎨",
    showOutline: true,
    blocks: [
      {
        type: "text",
        renderedMd: await parseMd(staticData),
      },
    ],
  };
});
const pageTitle = page.value?.title || "No Page Title";
const pageEmojiPath = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${page.value?.emoji || "📄"}</text></svg>`;

document
  ?.querySelector("link[rel='icon']")
  ?.setAttribute("href", pageEmojiPath);
useHead({
  title: pageTitle,
  link: [
    {
      rel: "icon",
      href: pageEmojiPath,
    },
  ],
});

const nodes = page.value?.blocks
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
