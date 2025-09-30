<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { PageItem } from "~~/types/page";
const pageState = usePageState();
const props = defineProps<{
  page: PageItem;
  selected: boolean;
}>();
const emit = defineEmits<{
  addPage: [];
}>();
const snackbarStore = useSnackbar();
const hostname = useRequestURL().origin;
const copyLink = () => {
  navigator.clipboard.writeText(`${hostname}/public/${props.page.id}`);
  snackbarStore.enqueue("Link copied to clipboard", "success");
};

const menuItems = computed<DropdownMenuItem[]>(() => [
  {
    label: props.page.isFavorite ? "Remove from favorites" : "Add to favorites",
    icon: "i-heroicons-star",
    onSelect: () =>
      pageState.updatePage(
        { id: props.page.id, isFavorite: !props.page.isFavorite },
        true,
      ),
  },
  {
    label: "Copy link",
    icon: "i-heroicons-link",
    onSelect: copyLink,
  },
  {
    label: "Duplicate",
    icon: "i-heroicons-document-duplicate",
    onSelect: () => pageState.duplicatePage(props.page.id),
  },
  {
    label: "Delete",
    icon: "i-heroicons-trash",
    onSelect: () => pageState.deletePage(props.page.id),
  },
]);
</script>

<template>
  <NuxtLink
    class="group/pageitem flex items-center justify-between rounded-md py-1 hover:bg-gray-200 focus:border-transparent focus:ring-0 focus:outline-hidden dark:hover:bg-stone-600"
    :class="{ 'bg-gray-200 font-semibold dark:bg-stone-700': props.selected }"
    :to="`/edit/${props.page.id}`"
  >
    <div class="flex">
      <p class="ml-3 text-xl md:text-sm">
        {{ props.page.emoji }}
      </p>
      <p
        class="ml-3 text-xl text-ellipsis text-black md:text-sm dark:text-gray-400"
      >
        {{ props.page.title || "Untitled" }}
      </p>
    </div>
    <div class="flex items-center">
      <UDropdownMenu :items="menuItems">
        <ToolTip message="Delete, duplicate, and more..." position="bottom">
          <UButton
            class="invisible flex items-center rounded-md p-0.5 group-hover/pageitem:visible hover:bg-gray-300 dark:hover:bg-stone-500"
            variant="ghost"
            color="neutral"
          >
            <UIcon
              name="i-heroicons-ellipsis-horizontal"
              class="size-5 text-gray-400"
            />
          </UButton>
        </ToolTip>
      </UDropdownMenu>

      <ToolTip message="Add a page inside" position="bottom">
        <button
          class="invisible flex items-center rounded-md p-0.5 group-hover/pageitem:visible hover:bg-gray-300 dark:hover:bg-stone-500"
          @click.prevent.stop="emit('addPage')"
        >
          <UIcon name="i-heroicons-plus" class="size-5 text-gray-400" />
        </button>
      </ToolTip>
    </div>
  </NuxtLink>
</template>
