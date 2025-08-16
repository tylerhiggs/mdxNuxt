export default defineEventHandler(async () => {
  const homePageMd = await import("~~/server/assets/home.md");
  return homePageMd.default;
});
