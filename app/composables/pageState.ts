import type { PageUpdate, BlockUpdate } from "~~/types/page";

const DEBOUNCE_TIME = 5000;

export function usePageState() {
  const snackbarStore = useSnackbar();

  // private state
  const lastPageUpdateAt = useState("lastUpdatedAt", () => Date.now());
  const lastBlockUpdateAt = useState("lastBlockUpdatedAt", () => Date.now());

  const currentPageId = useState<number | undefined>(
    "currentPageId",
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

  const {
    data: pageData,
    error: pageGetError,
    status: pageStatus,
  } = useFetch(() => `/api/private/pages/${currentPageId.value}`, {
    watch: [() => currentPageId.value],
    method: "get",
    transform: (data) => ({
      ...data.body,
      path: JSON.parse(data.body.path || "") as {
        id: number;
        title: string;
        emoji: string;
      }[],
    }),
  });

  const selectPage = async (pageId: number) => {
    if (pageUpdateToSave.value || blockUpdateToSave.value) {
      lastPageUpdateAt.value = Date.now();
      lastBlockUpdateAt.value = Date.now();
      executePageUpdateDb(false);
      executeBlockUpdateDb(false);
    }
    blockUpdateToSave.value = undefined;
    pageUpdateToSave.value = undefined;
    currentPageId.value = pageId;

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
    if (pagesData.value) {
      pagesData.value = [
        ...pagesData.value,
        {
          ...body,
          lastUpdatedAt: new Date(body.lastUpdatedAt).getTime(),
        },
      ];
    }
    selectPage(body.id);
    snackbarStore.enqueue("Page created", "success");
  };

  const executePageUpdateDb = async (updateLocalState = true) => {
    if (!pageUpdateToSave.value) {
      console.error("No page update to save");
      snackbarStore.enqueue("No page update to save", "error");
      return;
    }
    const { body } = await $fetch(
      `/api/private/pages/${pageUpdateToSave.value.id}`,
      {
        method: "patch",
        body: {
          ...pageUpdateToSave.value,
        },
      },
    );
    if (!body) {
      console.error(
        "[pageState]: Error updating page - ",
        pageUpdateToSave.value,
      );
      snackbarStore.enqueue("Error updating page", "error");
      return;
    }
    if (!updateLocalState) {
      pageUpdateToSave.value = undefined;
      return;
    }
    if (pagesData.value && pageUpdateToSave.value?.id === currentPageId.value) {
      pagesData.value = pageUpdateToSave.value
        ? pagesData.value?.map((page) =>
            page.id === pageUpdateToSave.value?.id
              ? {
                  ...page,
                  ...pageUpdateToSave.value,
                  createdAt: body.createdAt,
                  path: page.path,
                }
              : page,
          )
        : pagesData.value;
    }
    if (pageData.value && pageUpdateToSave.value?.id === currentPageId.value) {
      pageData.value = {
        ...pageData.value,
        ...pageUpdateToSave.value,
        blocks: pageData.value.blocks.map((block) => {
          return blockUpdateToSave.value &&
            block.id === blockUpdateToSave.value.blockId
            ? { ...block, textContent: blockUpdateToSave.value.textContent }
            : block;
        }),
      };
    }
    pageUpdateToSave.value = undefined;
  };

  const executeBlockUpdateDb = async (updateLocalState = true) => {
    const update = blockUpdateToSave.value;
    if (!update) {
      console.error("No page update to save");
      snackbarStore.enqueue("No page update to save", "error");
      return;
    }
    const { statusCode, body } = await $fetch(
      `/api/private/blocks/${update.blockId}`,
      {
        method: "patch",
        body: {
          textContent: update.textContent,
          renderedMd: await parseMd(update.textContent),
        },
      },
    );
    if (!body || statusCode !== 200) {
      console.error(
        "[pageState]: Error updating page block - ",
        blockUpdateToSave.value,
      );
      snackbarStore.enqueue("Error updating page block", "error");
      return;
    }
    if (!updateLocalState) {
      blockUpdateToSave.value = undefined;
      return;
    }
    if (pageData.value && pageUpdateToSave.value?.id === currentPageId.value) {
      pageData.value = {
        ...pageData.value,
        ...pageUpdateToSave.value,
        blocks: pageData.value.blocks.map((block) => {
          return blockUpdateToSave.value &&
            block.id === blockUpdateToSave.value.blockId
            ? { ...block, textContent: blockUpdateToSave.value.textContent }
            : block;
        }),
      };
    }

    blockUpdateToSave.value = undefined;
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
      return;
    }
    if (update.id !== currentPageId.value) {
      console.error(
        "Unable to update page due to mismatching ids",
        `udpate.id: ${update.id}, currentPageId: ${currentPageId.value}`,
      );
      snackbarStore.enqueue("Unable to update page", "error");
      return;
    }
    if (update.title) {
      const newPath = pageData.value.path.map((p) => ({ ...p }));
      const lastItem = newPath.at(-1);
      if (!lastItem) {
        console.error("No last item in path to update title");
        return;
      }
      lastItem.title = update.title;
      pageUpdateToSave.value = {
        ...pageUpdateToSave.value,
        path: newPath,
        id: update.id,
        title: update.title,
      };
    }
    if (update.emoji) {
      const newPath = pageData.value.path.map((p) => ({ ...p }));
      const lastItem = newPath.at(-1);
      if (!lastItem) {
        console.error("No last item in path to update emoji");
        return;
      }
      lastItem.emoji = update.emoji;
      pageUpdateToSave.value = {
        ...pageUpdateToSave.value,
        path: newPath,
        id: update.id,
        emoji: update.emoji,
      };
    }
    pageUpdateToSave.value = { ...pageUpdateToSave.value, ...update };
    lastPageUpdateAt.value = Date.now();
    if (instantSave) {
      executePageUpdateDb();
      return;
    }
    setTimeout(() => {
      if (
        !pageUpdateToSave.value ||
        pageUpdateToSave.value.id !== currentPageId.value ||
        lastPageUpdateAt.value + DEBOUNCE_TIME > Date.now()
      )
        return;
      executePageUpdateDb();
    }, DEBOUNCE_TIME);
  };

  const duplicatePage = async (pageId: number) => {
    const { body } = await $fetch(`/api/private/pages/duplicate/${pageId}`, {
      method: "post",
    });
    if (!body) {
      snackbarStore.enqueue("Failed to duplicate page", "error");
      return;
    }
    if (pagesData.value) {
      pagesData.value = [
        ...pagesData.value,
        {
          ...body,
          lastUpdatedAt: new Date(body.lastUpdatedAt).getTime(),
        },
      ];
    }
    snackbarStore.enqueue("Page duplicated", "success");
    selectPage(body.id);
  };

  const updateBlock = async (
    pageId: number,
    blockId: number,
    textContent: string,
    instantSave: boolean = false,
  ) => {
    if (pageId !== currentPageId.value) {
      console.error(
        "Unable to update block due to mismatching ids",
        `pageId: ${pageId}, currentPageId: ${currentPageId.value}, pageUpdateToSave: ${pageUpdateToSave.value?.id}, pageData: ${pageData.value?.id}`,
      );
      snackbarStore.enqueue("Unable to update page", "error");
      return;
    }
    blockUpdateToSave.value = {
      blockId,
      pageId,
      textContent,
    };
    updatePage({ id: pageId, lastUpdatedAt: Date.now() });
    lastBlockUpdateAt.value = Date.now();
    if (instantSave) {
      executeBlockUpdateDb();
      return;
    }
    setTimeout(() => {
      if (
        !blockUpdateToSave.value ||
        blockUpdateToSave.value.blockId !== blockId ||
        blockUpdateToSave.value.pageId !== currentPageId.value ||
        lastBlockUpdateAt.value + DEBOUNCE_TIME > Date.now()
      )
        return;
      executeBlockUpdateDb();
    }, DEBOUNCE_TIME);
  };

  const deletePage = async (pageId: number) => {
    const { statusCode, body } = await $fetch(`/api/private/pages/${pageId}`, {
      method: "delete",
    });
    if (!body || statusCode !== 200) {
      snackbarStore.enqueue("Failed to delete page", "error");
      return;
    }
    if (pagesData.value) {
      pagesData.value = pagesData.value.filter((p) => p.id !== pageId);
    }
    if (currentPageId.value === pageId)
      if (pagesData.value && pagesData.value.length)
        selectPage(pagesData.value.at(0)!.id);
    snackbarStore.enqueue("Page deleted", "success");
  };

  const { data: pagesData, error: _pagesGetError } = useFetch(
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

  const saveNow = async () => {
    if (pageUpdateToSave.value) {
      lastPageUpdateAt.value = Date.now();
      executePageUpdateDb();
    }
    if (blockUpdateToSave.value) {
      lastBlockUpdateAt.value = Date.now();
      executeBlockUpdateDb();
    }
  };

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
    isSaved: computed(
      () => !pageUpdateToSave.value && !blockUpdateToSave.value,
    ),
    deletePage,
    updateBlock,
    duplicatePage,
    pageStatus,
    saveNow,
    pageGetError,
  };
}
