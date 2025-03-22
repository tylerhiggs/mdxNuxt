<script setup lang="ts">
import { ref, computed } from "vue";

const auth = useAuth();

const userFirstLetter = computed(() => {
  return (
    auth.user.value?.name?.charAt(0).toUpperCase() ||
    auth.user.value?.email?.charAt(0).toUpperCase() ||
    "U"
  );
});

const imageInputElement = ref<HTMLInputElement | null>(null);

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    //authStore.uploadPhoto(file)
  }
};
</script>

<template>
  <div
    class="bg-white-400 absolute inset-0 left-64 overflow-y-auto rounded-r-xl px-16 py-8"
  >
    <h1 class="text-lg font-semibold text-gray-700">My Profile</h1>
    <hr class="my-3 border-t border-gray-200" />
    <div class="flex">
      <div class="flex flex-col items-center">
        <button
          class="flex size-16 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-center text-2xl text-gray-500 hover:bg-gray-200"
          @click="imageInputElement?.click()"
        >
          <input
            type="file"
            name="userImage"
            id="userImage"
            accept="image/*"
            ref="imageInputElement"
            @change="handleImageChange"
            class="hidden"
          />
          {{ userFirstLetter }}
        </button>
        <label
          for="userImage"
          v-if="!auth.dbUser.value?.avatar"
          class="mt-1 text-sm text-gray-400"
          >Add photo</label
        >
      </div>
      <div class="ml-4 flex flex-col">
        <label for="name" class="mb-1 text-xs font-light text-gray-400"
          >Preferred name</label
        >
        <input
          id="name"
          name="name"
          class="w-64 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700"
          :value="auth.user.value?.name"
        />
      </div>
    </div>
    <h1 class="mt-16 text-lg font-semibold text-gray-700">Account security</h1>
    <hr class="my-3 border-t border-gray-200" />
    <div class="flex flex-col">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <p class="text-sm font-normal text-gray-700">Email</p>
          <p class="text-xs font-light text-gray-500">
            {{ auth.user.value?.email }}
          </p>
        </div>
        <button
          class="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-800 hover:bg-gray-200"
        >
          Change email
        </button>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <p class="text-sm font-normal text-gray-700">Password</p>
          <p class="text-xs font-light text-gray-500">
            Set a permanent password to login to your account.
          </p>
        </div>
        <MySwitch :value="false" disabled />
      </div>
    </div>
  </div>
</template>
