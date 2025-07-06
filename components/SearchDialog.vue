<script setup lang="ts">
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const search = ref("");
const filtersOpen = ref(true);

const sortOptions = [
  { name: "Best Matches", id: "bestMatches" },
  { name: "Last Edited: Newest First", id: "last-updated" },
  { name: "Last Edited: Oldest First", id: "oldest-updated" },
  { name: "Created: Newest First", id: "newest-created" },
  { name: "Created: Oldest First", id: "oldest-created" },
];
const selectedSort = ref(sortOptions[0]);
const selectSortId = (value: string) => {
  selectedSort.value =
    sortOptions.find((option) => option.id === value) || sortOptions[0];
};
const selectedPageIndex = ref(0);

const isTitleOnly = ref(true);
const toggleTitleOnly = () => {
  isTitleOnly.value = !isTitleOnly.value;
};

// const createdByOptions = [{ id: "Me" }];
// const selectedCreatedBy = ref([createdByOptions[0]]);
// const selectCreatedByOptions = (value: string) => {
//   selectedCreatedBy.value.push(
//     createdByOptions.find((option) => option.id === value) ||
//       createdByOptions[0],
//   );
// };

const closeDialog = () => {
  search.value = "";
  selectedPageIndex.value = 0;
  emit("close");
};

const { data: searchResults } = useFetch("/api/private/pages/search", {
  method: "GET",
  query: {
    search,
    titleOnly: isTitleOnly,
    sort: selectedSort.value.id,
  },
  watch: [isTitleOnly, selectedSort, search],
  transform: (response) => [...response.body],
  immediate: false,
});

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

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.open) return;
  const resultsLength = searchResults.value?.length;
  if (!resultsLength) return;
  if (event.key === "ArrowUp") {
    selectedPageIndex.value =
      (selectedPageIndex.value - 1 + resultsLength) % resultsLength;
  } else if (event.key === "ArrowDown") {
    selectedPageIndex.value = (selectedPageIndex.value + 1) % resultsLength;
  } else if (
    event.key === "Enter" &&
    searchResults.value &&
    resultsLength > selectedPageIndex.value
  ) {
    const selectedResult = searchResults.value[selectedPageIndex.value];
    navigateTo(`/edit/${selectedResult.id}`);
    closeDialog();
    event.preventDefault();
    event.stopPropagation();
  }
};
</script>

<template>
  <UModal
    :open="props.open"
    class="fixed inset-0 z-10 flex justify-center overflow-y-auto bg-gray-900/50 pt-12 backdrop-blur-sm"
    @close="closeDialog"
  >
    <template #content>
      <div class="mt-0 flex items-center" @keydown="handleKeyDown">
        <UIcon
          name="i-heroicons-magnifying-glass"
          class="mx-2 size-5 text-gray-400"
        />
        <input
          v-model="search"
          type="text"
          class="h-10 w-full bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-transparent focus:outline-hidden dark:text-stone-100 dark:placeholder-stone-300"
          placeholder="Search..."
        />
        <ToolTip
          class="mx-2"
          :message="filtersOpen ? 'Hide Filters' : 'Show Filters'"
          position="bottom"
        >
          <button
            class="mx-2 rounded-md p-1 hover:bg-gray-100"
            @click="() => (filtersOpen = !filtersOpen)"
          >
            <UIcon
              name="i-heroicons-adjustments-horizontal"
              class="size-5 text-gray-400"
            />
          </button>
        </ToolTip>
      </div>
      <hr class="border-gray-200" />
      <div v-if="filtersOpen" class="flex items-center p-2">
        <PillListBox
          :items="sortOptions"
          :selected="selectedSort"
          :get-title="(item) => item.name"
          icon-name="i-heroicons-arrow-up-down"
          @select="selectSortId"
        />
        <button
          class="ml-2 flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-sm"
          :class="{
            'bg-blue-500 text-white hover:bg-blue-700': isTitleOnly,
            'text-gray-500 hover:bg-gray-100': !isTitleOnly,
          }"
          @click="toggleTitleOnly"
        >
          <p class="mr-1 font-medium">Aa</p>
          Title only
        </button>
      </div>
      {{ selectedPageIndex }}
      {{ searchResults?.length || "nothing" }}
      <div class="flex h-3/6 w-full flex-col overflow-y-auto p-2">
        <div
          v-for="(result, index) in searchResults"
          :key="result.id"
          :class="{
            'bg-gray-200 dark:bg-stone-600': selectedPageIndex === index,
          }"
          class="flex items-center justify-between rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-stone-600"
        >
          <NuxtLink
            :to="`/edit/${result.id}`"
            class="flex w-full items-center justify-between"
          >
            <p class="text-sm text-gray-700 dark:text-white">
              {{ result.title || "Untitled" }}
            </p>
            <p class="text-xs text-gray-500 dark:text-stone-400">
              {{
                dateIsToday(result.lastUpdatedAt)
                  ? "Today"
                  : toShortDate(result.lastUpdatedAt)
              }}
            </p>
          </NuxtLink>
        </div>
        <div
          v-if="searchResults?.length === 0"
          class="flex h-full items-center justify-center text-gray-500"
        >
          <p class="text-sm">No results found</p>
        </div>
      </div>
    </template>
  </UModal>
</template>
