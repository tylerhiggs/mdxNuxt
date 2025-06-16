<script setup lang="ts">
import { ref, computed } from "vue";

const MARGIN_PX = 2;

const tooltipStore = useTooltip();
const tooltipRef = ref<HTMLElement | null>(null);

const xCoord = computed(() => `${adjustedX.value}px`);
const yCoord = computed(() => `${tooltipStore.y.value}px`);

const adjustedX = computed(() => {
  const tooltip = tooltipRef.value;
  if (!tooltip) return { x: 0, y: 0 };

  const rect = tooltip.getBoundingClientRect();
  const { innerWidth } = window;

  const newX = tooltipStore.x.value;

  if (!newX) return 0;

  if (newX + rect.right > innerWidth) {
    return innerWidth - rect.right - MARGIN_PX;
  }
  if (newX + rect.left < 0) {
    return MARGIN_PX - rect.left;
  }

  return tooltipStore.x.value;
});
</script>

<style scoped>
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
    ref="tooltipRef"
    class="absolute z-50 rounded-md bg-black px-2 py-1 text-xs text-nowrap text-white"
    :class="[tooltipStore.position.value]"
    v-if="tooltipStore.x.value"
  >
    <p>{{ tooltipStore.title.value }}</p>
    <p v-if="tooltipStore.message.value" class="font-mono text-gray-400">
      {{ tooltipStore.message.value }}
    </p>
  </div>
</template>
