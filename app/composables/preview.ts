export const usePreview = () => {
  const preview = useState("preview", () => false);
  return {
    preview,
  };
};
