<script setup lang="ts"></script>

<template>
  <div class="flex h-screen w-full items-center justify-center bg-slate-200">
    <div
      class="flex w-4/12 flex-col items-center rounded-lg bg-slate-50 pb-8 pt-4 shadow-lg"
    >
      <div class="mb-8 flex flex-col items-center justify-center gap-3">
        <h1 class="text-4xl font-bold text-slate-900">Sign Up</h1>
        <p class="flex items-center gap-2 text-sm text-slate-600">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-500 hover:underline"
            >Login</NuxtLink
          >
        </p>
      </div>
      <GoogleButton type="signup" />
    </div>
  </div>
</template>
