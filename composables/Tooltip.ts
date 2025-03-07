type TooltipPosition = "top" | "right" | "bottom" | "left";

export const useTooltip = () => {
  const title = useState<string | null>("tooltipTitle", () => null);
  const x = useState<number | null>("tooltipX", () => null);
  const y = useState<number | null>("tooltipY", () => null);
  const position = useState<TooltipPosition>("tooltipPosition", () => "top");
  const message = useState<string | null>("tooltipMessage", () => null);

  const show = (
    t: string,
    px: number,
    py: number,
    pos: TooltipPosition,
    command: string | null = null,
  ) => {
    title.value = t;
    x.value = px;
    y.value = py;
    position.value = pos;
    message.value = command;
  };

  const hide = () => {
    title.value = null;
    x.value = null;
    y.value = null;
    message.value = null;
  };

  return {
    title: computed(() => title.value),
    x: computed(() => x.value),
    y: computed(() => y.value),
    position: computed(() => position.value),
    message: computed(() => message.value),
    show,
    hide,
  };
};
