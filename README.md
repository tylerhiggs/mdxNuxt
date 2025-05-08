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

## Headless UI

This project uses [Headless UI](https://headlessui.dev/) for completely unstyled, fully accessible UI components.

Example:

```vue
<template>
  <Switch v-model="enabled" />
</template>

<script setup lang="ts">
import Switch from "@headlessui/vue";
import { ref } from "vue";

const enabled = ref(false);
</script>
```

## Heroicons

This project uses [Heroicons](https://heroicons.com/) for a set of free, MIT-licensed high-quality SVG icons.

Example:

```vue
<template>
  <div>
    <BeakerIcon class="h-6 w-6 text-blue-500" />
  </div>
</template>

<script setup>
import { BeakerIcon } from "@heroicons/vue/24/solid"; // or `/24/outline` or `/20/solid` or `/16/solid`
</script>
```

## Deployed on NuxtHub

This project is deployed on [NuxtHub](https://nuxt.dev/hub) and can be found at [md-me-dot-dev](https://md-me-dot-dev.nuxt.dev/).
