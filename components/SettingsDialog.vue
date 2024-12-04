<script setup lang="ts">
import { Dialog, DialogPanel } from "@headlessui/vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const selectedIndex = ref(0);
const selectIndex = (index: number) => (selectedIndex.value = index);
</script>

<template>
  <Dialog
    as="div"
    :open="props.open"
    @close="() => emit('close')"
    class="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black bg-opacity-20"
  >
    <DialogPanel class="relative h-4/6 w-8/12 rounded-xl bg-white">
      <SettingsSidePanel :selectedIndex="selectedIndex" @select="selectIndex" />
      <UserAccount v-if="selectedIndex === 0" />
    </DialogPanel>
  </Dialog>
</template>
