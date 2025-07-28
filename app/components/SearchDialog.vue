<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from "@nuxt/ui";

const open = defineModel<boolean>("open", { required: true, default: false });

const search = ref("");
const debouncedSearch = useDebounce(search, 300);

type SearchResult = {
  id: number;
  title: string;
  emoji: string;
  createdAt: number;
  lastUpdatedAt: number;
  blocks: {
    id: number;
    textContent: string;
  }[];
};

const closeDialog = () => {
  search.value = "";
};

watch(
  () => open.value,
  (newValue) => {
    if (!newValue) {
      closeDialog();
    }
  },
  { immediate: true },
);

const { data: searchResults, status } = useFetch("/api/private/pages/search", {
  method: "GET",
  query: {
    search: debouncedSearch,
    titleOnly: false,
    sort: "bestMatches",
  },
  watch: [debouncedSearch],
  transform: (response) =>
    [...response.body].map((result: SearchResult) => {
      const foundIndex = result.blocks.at(0)?.textContent.indexOf(search.value);
      return {
        id: result.id,
        label: result.title,
        suffix: result.blocks.length
          ? foundIndex && foundIndex !== -1
            ? result.blocks
                .at(0)
                ?.textContent.slice(foundIndex - 15, foundIndex + 15)
            : result.blocks.at(0)?.textContent.slice(0, 30)
          : "",
        emoji: result.emoji,
        createdAt: result.createdAt,
        lastUpdatedAt: result.lastUpdatedAt,
        blocks: result.blocks,
      } satisfies CommandPaletteItem;
    }),
  immediate: true,
});

const groups = computed(
  () =>
    [
      {
        id: "search-results",
        items: searchResults.value || [],
      },
    ] satisfies CommandPaletteGroup[],
);

const toShortDate = (date: number) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
const dateIsToday = (date: number) => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCommandPalette
        v-model:search-term="search"
        :groups="groups"
        :loading="status === 'pending'"
        @update:model-value="
          (item) => {
            if (item && item.id) {
              navigateTo(`/edit/${item.id}`);
              open = false;
              closeDialog();
            }
          }
        "
      >
        <template #item-leading="{ item }">
          {{ item.emoji || "📃" }}
        </template>
        <template #item-trailing="{ item }">
          <p class="text-xs text-gray-500 dark:text-stone-400">
            {{
              dateIsToday(item.lastUpdatedAt)
                ? "Today"
                : toShortDate(item.lastUpdatedAt)
            }}
          </p>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
