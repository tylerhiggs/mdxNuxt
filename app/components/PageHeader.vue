<script setup lang="ts">
const { currentPage: page, updatePage } = usePageState();
const snackbarStore = useSnackbar();
const emits = defineEmits<{
  uploadCover: [];
}>();
const newCoverUrl = ref("");

const selectEmoji = (emoji: string) => {
  const id = page.value?.id;
  if (!id) {
    console.warn("Select emoji called with invalid data", { id, emoji });
    return;
  }
  updatePage({ id, emoji }, true);
};
const updateTitle = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const [id, title] = [page.value?.id, target.value];
  if (!id || !title) {
    console.warn("Update title called with invalid data", { id, title });
    return;
  }
  updatePage({ id, title });
};
const deleteCover = () => {
  if (!page.value) {
    console.warn("No page found to delete cover URL");
    return;
  }
  updatePage({ id: page.value.id, coverUrl: "" });
  snackbarStore.enqueue("Cover removed successfully", "success");
};
</script>

<template>
  <div
    class="relative z-0 flex w-full flex-initial justify-center"
    :class="{ 'h-96': page?.coverUrl }"
  >
    <div v-if="page?.coverUrl" class="absolute top-0 right-0 left-0 z-0 h-64">
      <img
        :src="
          !page?.coverUrl?.includes('https://')
            ? `/api/private/avatars/${page?.coverUrl}`
            : page?.coverUrl
        "
        alt="Page Cover"
        style="object-position: center 20%"
        class="h-64 w-full object-cover"
      />
    </div>
    <div class="z-10 flex w-8/12 flex-col justify-end">
      <div class="group pt-12">
        <UPopover>
          <UButton
            variant="ghost"
            color="neutral"
            class="flex rounded-md border-none text-7xl hover:bg-gray-100 focus:outline-hidden dark:hover:bg-stone-600"
          >
            {{ page?.emoji }}
          </UButton>
          <template #content>
            <LazyEmojiPicker @select="selectEmoji" />
          </template>
        </UPopover>
        <div
          class="invisible my-1 flex items-center text-xs text-gray-400 group-hover:visible"
        >
          <UPopover mode="hover">
            <UButton
              variant="ghost"
              color="neutral"
              class="mr-1"
              icon="i-heroicons-photo"
              @click="() => emits('uploadCover')"
            >
              {{ page?.coverUrl ? "Change Cover" : "Add Cover" }}
            </UButton>
            <template #content>
              <UButtonGroup orientation="vertical">
                <UButton
                  variant="ghost"
                  color="neutral"
                  @click="() => emits('uploadCover')"
                >
                  <UIcon name="i-heroicons-photo" class="mr-2 size-5" />
                  Upload Cover Photo
                </UButton>
                <UButtonGroup>
                  <UInput
                    v-model="newCoverUrl"
                    placeholder="Enter Cover URL"
                    @keydown.enter="
                      () =>
                        page?.id &&
                        updatePage(
                          {
                            id: page?.id,
                            coverUrl: newCoverUrl,
                          },
                          true,
                        )
                    "
                  />
                  <UButton
                    variant="ghost"
                    color="neutral"
                    label="Save"
                    @click="
                      () => {
                        if (!page?.id) return;
                        updatePage(
                          {
                            id: page.id,
                            coverUrl: newCoverUrl,
                          },
                          true,
                        );
                      }
                    "
                  />
                </UButtonGroup>
              </UButtonGroup>
            </template>
          </UPopover>
          <UButton
            v-if="page?.coverUrl"
            variant="ghost"
            color="neutral"
            class="mr-1"
            icon="i-heroicons-trash"
            @click="deleteCover"
          >
            Remove Cover
          </UButton>
        </div>

        <h1 class="mt-1 w-full text-4xl font-bold">
          <input
            type="text"
            :value="page?.title"
            placeholder="Untitled"
            class="w-full outline-hidden dark:bg-inherit"
            @input="updateTitle"
          />
        </h1>
      </div>
    </div>
  </div>
</template>
