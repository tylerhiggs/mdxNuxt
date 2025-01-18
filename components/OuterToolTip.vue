<script setup lang="ts">
import { useTooltip } from "~/composables/Tooltip";

const tooltipStore = useTooltip();

const xCoord = computed(() => `${tooltipStore.x.value}px`);
const yCoord = computed(() => `${tooltipStore.y.value}px`);
</script>

<style scoped>
.z-1000 {
  z-index: 1000;
}

.top {
  left: v-bind(xCoord);
  top: v-bind(yCoord);
  transform: translateX(-50%) translateY(-1.5rem);
}

.bottom {
  left: v-bind(xCoord);
  top: v-bind(yCoord);
  transform: translateX(-50%) translateY(0.2rem);
}

.left {
  left: v-bind(xCoord);
  top: v-bind(yCoord);
  transform: translateY(-50%) translateX(-0.2rem);
}

.right {
  left: v-bind(xCoord);
  top: v-bind(yCoord);
  transform: translateY(-50%) translateX(0.2rem);
}
</style>

<template>
  <div
    class="absolute z-50 text-nowrap rounded-md bg-black px-2 py-1 text-xs text-white"
    :class="[tooltipStore.position.value]"
    v-if="tooltipStore.x.value"
  >
    {{ tooltipStore.title.value }}
  </div>
</template>
