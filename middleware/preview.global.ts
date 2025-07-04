export default defineNuxtRouteMiddleware((to, from) => {
  const preview = usePreview();
  if (to.path.startsWith("/edit")) {
    preview.preview.value = true;
    return;
  }
  preview.preview.value = false;
});
