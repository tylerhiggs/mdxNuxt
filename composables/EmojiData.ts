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
  const index = useState<{ [word: string]: EmojiData[] }>(
    "emojiDataIndex",
    () => ({}),
  );
  const indexKeys = computed(() => Object.keys(index.value));

  const searchEmoji = async (query: string) => {
    const words = query.toLowerCase().split(" ");
    const matchingKeys = indexKeys.value.filter((key) =>
      words.some((word) => key.toLowerCase().includes(word)),
    );
    const matchingEmoji = matchingKeys.reduce((accumulator, currentValue) => {
      accumulator.push(...index.value[currentValue]);
      return accumulator;
    }, [] as EmojiData[]);
    const used = new Set<string>();
    return matchingEmoji.filter((emoji) => {
      if (used.has(emoji.char)) return false;
      used.add(emoji.char);
      return true;
    });
  };

  const getEmojiData = async () => {
    console.log("Getting emoji data");
    const usedNames = new Set<string>();
    try {
      const response = await fetch(URL);
      const data = (await response.json()) as Array<EmojiData>;
      console.log("Got emoji data");
      console.log(data);
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
      console.log(emojiData.value);

      index.value = data.reduce(
        (accumulator, currentValue) => {
          const words = [
            ...currentValue.name.split(" "),
            ...currentValue.group.split(" "),
            ...currentValue.subgroup.split("-"),
          ];
          words
            .filter((word) => word.length > 2)
            .forEach((word) => {
              if (!accumulator[word]) {
                accumulator[word] = [currentValue];
              }
              accumulator[word].push(currentValue);
            });
          return accumulator;
        },
        {} as { [word: string]: EmojiData[] },
      );
    } catch (error) {
      snackbarStore.enqueue("Failed to get emoji data", "error");
      console.error("Error getting emoji data:", error);
    }
    loading.value = false;
  };

  return { emojiData, emojiDataLoading: loading, searchEmoji, getEmojiData };
};
