import type { PageItem, Page, PageUpdate } from "@/types/page";
const DEBOUNCE_TIME = 2000;

export function usePageState() {
  const firebase = useFirebase();
  const snackbarStore = useSnackbar();

  // private state
  const lastUpdatedAt = ref(Date.now());

  // public state
  const pages = ref<PageItem[]>([]);
  const currentPage = ref<Page>();

  /**
   * Unsaved changes to the current page, not including blocks
   * If undefined, there are no unsaved changes
   */
  const pageUpdateToSave = ref<PageUpdate>();

  const selectPage = async (pageId: string) => {
    const page = await firebase.getPage(pageId);
    if (!page) {
      snackbarStore.enqueue("Failed to load page", "error");
      return;
    }
    if (currentPage.value && pageUpdateToSave.value) {
      lastUpdatedAt.value = Date.now();
      executePageUpdateDb();
    }
    currentPage.value = page;
  };

  const createPage = async () => {
    const newPage = await firebase.addPage();
    if (!newPage) {
      snackbarStore.enqueue("Failed to create page", "error");
      return;
    }
    pages.value = [...pages.value, newPage];
    selectPage(newPage.id);
    snackbarStore.enqueue("Page created", "success");
  };

  const executePageUpdateDb = async () => {
    if (!pageUpdateToSave.value) {
      console.error("No page update to save");
      snackbarStore.enqueue("No page update to save", "error");
      return;
    }
    const success = await firebase.updatePage(pageUpdateToSave.value);
    if (!success) {
      console.error(
        "[pageState]: Error updating page - ",
        pageUpdateToSave.value,
      );
      snackbarStore.enqueue("Error updating page", "error");
      return;
    }
    pages.value = pages.value.map((page) =>
      page.id === pageUpdateToSave.value?.id
        ? { ...page, ...pageUpdateToSave.value }
        : page,
    );
    if (
      currentPage.value &&
      currentPage.value.id === pageUpdateToSave.value.id
    ) {
      currentPage.value = { ...currentPage.value, ...pageUpdateToSave.value };
    }
    pageUpdateToSave.value = undefined;
    snackbarStore.enqueue("Successfully updated page", "success");
  };

  /**
   *
   * Update the current page with the given update, but not the
   * blocks or actual content of the page
   *
   * @param update update to apply to the current page
   * @returns
   */
  const updatePage = async (
    update: PageUpdate,
    instantSave: boolean = false,
  ) => {
    if (!currentPage.value) {
      console.error("No current page to update");
      snackbarStore.enqueue("No current page to update", "error");
      return;
    }
    if (update.id !== currentPage.value.id) {
      console.error("Unable to update page due to mismatching ids");
      snackbarStore.enqueue("Unable to update page", "error");
    }
    if (update.title) {
      const newPath = [...currentPage.value.path];
      newPath[newPath.length - 1].title = update.title;
      pageUpdateToSave.value = {
        ...pageUpdateToSave.value,
        path: newPath,
        id: update.id,
        title: update.title,
      };
    }
    if (update.emoji) {
      const newPath = [...currentPage.value.path];
      newPath[newPath.length - 1].emoji = update.emoji;
      pageUpdateToSave.value = {
        ...pageUpdateToSave.value,
        path: newPath,
        id: update.id,
        emoji: update.emoji,
      };
    }
    pageUpdateToSave.value = { ...pageUpdateToSave.value, ...update };
    lastUpdatedAt.value = Date.now();
    if (instantSave) {
      executePageUpdateDb();
      return;
    }
    setTimeout(() => {
      if (lastUpdatedAt.value + DEBOUNCE_TIME > Date.now()) return;
      executePageUpdateDb();
    }, DEBOUNCE_TIME);
  };

  const deletePage = async (pageId: string) => {
    const success = await firebase.deletePage(pageId);
    if (!success) {
      snackbarStore.enqueue("Failed to delete page", "error");
      return;
    }
    pages.value = pages.value.filter((page) => page.id !== pageId);
    if (currentPage.value?.id === pageId) {
      currentPage.value = undefined;
    }
    snackbarStore.enqueue("Page deleted", "success");
  };

  const getPages = async () => {
    const newPages = await firebase.getPages();
    if (!newPages.length) {
      snackbarStore.enqueue("No pages found", "info");
      return;
    }
    pages.value = newPages;
    if (!currentPage.value && newPages.length) {
      selectPage(newPages[0].id);
    }
  };

  return {
    pages: computed(() =>
      pageUpdateToSave.value
        ? pages.value.map((page) =>
            page.id === pageUpdateToSave.value?.id
              ? { ...page, ...pageUpdateToSave.value }
              : page,
          )
        : pages.value,
    ),
    currentPage: computed(() => {
      return currentPage.value
        ? { ...currentPage.value, ...pageUpdateToSave.value }
        : undefined;
    }),
    selectPage,
    createPage,
    updatePage,
    isSaved: computed(() => {
      return !pageUpdateToSave.value;
    }),
    deletePage,
    getPages,
  };
}
