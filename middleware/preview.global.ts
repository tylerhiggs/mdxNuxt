export default defineNuxtRouteMiddleware((to) => {
  const preview = usePreview();
  if (to.path.startsWith("/edit")) {
    preview.preview.value = true;
    return;
  }
  preview.preview.value = false;
});
