export const useSidebar = () => {
  const isOpen = useState("sidebar-is-open", () => true);
  return {
    isOpen,
  };
};
