<script setup lang="ts">
defineProps<{
  message: string;
  position: "top" | "bottom" | "left" | "right";
  command?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <div class="group/tooltip relative z-50">
    <slot></slot>
    <div
      v-if="!disabled"
      class="invisible absolute z-50 rounded-md bg-neutral-950 px-2 py-1 text-xs text-nowrap text-white group-hover/tooltip:visible"
      :class="position"
    >
      <p>{{ message }}</p>
      <p v-if="command">
        <UKbd v-for="key in command.split('+')" :key="key" :value="key" />
      </p>
    </div>
  </div>
</template>

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
