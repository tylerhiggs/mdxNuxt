# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

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
