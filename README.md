# [MeDotDev](https://md-me-dot-dev.nuxt.dev/)

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# bun
bun install
```

## Development Server

Start the development server on `https://localhost:3000`:

```bash
# bun
bun run dev
```

## Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# bun
bun run preview
```

## Tailwind CSS

This project uses [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework.

### Tailwind CSS IntelliSense

[VSCode](https://code.visualstudio.com/) + [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) is the official VSCode extension that provides instant Tailwind CSS IntelliSense.

## Nuxt UI Components

This project uses [Nuxt UI](https://ui.nuxt.com/) for a set of components that are designed to work seamlessly with Nuxt.

Example:

```vue
<template>
  <UButton @click="count++">Increase count</UButton>
</template>

<script setup lang="ts">
const count = ref(0);
</script>
```

## Heroicons

This project uses [Heroicons](https://heroicons.com/) for a set of free, MIT-licensed high-quality SVG icons.

Example:

```vue
<template>
  <div>
    <UIcon name="i-heroicons-magnifying-glass" class="size-4 text-gray-500" />
  </div>
</template>
```

## Deployed on NuxtHub

This project is deployed on [NuxtHub](https://nuxt.dev/hub) and can be found at [md-me-dot-dev](https://md-me-dot-dev.nuxt.dev/).

### Nuxthub SQL Database

This project uses the Nuxthub SQL Database for data storage and retrieval.

To create a new database migration file, run:

```bash
# bun
bun run db:generate
```
