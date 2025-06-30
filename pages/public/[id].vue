<script setup lang="ts">
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
</script>

<template>
  <div v-if="page" class="flex justify-center">
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
      <div v-for="block in page.blocks" :key="block.id">
        <div
          v-if="block.type === 'text' && block.renderedMd"
          v-for="node in block.renderedMd"
        >
          <MdNode :node="node" :preview="false" />
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
