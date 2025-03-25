import {
  type PageItem,
  type Page,
  type PageUpdate,
  type BlockUpdate,
} from "@/types/page";

const DEBOUNCE_TIME = 2000;

export function usePageState() {
  const snackbarStore = useSnackbar();

  // private state
  const lastUpdatedAt = useState("lastUpdatedAt", () => Date.now());

  // public state
  const pages = useState<PageItem[]>("pages", () => []);
  const currentPageId = useState<number | undefined>(
    "currentPageId",
    () => undefined,
  );
  const currentPage = useState<Page | undefined>(
    "currentPage",
    () => undefined,
  );

  /**
   * Unsaved changes to the current page, not including blocks
   * If undefined, there are no unsaved changes
   */
  const pageUpdateToSave = useState<PageUpdate | undefined>(
    "pageUpdateToSave",
    () => undefined,
  );

  const blockUpdateToSave = useState<BlockUpdate | undefined>(
    "blockUpdateToSave",
    () => undefined,
  );

  const { data: pageData, error: pageGetError } = useFetch(
    () => `/api/private/pages/${currentPageId.value}`,
    {
      watch: [currentPageId],
      method: "get",
      transform: (data) => ({
        ...data.body,
        path: JSON.parse(data.body.path) as {
          id: number;
          title: string;
          emoji: string;
        }[],
      }),
    },
  );

  watch(currentPageId, (newValue) =>
    console.log("currentPageId changed", newValue),
  );

  watch(pageData, (newPageData) => {
    console.log("pageData changed", newPageData);
  });

  const selectPage = async (pageId: number) => {
    currentPageId.value = pageId;
    console.log("pageId changed", pageId);
    if (currentPage.value && pageUpdateToSave.value) {
      lastUpdatedAt.value = Date.now();
      executePageUpdateDb();
    }
    navigateTo(`/edit/${pageId}`);
  };

  const createPage = async () => {
    const { body } = await $fetch("/api/private/pages", {
      method: "POST",
      body: {
        path: [],
      },
    });
    if (!body) {
      snackbarStore.enqueue("Failed to create page", "error");
      return;
    }
    pages.value = [
      ...pages.value,
      {
        ...body,
        lastUpdatedAt: new Date(body.lastUpdatedAt).getTime(),
      },
    ];
    selectPage(body.id);
    snackbarStore.enqueue("Page created", "success");
  };

  const executePageUpdateDb = async () => {
    if (!pageUpdateToSave.value) {
      console.error("No page update to save");
      snackbarStore.enqueue("No page update to save", "error");
      return;
    }
    const { body } = await $fetch("/api/private/pages/:id", {
      params: {
        id: pageUpdateToSave.value.id,
      },
      method: "patch",
      body: {
        ...pageUpdateToSave.value,
      },
    });
    if (!body) {
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

  const executeBlockUpdateDb = async () => {
    const update = blockUpdateToSave.value;
    if (!update) {
      console.error("No page update to save");
      snackbarStore.enqueue("No page update to save", "error");
      return;
    }
    const { statusCode, body } = await $fetch("/api/private/blocks/:id", {
      params: {
        id: update.blockId,
      },
      method: "patch",
      body: {
        textContent: update.textContent,
      },
    });
    if (!body || statusCode !== 200) {
      console.error(
        "[pageState]: Error updating page block - ",
        blockUpdateToSave.value,
      );
      snackbarStore.enqueue("Error updating page block", "error");
      return;
    }
    if (currentPage.value && currentPage.value.id === update.pageId) {
      currentPage.value = {
        ...currentPage.value,
        blocks: currentPage.value.blocks.map((block) => {
          if (block.id === update.blockId) {
            return { ...block, textContent: update.textContent };
          }
          return block;
        }),
      };
    }
    blockUpdateToSave.value = undefined;
    snackbarStore.enqueue("Successfully updated page block", "success");
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
    if (!pageData.value) {
      console.error("No current page to update");
      snackbarStore.enqueue("No current page to update", "error");
      return;
    }
    if (update.id !== currentPageId.value) {
      console.error("Unable to update page due to mismatching ids");
      snackbarStore.enqueue("Unable to update page", "error");
    }
    if (update.title) {
      const newPath = pageData.value.path.map((p) => ({ ...p }));
      newPath[newPath.length - 1].title = update.title;
      pageUpdateToSave.value = {
        ...pageUpdateToSave.value,
        path: newPath,
        id: update.id,
        title: update.title,
      };
    }
    if (update.emoji) {
      const newPath = pageData.value.path.map((p) => ({ ...p }));
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

  const updateBlock = async (
    pageId: number,
    blockId: number,
    textContent: string,
    instantSave: boolean = false,
  ) => {
    if (!currentPage.value) {
      console.error("No current page to update");
      snackbarStore.enqueue("No current page to update", "error");
      return;
    }
    if (pageId !== currentPage.value.id) {
      console.error("Unable to update page due to mismatching ids");
      snackbarStore.enqueue("Unable to update page", "error");
    }
    blockUpdateToSave.value = {
      blockId,
      pageId,
      textContent,
    };
    lastUpdatedAt.value = Date.now();
    if (instantSave) {
      executeBlockUpdateDb();
      return;
    }
    setTimeout(() => {
      if (lastUpdatedAt.value + DEBOUNCE_TIME > Date.now()) return;
      executeBlockUpdateDb();
    }, DEBOUNCE_TIME);
  };

  const deletePage = async (pageId: number) => {
    const { statusCode, body } = await $fetch("/api/private/pages/:id", {
      params: {
        id: pageId,
      },
      method: "delete",
    });
    if (!body || statusCode !== 200) {
      snackbarStore.enqueue("Failed to delete page", "error");
      return;
    }
    pages.value = pages.value.filter((page) => page.id !== pageId);
    if (currentPage.value?.id === pageId) {
      currentPage.value = undefined;
    }
    snackbarStore.enqueue("Page deleted", "success");
  };

  const { data: pagesData, error: pagesGetError } = useFetch(
    "/api/private/users/pages",
    {
      method: "get",
      transform: (data) => {
        return data.body.map((p) => ({
          ...p,
          lastUpdatedAt: new Date(p.lastUpdatedAt).getTime(),
        }));
      },
    },
  );

  return {
    pages: computed(() =>
      pageUpdateToSave.value
        ? pagesData.value?.map((page) =>
            page.id === pageUpdateToSave.value?.id
              ? { ...page, ...pageUpdateToSave.value }
              : page,
          )
        : pagesData.value,
    ),
    currentPage: computed(() => {
      return pageData.value
        ? {
            ...pageData.value,
            ...pageUpdateToSave.value,
            blocks: pageData.value.blocks.map((block) => {
              return blockUpdateToSave.value &&
                block.id === blockUpdateToSave.value.blockId
                ? { ...block, textContent: blockUpdateToSave.value.textContent }
                : block;
            }),
          }
        : undefined;
    }),
    selectPage,
    createPage,
    updatePage,
    isSaved: computed(() => {
      return !pageUpdateToSave.value;
    }),
    deletePage,
    updateBlock,
  };
}
