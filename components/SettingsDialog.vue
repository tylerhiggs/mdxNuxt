<script setup lang="ts">
const { signOut, dbUser, updateName, refetchAvatar } = useAuth();
const open = defineModel<boolean>("open", { required: true, default: false });

const name = ref(dbUser.value?.name || "");
const savingName = ref(false);
const snackbarStore = useSnackbar();
const onAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    await $fetch("/api/private/avatars", {
      method: "post",
      body: formData,
    });
    snackbarStore.enqueue("Avatar updated successfully", "success");
    refetchAvatar();
  } catch (error) {
    console.error("Failed to update avatar:", error);
    snackbarStore.enqueue("Failed to update avatar", "error");
  }
};
</script>

<template>
  <UModal v-model:open="open" title="Settings">
    <template #body>
      <div class="flex items-center gap-3">
        <UTooltip text="Click to change your avatar">
          <label class="group cursor-pointer">
            <UAvatar
              :src="`/api/private/avatars/${dbUser?.avatar}`"
              :alt="dbUser?.name || 'User Avatar'"
              class="size-16 transition duration-200 group-focus-within:brightness-75 group-hover:brightness-75"
            />
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="onAvatarChange"
            />
          </label>
        </UTooltip>
        <UFormField
          label="Name"
          help="Your name appears on pages you will, or have already published."
          name="name"
        >
          <UInput
            v-model="name"
            color="neutral"
            placeholder="Enter your name"
            @keydown.enter="() => updateName(name)"
          >
            <template #trailing>
              <UTooltip
                :text="
                  name === dbUser?.name
                    ? 'No changes made'
                    : 'Save updated name'
                "
                position="top"
              >
                <UButton
                  :icon="
                    name === dbUser?.name
                      ? 'i-heroicons-check'
                      : 'i-heroicons-arrow-up-tray'
                  "
                  :loading="savingName"
                  type="button"
                  :color="name === dbUser?.name ? 'success' : 'neutral'"
                  :disabled="name === dbUser?.name || savingName"
                  variant="link"
                  @click="() => updateName(name)"
                />
              </UTooltip>
            </template>
          </UInput>
        </UFormField>
      </div>
    </template>
    <template #footer>
      <UButton
        color="error"
        icon="i-heroicons-arrow-left-start-on-rectangle"
        @click="
          () => {
            signOut;
          }
        "
      >
        Sign out
      </UButton>
    </template>
  </UModal>
</template>
