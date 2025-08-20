import { ref, computed } from "vue";

export function useUndoRedo(initialValue: string = "") {
  const history = ref<string[]>([initialValue]);
  const currentIndex = ref(0);

  const currentValue = computed(() => history.value[currentIndex.value]);

  const canUndo = computed(() => currentIndex.value > 0);
  const canRedo = computed(() => currentIndex.value < history.value.length - 1);

  const pushState = (value: string) => {
    // Remove any future history if we're not at the end
    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1);
    }

    // Don't add duplicate states
    if (history.value[currentIndex.value] !== value) {
      history.value.push(value);
      currentIndex.value = history.value.length - 1;
    }
  };

  const undo = () => {
    if (canUndo.value) {
      currentIndex.value--;
    }
    return currentValue.value;
  };

  const redo = () => {
    if (canRedo.value) {
      currentIndex.value++;
    }
    return currentValue.value;
  };

  const clear = () => {
    history.value = [initialValue];
    currentIndex.value = 0;
  };

  return {
    currentValue,
    canUndo,
    canRedo,
    pushState,
    undo,
    redo,
    clear,
  };
}
