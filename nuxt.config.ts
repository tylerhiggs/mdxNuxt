// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ["@nuxthub/core", "nuxt-auth-utils"],

  devServer: {
    https: {
      key: "dev-server.key",
      cert: "dev-server.crt",
    },
  },
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      password: process.env.SESSION_PASSWORD || "",
    },
  },
  hub: {
    blob: true,
    database: true,
    kv: true,
  },
});
