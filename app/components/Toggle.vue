<script setup lang="ts">
defineProps<{
  checkboxId: string;
  modelValue?: boolean;
  hiddenLabel?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [boolean];
}>();

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
};
</script>

<template>
  <div class="relative">
    <input
      :id="checkboxId"
      :name="checkboxId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="sr-only"
    />
    <label
      :for="checkboxId"
      class="relative flex cursor-pointer"
      :class="{ 'cursor-not-allowed opacity-50': disabled }"
      @click="onChange"
    >
      <span v-if="hiddenLabel" class="sr-only">{{ hiddenLabel }}</span>
      <slot :checked="modelValue" :disabled="disabled"></slot>
    </label>
  </div>
</template>
