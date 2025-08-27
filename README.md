# [Extended Markdown Editor](https://md-me-dot-dev.nuxt.dev/)

Watch the [YouTube video](https://www.youtube.com/watch?v=Dzvs-GNx-ww) for a walkthrough.

Browser based extended **markdown editor**, private pages protected behind **Google OAuth**, automatic saving to **SQL** database, real-time preview while editing, and published pages are server side rendered (**SSR**) for best performance and **SEO**.

Typical markdown syntax is extended with additional components such as **tabs**, **accordions**, **icons**, **keybindings**, **LaTeX** support for math, and much more. We also support image uploads which save to our blob store and markdown syntax is automatically generated which references these images.

The home page is server side generated (**SSG**) for improved performance and SEO. It is rendered at build time from [server/assets/home.txt](./server/assets/home.txt).

Rendering logic happens in [app/utils/parseMd.ts](./app/utils/parseMd.ts). Everything is tokenized into a structured format that can be easily rendered while also ensuring complete safety from **XSS** attacks, including syntax highlighting of code blocks and inline code. Additional sanitization happens to protect links.

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

## Testing

```bash
bun test
```

## ESLint

This project uses [ESLint](https://eslint.org/) for linting TypeScript and Vue (also TypeScript, HTML, and CSS) code.

```bash
bun run lint
```

or to fix auto-fixable linting issues:

```bash
bun run lint:fix
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
