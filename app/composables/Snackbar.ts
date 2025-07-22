type SnackbarType = "success" | "error" | "info" | "warning";

export const useSnackbar = () => {
  const idCounter = useState<number>("snackbarIdCounter", () => 1);
  const queue = useState<
    Array<{ id: number; type: SnackbarType; message: string }>
  >("snackbarQueue", () => []);

  const enqueue = (message: string, type: SnackbarType) => {
    const id = idCounter.value;
    queue.value.push({ id: idCounter.value++, type, message });
    setTimeout(() => dequeue(id), 5000);
  };

  const dequeue = (id: number) => {
    const index = queue.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      queue.value.splice(index, 1);
    }
  };

  return {
    queue: computed(() => queue.value),
    enqueue,
    dequeue,
  };
};
