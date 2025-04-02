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
      password:
        process.env.SESSION_PASSWORD || process.env.NUXT_SESSION_PASSWORD || "",
    },
    oauth: {
      google: {
        clientId:
          process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID ||
          process.env.OAUTH_GOOGLE_CLIENT_ID ||
          "",
        clientSecret:
          process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET ||
          process.env.OAUTH_GOOGLE_CLIENT_SECRET ||
          "",
        redirectURL: `${
          process.env.BASE_URL || "https://localhost:3000"
        }/auth/google`,
      },
    },
  },
  hub: {
    blob: true,
    database: true,
    kv: true,
  },
});
