<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
} from "@heroicons/vue/24/outline";
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const search = ref("");
const filtersOpen = ref(true);

const sortOptions = [
  { id: "Best Matches" },
  { id: "Last Edited: Newest First" },
  { id: "Last Edited: Oldest First" },
  { id: "Created: Newest First" },
  { id: "Created: Oldest First" },
];
const selectedSort = ref(sortOptions[0]);
const selectSortId = (value: string) => {
  selectedSort.value =
    sortOptions.find((option) => option.id === value) || sortOptions[0];
};

const isTitleOnly = ref(true);
const toggleTitleOnly = () => {
  isTitleOnly.value = !isTitleOnly.value;
};

const createdByOptions = [{ id: "Me" }];
const selectedCreatedBy = ref([createdByOptions[0]]);
const selectCreatedByOptions = (value: string) => {
  selectedCreatedBy.value.push(
    createdByOptions.find((option) => option.id === value) ||
      createdByOptions[0],
  );
};
</script>

<template>
  <Dialog
    as="div"
    :open="props.open"
    @close="() => emit('close')"
    class="fixed inset-0 z-10 flex justify-center overflow-y-auto bg-black bg-opacity-20 pt-12"
  >
    <DialogPanel class="flex h-3/6 w-6/12 flex-col rounded-xl bg-gray-50">
      <div class="mt-0 flex items-center">
        <MagnifyingGlassIcon class="mx-2 size-5 text-gray-400" />
        <input
          type="text"
          class="h-10 w-full bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-transparent focus:outline-hidden"
          placeholder="Search..."
          v-model="search"
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
            <AdjustmentsHorizontalIcon class="size-5 text-gray-400" />
          </button>
        </ToolTip>
      </div>
      <hr class="border-gray-200" />
      <div v-if="filtersOpen" class="flex items-center p-2">
        <PillListBox
          :items="sortOptions"
          :selected="selectedSort"
          :getTitle="(item) => item.id"
          @select="selectSortId"
        >
          <ArrowsUpDownIcon class="mr-1 size-4" />
          {{ selectedSort.id === sortOptions[0].id ? "Sort" : selectedSort.id }}
        </PillListBox>
        <button
          class="ml-2 flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-sm text-gray-400 hover:bg-gray-100"
          :class="[
            isTitleOnly ? 'border-blue-400 text-blue-400 hover:bg-blue-50' : '',
          ]"
          @click="toggleTitleOnly"
        >
          <p class="mr-1 font-medium">Aa</p>
          Title only
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</template>
