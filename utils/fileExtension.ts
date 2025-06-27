export const fileExtension = (name: string | undefined) => {
  const ext = name ? name.split(".").pop() : "";
  if (!ext) return "text";
  if (name === "nuxt.config.ts" || name === "nuxt.config.js") return "nuxt";
  if (name === "tsconfig.json") return "tsconfig";
  if (name === "package.json") return "node";
  if (ext === "ts" || ext === "type-ts") return "typescript";
  if (ext === "js") return "javascript";
  if (ext === "py") return "python";
  if (ext === "md") return "markdown";
  return ext;
};
