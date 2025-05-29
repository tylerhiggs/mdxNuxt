<script setup lang="ts">
import { render } from "vue";
import { parseMd } from "~/shared/parseMd";
import { type MdNode } from "~/shared/types";

definePageMeta({
  layout: "default",
  validate({ params }) {
    return typeof params.id === "string" && !isNaN(Number(params.id));
  },
});
const route = useRoute();
watch(
  () => route.params.id,
  (paramId) => {
    console.log("paramId", paramId);
    const strParamId = paramId as string;
  },
);

const { data: page } = useFetch(() => `/api/public/pages/${route.params.id}`, {
  method: "GET",
  transform: (res) => {
    return res.body;
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

const colorMode = useColorMode();
const isDarkMode = computed(() => colorMode.value === "dark");
/**
 * This is the re-computed array of rendered Markdown nodes that
 * replaces the original `renderedMd` in the page blocks that
 * are hydrated from the server and present on first render.
 *
 * We need to re-render the Markdown nodes when the system color
 * mode changes (dark/light mode) because of syntax highlighting
 * and other styles that depend on the color mode.
 */
const renderedMdNodes = ref<MdNode[][]>([]);

watch(
  isDarkMode,
  async (isDark) => {
    renderedMdNodes.value = await Promise.all(
      page.value?.blocks.map(async (block) => {
        if (block.type === "text" && block.renderedMd) {
          return await parseMd(block.textContent, !isDark);
        }
        return [];
      }) || [],
    );
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="page" class="flex justify-center">
    <div class="flex w-8/12 flex-col p-4">
      <div class="mb-4 flex items-center gap-4">
        <div class="text-5xl">{{ page.emoji }}</div>
        <h1 class="text-4xl font-bold">{{ page.title }}</h1>
      </div>
      <div v-for="(block, blockIndex) in page.blocks" :key="block.id">
        <div
          v-if="block.type === 'text' && block.renderedMd"
          v-for="(node, nodeIndex) in block.renderedMd"
        >
          <MdNode
            v-if="!renderedMdNodes.length"
            :node="node"
            :preview="false"
          />
          <MdNode
            v-else
            :node="renderedMdNodes[blockIndex][nodeIndex]"
            :preview="false"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div>
      <UIcon
        name="i-heroicons-arrow-path"
        class="h-5 w-5 animate-spin text-white"
      />
    </div>
  </div>
</template>
