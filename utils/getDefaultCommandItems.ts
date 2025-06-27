import type { Command, CommandOptions } from "~/types/page";

export const getDefaultCommandItems = (
  command?: Command,
  commandOptions?: CommandOptions,
): [string, string | undefined, string] => {
  switch (command) {
    case "Accordion":
      return [
        `::accordion{type='multiple'}
::accordion-item{label='First Item' icon='question-mark-circle'}
`,
        "Add **markdown** content here",
        "\n::\n::",
      ];
    case "Badge":
      return [
        "::badge{color='secondary'}\n",
        "Label **here**",
        "\n::\nColor: `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`",
      ];
    case "Callout":
      return [
        "::callout{icon='play-circle' color='info' link='https://heroicons.com'}\n",
        "Click to see list of icons\nColor: `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`",
        "\n::",
      ];
    case "Note":
      return [
        "::note\n",
        "Here's some **additional information** for you.",
        "\n::",
      ];
    case "Tip":
      return ["::tip\n", "Here's a **helpful suggestion** for you.", "\n::"];
    case "Warning":
      return [
        "::warning\n",
        "Be **careful** with this action as it might have unexpected results.",
        "\n::",
      ];
    case "Caution":
      return ["::caution\n", "This action **cannot** be undone.", "\n::"];
    case "Card":
      return [
        '::card{title="Icons" icon="users" color="secondary" link="https://heroicons.com"}\n',
        "Click here to see __icons__.\nColors: `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`",
        "\n::",
      ];
    case "Card Group":
      return [
        '::card-group\n::card{title="Icons" icon="users" color="secondary" link="https://heroicons.com"}\n',
        "Click here to see __icons__.\nColors: `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`",
        "\n::\n::",
      ];
    case "Code Collapse":
      return [
        "::code-collapse\n",
        "```ts [isFalse.ts]\nconst isFalse = (b: boolean) => !b;",
        "\n```\n::",
      ];
    case "Code Group":
      return [
        `::code-group{ defaultValue=2 }

\`\`\`bash [pnpm]
pnpm add @nuxt/ui-pro
\`\`\`

\`\`\`bash [yarn]
yarn add @nuxt/ui-pro
\`\`\`

\`\`\`bash [npm]
npm install @nuxt/ui-pro
\`\`\`
`,
        `\`\`\`bash [bun]
bun add @nuxt/ui-pro
\`\`\``,
        "\n::",
      ];
    case "Code Tree":
      return [
        `::code-tree{defaultValue="app/app.config.ts", expandAll}
    
    \`\`\`ts [nuxt.config.ts]
    export default defineNuxtConfig({
      modules: ['@nuxt/ui-pro'],
    
      future: {
        compatibilityVersion: 4
      },
    
      css: ['~/assets/css/main.css']
    })
    
    \`\`\`
    
    \`\`\`css [app/assets/css/main.css]
    @import "tailwindcss";
    @import "@nuxt/ui-pro";
    \`\`\`
    
    \`\`\`ts [app/app.config.ts]
    export default defineAppConfig({
      ui: {
        colors: {
          primary: 'sky',
          colors: 'slate'
        }
      }
    })
    \`\`\`
    
    \`\`\`vue [app/app.vue]
    <template>
      <UApp>
        <NuxtPage />
      </UApp>
    </template>
    \`\`\`
    
    \`\`\`json [package.json]
    {
      "name": "nuxt-app",
      "private": true,
      "type": "module",
      "scripts": {
        "build": "nuxt build",
        "dev": "nuxt dev",
        "generate": "nuxt generate",
        "preview": "nuxt preview",
        "postinstall": "nuxt prepare",
        "typecheck": "nuxt typecheck"
      },
      "dependencies": {
        "@iconify-json/lucide": "^1.2.18",
        "@nuxt/ui-pro": "^3.0.0",
        "nuxt": "^3.16.0"
      },
      "devDependencies": {
        "typescript": "^5.8.2",
        "vue-tsc": "^2.2.10"
      }
    }
    \`\`\`
    
    \`\`\`json [tsconfig.json]
    {
      "extends": "./.nuxt/tsconfig.json"
    }
    \`\`\`
    
    \`\`\`\`md [README.md]
    # Nuxt 3 Minimal Starter
    
    Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
    
    ## Setup
    
    Make sure to install the dependencies:
    
    \`\`\`bash
    # npm
    npm install
    
    # pnpm
    pnpm install
    
    # yarn
    yarn install
    
    # bun
    bun install
    \`\`\`
    
    ## Development Server
    
    Start the development server on \`http://localhost:3000\`:
    
    \`\`\`bash
    # npm
    npm run dev
    
    # pnpm
    pnpm run dev
    
    # yarn
    yarn dev
    
    # bun
    bun run dev
    \`\`\`
    
    ## Production
    
    Build the application for production:
    
    \`\`\`bash
    # npm
    npm run build
    
    # pnpm
    pnpm run build
    
    # yarn
    yarn build
    
    # bun
    bun run build
    \`\`\`
    
    Locally preview production build:
    
    \`\`\`bash
    # npm
    npm run preview
    
    # pnpm
    pnpm run preview
    
    # yarn
    yarn preview
    
    # bun
    bun run preview
    \`\`\`
    
    Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
    \`\`\`\`
    
    ::
    `,
        "",
        "",
      ];
    case "Collapsible":
      return [
        '::collapsible{openText="Close", closeText="Show hidden content"}\n',
        "This is a **collapsible** section that can be expanded or collapsed.",
        "\n::",
      ];
    case "Field":
      return [
        '::field{name="name" type="string" required}\n',
        "The `description` can be set here with full **markdown** support.",
        "\n::",
      ];
    case "Field Group":
      return [
        `::field-group
  ::field{name="analytics" type="boolean"}
    Default to \`false\` - Enables analytics for your project (coming soon).
  ::

  ::field{name="blob" type="boolean"}
    Default to \`false\` - Enables blob storage to store static assets, such as images, videos and more.
  ::

  ::field{name="cache" type="boolean"}
    Default to \`false\` - Enables cache storage to cache your server route responses or functions using Nitro's \`cachedEventHandler\` and \`cachedFunction\`
  ::

  ::field{name="database" type="boolean"}
    Default to \`false\` - Enables SQL database to store your application's data.
  ::
::
`,
        "",
        "",
      ];
    case "Tabs":
      return [
        `::tabs

::tabs-item{label="Code" icon="code-bracket"}

\`\`\`mdc
::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::
\`\`\`

::

::tabs-item{label="Preview" icon="eye"}

::callout
Lorem velit voluptate ex reprehenderit ullamco et culpa.
::

::

::
`,
        "",
        "",
      ];
    case "Steps":
      return [
        `::steps{level="3"}

### Add the Nuxt UI Pro module in your \`nuxt.config.ts\`{lang="ts-type"}

\`\`\`ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@nuxt/ui-pro']
})
\`\`\`

### Import Tailwind CSS and Nuxt UI Pro in your CSS

\`\`\`css [assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui-pro";
\`\`\`

::
`,
        "",
        "",
      ];
    case "Key Binding":
      return [':kbd{name="', commandOptions?.name || "add key here", '"}'];
    case "Icon":
      return [':icon{name="', commandOptions?.name, '"}'];
    case "Bold":
      return ["**", "bold", "**"];
    case "Italic":
      return ["__", "italic", "__"];
    case "Link":
      return ["[link text](", "url", ")"];
    case "Inline Code":
      return ["`", "inline code", "`"];
    case "Code Block":
      return [
        "```ts [isFalse.ts]\n",
        "const isFalse = (b: boolean) => !b",
        "\n```",
      ];
    case "Blockquote":
      return ["> ", "", ""];
    case "Inline Code - Syntax Highlighted":
      return ["`", "inline code", "`{lang='ts'}"];
    case "Inline Code - Success":
      return ["`", "inline code", "`{color='success'}"];
    case "Inline Code - Warning":
      return ["`", "inline code", "`{color='warning'}"];
    case "Inline Code - Error":
      return ["`", "inline code", "`{color='error'}"];
    case "Inline Code - Info":
      return ["`", "inline code", "`{color='info'}"];
    case "Ordered List":
      return ["\n1. ", "List item", ""];
    case "Unordered List":
      return ["\n- ", "List item", ""];
    default:
      return ["/", "", ""];
  }
};
