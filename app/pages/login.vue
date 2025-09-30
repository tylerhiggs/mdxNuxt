<template>
  <div class="flex h-screen w-full items-center justify-center bg-slate-200">
    <div
      class="flex w-full flex-col items-center rounded-lg bg-slate-50 pt-4 pb-8 shadow-lg md:w-4/12"
    >
      <div class="mb-8 flex flex-col items-center justify-center gap-3">
        <h1 class="text-4xl font-bold text-slate-900">Sign In</h1>
        <p class="flex items-center gap-2 text-sm text-slate-600">
          Don't have an account?
          <NuxtLink to="/signup" class="text-blue-500 hover:underline"
            >Sign up</NuxtLink
          >
        </p>
      </div>
      <GoogleButton type="login" />
    </div>
  </div>
</template>
