export type Tone = "light" | "medium-light" | "medium" | "medium-dark" | "dark";

export type EmojiData = {
  name: string;
  char: string;
  category: string;
  group: string;
  subgroup: string;
  altColors?: {
    [color in Tone]: string | undefined;
  };
};
const URL = "https://unpkg.com/emoji.json/emoji.json";

export const useEmojiData = () => {
  const snackbarStore = useSnackbar();
  const emojiData = useState<{ [group: string]: EmojiData[] }>(
    "emojiData",
    () => ({}),
  );
  const loading = useState("loadingEmojiData", () => true);

  const searchEmoji = (query: string) => {
    if (!query) return Object.values(emojiData.value).flat();
    const words = query.toLowerCase().split(" ");
    return Object.values(emojiData.value)
      .flat()
      .filter((emoji) =>
        words.every(
          (word) =>
            emoji.name.toLowerCase().includes(word) ||
            emoji.group.toLowerCase().includes(word) ||
            emoji.subgroup.toLowerCase().includes(word),
        ),
      );
  };

  const getEmojiData = async () => {
    if (emojiData.value && emojiData.value.length) return;
    const usedNames = new Set<string>();
    try {
      const response = await fetch(URL);
      const data = (await response.json()) as Array<EmojiData>;
      emojiData.value = data.reduce(
        (accumulator, currentValue) => {
          if (!accumulator[currentValue.group]) {
            accumulator[currentValue.group] = [];
          }
          if (usedNames.has(currentValue.name)) return accumulator;
          if (currentValue.name.includes(":")) {
            const baseName = currentValue.name.split(": ")[0];
            const skinTone = currentValue.name.split(": ")[1].split(" ")[0];
            accumulator[currentValue.group] = accumulator[
              currentValue.group
            ].map((emoji) => {
              if (emoji.name === baseName) {
                emoji.altColors = {
                  ...(emoji.altColors || ({} as { [color in Tone]: string })),
                  [skinTone as Tone]: currentValue.char,
                };
              }
              return emoji;
            });
            usedNames.add(currentValue.name);
            return accumulator;
          }
          accumulator[currentValue.group].push(currentValue);
          usedNames.add(currentValue.name);
          return accumulator;
        },
        {} as { [group: string]: EmojiData[] },
      );
    } catch (error) {
      snackbarStore.enqueue("Failed to get emoji data", "error");
      console.error("Error getting emoji data:", error);
    }
    loading.value = false;
  };

  return { emojiData, emojiDataLoading: loading, searchEmoji, getEmojiData };
};
