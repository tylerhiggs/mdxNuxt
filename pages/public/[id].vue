<script setup lang="ts">
definePageMeta({
  layout: "default",
  validate({ params }) {
    return typeof params.id === "string";
  },
});
const route = useRoute();
watch(
  () => route.params.id,
  (paramId) => {
    console.log("paramId", paramId);
    const strParamId = paramId as string;
  },
);
</script>
