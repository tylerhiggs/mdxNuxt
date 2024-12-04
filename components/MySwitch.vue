<script setup lang="ts">
import { Switch } from "@headlessui/vue";

const props = defineProps<{
  value: boolean;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  input: [boolean];
}>();
</script>

<template>
  <Switch
    :enabled="props.value"
    @click="emits('input', !props.value)"
    :class="props.value ? 'bg-blue-600' : 'bg-gray-200'"
    class="relative inline-flex h-6 w-11 items-center rounded-full"
  >
    <span class="sr-only">Enable notifications</span>
    <span
      :class="props.value ? 'translate-x-6' : 'translate-x-1'"
      class="inline-block h-4 w-4 transform rounded-full bg-white transition"
    />
  </Switch>
</template>
