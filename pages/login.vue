<script setup lang="ts">
const { loggedIn, user, refreshSession, login, dbUser } = useAuth();
const credentials = reactive({
  email: "",
  password: "",
});
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center bg-slate-200">
    <div
      class="flex w-4/12 flex-col items-center rounded-lg bg-slate-50 pb-8 pt-4 shadow-lg"
    >
      <div class="mb-8 flex flex-col items-center justify-center gap-3">
        <h1 class="text-4xl font-bold text-slate-900">
          Sign In {{ dbUser?.name || ": nothing" }}
        </h1>
        <p class="flex items-center gap-2 text-sm text-slate-600">
          Don't have an account?
          <NuxtLink to="/signup" class="text-blue-500 hover:underline"
            >Sign up</NuxtLink
          >
        </p>
      </div>
      <form
        class="flex w-10/12 flex-col items-center justify-center"
        @submit.prevent="() => login(credentials)"
        v-if="!loggedIn"
      >
        <div class="mb-4 w-full">
          <label
            for="email"
            class="mb-2 block text-sm font-medium text-slate-900"
            >Email</label
          >
          <input
            v-model="credentials.email"
            type="email"
            id="email"
            name="email"
            class="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
            placeholder="email"
            required
            autocomplete="email"
            autofocus
            :disabled="loggedIn"
          />
        </div>
        <div class="mb-4 w-full">
          <label
            for="password"
            class="mb-2 block text-sm font-medium text-slate-900"
            >Password</label
          >
          <input
            v-model="credentials.password"
            type="password"
            id="password"
            name="password"
            class="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
            placeholder="••••••••"
            required
            autocomplete="current-password"
            :disabled="loggedIn"
          />
        </div>
        <button
          type="submit"
          class="mb-4 w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-400"
          :disabled="loggedIn"
        >
          Sign in
          <span v-if="loggedIn" class="text-slate-200">Logged in</span>
        </button>
      </form>
      <div v-else>
        <p class="mb-4 text-lg font-semibold text-slate-900">
          Welcome back, {{ user?.name || user?.email }}!
        </p>
        <button
          @click="refreshSession"
          class="mb-4 w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Refresh Session
        </button>
      </div>
    </div>
  </div>
</template>
