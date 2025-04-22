<script setup lang="ts">
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
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
</script>

<template>
  <div v-if="page">
    <div class="flex h-screen w-screen items-center justify-center">
      <div
        class="flex w-1/2 flex-col items-center justify-center rounded-lg p-4 shadow-lg"
      >
        <div class="text-6xl">{{ page.emoji }}</div>
        <h1 class="text-2xl font-bold">{{ page.title }}</h1>
        <div v-for="block in page.blocks" :key="block.id">
          <div
            v-if="block.type === 'text' && block.renderedMd"
            v-for="node in block.renderedMd"
          >
            <MdNode :node="node" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div><ArrowPathIcon class="h-5 w-5 animate-spin text-white" /></div>
  </div>
</template>
