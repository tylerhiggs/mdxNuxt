<script setup lang="ts">
defineProps<{
  accept: string;
}>();
const isOpen = defineModel<boolean>("open", {
  default: false,
});

const emits = defineEmits<{
  save: [File];
}>();

const file = ref<File | null>(null);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    file.value = droppedFiles[0];
  }
};

function closeModal() {
  isOpen.value = false;
  file.value = null;
  isDragging.value = false;
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <form
        class="rounded-lg bg-white p-6 shadow-md"
        @submit.prevent="() => file && emits('save', file)"
      >
        <label
          for="file-upload"
          class="hover:border-primary-400 hover:bg-primary-50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition"
          :class="{ 'border-primary-500 bg-primary-100': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <UIcon
            name="i-heroicons-cloud-arrow-up"
            class="mb-2 h-12 w-12 text-gray-400"
          />
          <span class="mb-2 text-gray-600">Drag & drop your file here</span>
          <span class="text-primary-600 underline"
            >or click to select a file</span
          >
          <input
            id="file-upload"
            ref="fileInput"
            type="file"
            class="hidden"
            :accept="accept"
            @input="
              (event) => {
                const input = event.target as HTMLInputElement;
                if (input.files && input.files.length > 0) {
                  file = input.files[0];
                }
              }
            "
          />
        </label>
        <div class="mt-6 flex justify-end gap-2">
          <UButton type="button" color="neutral" @click="closeModal"
            >Cancel</UButton
          >
          <UButton type="submit" color="primary" :disabled="!file"
            >Upload</UButton
          >
        </div>
      </form>
    </template>
  </UModal>
</template>
