<script setup lang="ts">
const content = ref({
  title: "Hello World",
  content: "This is a test",
});
</script>

<template>
  <div>
    {{ content.title }}
  </div>
</template>
