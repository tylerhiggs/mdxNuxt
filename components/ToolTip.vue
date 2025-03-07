<script setup lang="ts">
defineProps<{
  message: string;
  position: "top" | "bottom" | "left" | "right";
  command?: string;
  disabled?: boolean;
}>();
</script>

<style scoped>
.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-0.2rem);
}
.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(0.2rem);
  max-width: calc(-24px + 100vw);
  white-space: nowrap;
  overflow: hidden;
}
.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-0.2rem);
}
.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(0.2rem);
}
</style>

<template>
  <div class="group/tooltip relative z-50">
    <slot></slot>
    <div
      class="invisible absolute z-50 text-nowrap rounded-md bg-black px-2 py-1 text-xs text-white group-hover/tooltip:visible dark:bg-stone-800"
      :class="position"
      v-if="!disabled"
    >
      <p>{{ message }}</p>
      <p v-if="command" class="font-mono text-gray-400">{{ command }}</p>
    </div>
  </div>
</template>
