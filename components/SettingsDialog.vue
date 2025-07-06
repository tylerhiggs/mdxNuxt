<script setup lang="ts">
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
  <UModal
    :open="props.open"
    class="bg-opacity-20 fixed inset-0 z-10 flex items-center justify-center overflow-y-auto bg-black"
    @close="() => emit('close')"
  >
    <template #content>
      <SettingsSidePanel
        :selected-index="selectedIndex"
        @select="selectIndex"
      />
      <UserAccount v-if="selectedIndex === 0" />
    </template>
  </UModal>
</template>
