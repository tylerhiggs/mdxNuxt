import type { Firestore } from "firebase/firestore";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import type { Page, PageUpdate, PageItem, Block } from "../types/page";

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

//https://firebase.google.com/docs/firestore/manage-data/add-data
export function useFirebase(db: Firestore) {
  const { user } = useAuth(db);

  /**
   *
   * @returns all pages for users omitting their content
   */
  const getPages = async () => {
    const ret = Array<PageItem>();
    if (!user.value) {
      console.error("User not signed in");
      return ret;
    }
    try {
      const q = query(
        collection(db, "users", user.value.id, "pages"),
        where("deletedAt", "==", false),
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ret.push({
          id: doc.id,
          title: data.title,
          emoji: data.emoji,
          isPublic: data.isPublic,
          isFavorite: data.isFavorite,
          lastUpdatedAt: data.lastUpdatedAt,
          lastUpdatedByName: data.lastUpdatedByName,
        });
      });
      return ret;
    } catch (error) {
      console.error("Error getting pages:", error);
      return ret;
    }
  };

  /**
   *
   * @param pageId
   * @returns the Page object
   */
  const getPage = async (pageId: string) => {
    if (!user.value) {
      console.error("User not signed in");
      return;
    }
    try {
      const docRef = doc(db, "users", user.value.id, "pages", pageId);
      const docSnap = await getDoc(docRef);
      const querySnapshot = await getDocs(
        collection(db, "users", user.value.id, "pages", pageId, "blocks"),
      );
      if (docSnap.exists()) {
        const ret = docSnap.data() as Page;
        ret.blocks = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Block;
          ret.blocks.push(data);
        });
        return ret;
      }
      console.error("No such document");
    } catch (error) {
      console.error("Error getting page:", error);
    }
  };

  /**
   *
   * @param page
   * @returns `true` if the update was successful, `false` otherwise
   */
  const updatePage = async (update: PageUpdate) => {
    if (!user.value) {
      console.error("User not signed in");
      return false;
    }
    try {
      await updateDoc(doc(db, "users", user.value.id, "pages", update.id), {
        ...update,
        lastUpdatedAt: Date.now(),
        lastUpdatedByName: user.value.displayName || "Anonymous",
      });
      return true;
    } catch (e) {
      console.error("Error performing udpate: ", update);
      console.error("Error updating page:", e);
      return false;
    }
  };

  /**
   *
   * @param title
   * @returns the new Page object
   */
  const addPage = async (
    title: string = "",
    parentPath: {
      id: string;
      title: string;
      emoji: string;
    }[] = [],
  ) => {
    if (!user.value) {
      console.error("User not signed in");
      return;
    }
    const newId = Math.random().toString(36).substring(7);
    const newBlockId = uuid();
    const block: Block = {
      id: newBlockId,
      type: "text",
      index: 0,
      textContent: [
        {
          id: uuid(),
          types: [],
          content: "",
        },
      ],
    };
    const newPage: Page = {
      id: newId,
      title,
      emoji: "📄",
      blocks: [block],
      path: [
        ...parentPath,
        {
          id: newId,
          title,
          emoji: "📄",
        },
      ],
      lastUpdatedAt: Date.now(),
      lastUpdatedByName: user.value.displayName || "Anonymous",
      createdAt: Date.now(),
      createdByName: user.value.displayName || "Anonymous",
      isPublic: false,
      isFavorite: false,
      deletedAt: false,
    };
    const { blocks: _, ...rest } = newPage;
    try {
      await setDoc(doc(db, "users", user.value.id, "pages", newId), {
        ...rest,
      });
      await setDoc(
        doc(db, "users", user.value.id, "pages", newId, "blocks", newBlockId),
        {
          ...block,
        },
      );
      return newPage;
    } catch (error) {
      console.error("Error adding page:", error);
    }
  };

  /**
   * TODO: Delete all files also
   * @param pageId
   * @returns `true` if the deletion was successful, `false` otherwise
   */
  const deletePage = async (pageId: string) => {
    if (!user.value) {
      console.error("User not signed in");
      return false;
    }
    try {
      await updateDoc(doc(db, "users", user.value.id, "pages", pageId), {
        deletedAt: Date.now(),
      });
      return true;
    } catch (error) {
      console.error("Error deleting page:", error);
      return false;
    }
  };

  return {
    addPage,
    getPages,
    getPage,
    updatePage,
    deletePage,
  };
}
