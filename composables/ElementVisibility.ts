export const useElementVisibilityState = () => {
  const visibleElementIds = useState<string[]>("visibleElementIds", () => []);
  const onElementVisibilityChange = (elementId: string, isVisible: boolean) => {
    if (isVisible) {
      visibleElementIds.value.push(elementId);
      return;
    }
    visibleElementIds.value = visibleElementIds.value.filter(
      (id) => id !== elementId,
    );
  };
  return {
    visibleElementIds: computed(() => visibleElementIds.value),
    onElementVisibilityChange,
  };
};
