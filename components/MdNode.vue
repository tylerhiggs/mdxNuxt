<script setup lang="ts">
import type {
  BadgeProps,
  CalloutProps,
  CardProps,
  CodeBlockNode,
  CollapsibleProps,
  FieldProps,
  IconProps,
  KbdProps,
  MdNode,
} from "~/shared/types";
defineProps<{
  node: MdNode;
}>();
const preview = usePreview();
const colorMode = useColorMode();
const snackbar = useSnackbar();
const copyCode = (code: CodeBlockNode) => {
  const text = code.syntaxHighlightedTokens
    ? code.syntaxHighlightedTokens
        .map((line) => line.map((token) => token.content).join(""))
        .join("\n")
    : "";
  navigator.clipboard
    .writeText(text)
    .then(() => {
      snackbar.enqueue("Code copied to clipboard", "success");
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 5000);
    })
    .catch(() => {
      snackbar.enqueue("Failed to copy code", "error");
    });
};
const copied = ref(false);
</script>

<template>
  <blockquote
    v-if="node.type === 'blockquote'"
    class="border-accented border-s-4 ps-4 italic"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </blockquote>
  <Accordion v-else-if="node.type === 'accordion'" :node="node" />
  <Badge
    v-else-if="node.type === 'badge'"
    :component-props="(node.componentProps as BadgeProps | undefined) || {}"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </Badge>
  <Callout
    v-else-if="node.type === 'callout'"
    :component-props="(node.componentProps as CalloutProps | undefined) || {}"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </Callout>
  <Callout
    v-else-if="
      node.type === 'note' ||
      node.type === 'tip' ||
      node.type === 'warning' ||
      node.type === 'caution'
    "
    :component-props="{
      color:
        node.type === 'note'
          ? 'info'
          : node.type === 'tip'
            ? 'success'
            : node.type === 'warning'
              ? 'warning'
              : 'error',
      icon:
        node.type === 'note'
          ? 'information-circle'
          : node.type === 'tip'
            ? 'light-bulb'
            : node.type === 'warning'
              ? 'exclamation-triangle'
              : 'exclamation-circle',
    }"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </Callout>
  <Card
    v-else-if="node.type === 'card'"
    :component-props="(node.componentProps as CardProps | undefined) || {}"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </Card>
  <CardGroup v-else-if="node.type === 'card-group'" :node="node" />
  <CodeCollapse v-else-if="node.type === 'code-collapse'" :node="node" />
  <CodeGroup v-else-if="node.type === 'code-group'" :node="node" />
  <CodeTree v-else-if="node.type === 'code-tree'" :node="node" />
  <Collapsible
    v-else-if="node.type === 'collapsible'"
    :component-props="
      (node.componentProps as CollapsibleProps | undefined) || {}
    "
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </Collapsible>
  <Field
    v-else-if="node.type === 'field'"
    :component-props="(node.componentProps as FieldProps | undefined) || {}"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </Field>
  <div
    v-else-if="node.type === 'field-group'"
    class="divide-default my-5 divide-y *:not-last:pb-5"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </div>
  <UIcon
    v-else-if="node.type === 'icon'"
    :name="`i-heroicons-${(node.componentProps as IconProps | undefined)?.name || 'question-mark-circle'}`"
  />
  <UKbd
    v-else-if="node.type === 'kbd'"
    :value="(node.componentProps as KbdProps | undefined)?.value || ''"
  />
  <Tabs v-else-if="node.type === 'tabs'" :node="node" />
  <Stepper v-else-if="node.type === 'steps'" :node="node" />
  <template v-else-if="node.type === 'heading'">
    <h1
      v-if="node.depth === 1"
      class="text-highlighted mb-8 text-4xl font-bold *:text-4xl"
    >
      <MdNode v-for="item in node.items" :key="item.id" :node="item" />
    </h1>
    <h2
      v-else-if="node.depth === 2"
      class="text-highlighted relative mt-12 mb-6 text-2xl font-bold *:text-2xl"
    >
      <MdNode v-for="item in node.items" :key="item.id" :node="item" />
    </h2>
    <h3
      v-else-if="node.depth === 3"
      class="text-highlighted relative mt-8 mb-3 text-xl font-bold *:text-xl"
    >
      <MdNode v-for="item in node.items" :key="item.id" :node="item" />
    </h3>
    <h4
      v-else-if="node.depth === 4"
      class="text-highlighted relative mt-6 mb-2 text-lg font-bold *:text-lg"
    >
      <MdNode v-for="item in node.items" :key="item.id" :node="item" />
    </h4>
    <h5
      v-else-if="node.depth === 5"
      class="text-highlighted relative mt-4 mb-1 text-base font-bold *:text-base"
    >
      <MdNode v-for="item in node.items" :key="item.id" :node="item" />
    </h5>
    <h6
      v-else-if="node.depth === 6"
      class="text-highlighted relative mt-2 mb-1 text-sm font-bold *:text-sm"
    >
      <MdNode v-for="item in node.items" :key="item.id" :node="item" />
    </h6>
    <div
      v-if="node.depth && node.depth > 3 && preview.preview"
      class="mb-2 rounded border border-yellow-300 bg-yellow-100 px-3 py-2 text-sm text-yellow-800"
    >
      Warning: Heading levels greater than 3 are not recommended.
    </div>
  </template>
  <div v-else-if="node.type === 'image'" class="flex w-full justify-center">
    <img
      :src="
        !node.href?.includes('https://')
          ? preview.preview
            ? `/api/private/avatars/${node.href}`
            : `/api/public/pages/images/${node.href}`
          : node.href
      "
      :alt="node.title"
      class="my-4 inline-flex max-h-96 max-w-full justify-center rounded object-contain"
    />
  </div>
  <ul
    v-else-if="node.type === 'list-items'"
    class="my-5 list-disc ps-6 marker:text-(--ui-border-accented)"
  >
    <li
      v-for="item in node.items"
      :key="item.id"
      class="my-1.5 ps-1.5 leading-7 [&>ul]:my-0"
    >
      <template v-if="item.type === 'list-item'">
        <MdNode v-for="n in item.items" :key="n.id" :node="n" />
      </template>
    </li>
  </ul>
  <ol
    v-else-if="node.type === 'ordered-list-items'"
    class="marker:text-muted ps-6"
    :start="node.orderedListStartIndex"
    :class="{
      'list-decimal': (node.depth || 0) % 5 === 0,
      'list-[lower-alpha]': (node.depth || 0) % 5 === 1,
      'list-[upper-alpha]': (node.depth || 0) % 5 === 2,
      'list-[lower-roman]': (node.depth || 0) % 5 === 3,
      'list-[upper-roman]': (node.depth || 0) % 5 === 4,
      'my-6': node.depth === 0,
    }"
  >
    <li
      v-for="item in node.items"
      :key="item.id"
      class="my-1.5 ps-1.5 leading-7 [&>ul]:my-0"
    >
      <template v-if="item.type === 'ordered-list-item'">
        <MdNode v-for="n in item.items" :key="n.id" :node="n" />
      </template>
    </li>
  </ol>
  <p
    v-else-if="node.type === 'paragraph'"
    class="my-5 inline leading-7 text-pretty"
  >
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </p>
  <div v-else-if="'items' in node && node.items && node.items.length">
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </div>
  <template v-if="node.type === 'text'">
    {{ node.text }}
  </template>
  <code
    v-if="node.type === 'inline-code'"
    class="inline rounded-md border px-1.5 py-0.5 font-mono text-sm font-medium"
    :class="{
      'border-error/25 bg-error/10 text-error': node.color === 'error',
      'border-warning/25 bg-warning/10 text-warning': node.color === 'warning',
      'border-info/25 bg-info/10 text-info': node.color === 'info',
      'border-success/25 bg-success/10 text-success': node.color === 'success',
      'border-primary/25 bg-primary/10 text-primary': node.color === 'primary',
      'border-secondary/25 bg-secondary/10 text-secondary':
        node.color === 'secondary',
      'border-muted text-highlighted bg-muted':
        !node.color ||
        ![
          'error',
          'warning',
          'info',
          'success',
          'primary',
          'secondary',
        ].includes(node.color),
    }"
  >
    <template
      v-if="
        node.type === 'inline-code' &&
        node.language &&
        node.syntaxHighlightedTokens &&
        node.syntaxHighlightedTokens.length === 1
      "
    >
      <span
        v-for="token in node.syntaxHighlightedTokens[0]"
        :key="token.content"
        :style="{
          color: token.color,
          backgroundColor: token.bgColor,
        }"
      >
        {{ token.content }}
      </span>
    </template>
    <template v-else>
      {{ node.text }}
    </template>
  </code>
  <strong v-if="node.type === 'bold'" class="inline font-extrabold">
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </strong>
  <em v-if="node.type === 'italic'" class="inline italic">
    <MdNode v-for="item in node.items" :key="item.id" :node="item" />
  </em>
  <a
    v-if="node.type === 'link'"
    :href="node.href"
    class="text-primary hover:border-primary focus-visible:outline-primary hover:[&>code]:border-primary hover:[&>code]:text-primary border-b border-transparent font-medium [&>code]:border-dashed"
    target="_blank"
    :external="true"
    rel="noopener noreferrer"
  >
    {{ node.title }}
  </a>
  <div
    v-if="node.type === 'code-block'"
    class="group relative my-2 text-sm **:[.line]:isolate **:[.line]:not-last:min-h-[1lh]"
  >
    <MyCard>
      <template v-if="node.name" #header>
        <div class="flex items-center justify-between p-1.5">
          <div class="flex items-center gap-1.5">
            <UIcon
              :name="`i-vscode-icons:file-type-${fileExtension(node.language || 'text')}`"
              class="h-5 w-5"
            />
            <span class="text-sm">{{ node.name }}</span>
          </div>
          <UButton
            class="invisible z-10 group-hover:visible"
            size="sm"
            variant="ghost"
            color="neutral"
            :icon="
              copied
                ? 'i-heroicons-clipboard-document-check'
                : 'i-heroicons-clipboard-document'
            "
            @click="() => copyCode(node as CodeBlockNode)"
          />
        </div>
      </template>
      <template #content>
        <div class="p-2">
          <UButton
            v-if="!node.name"
            class="invisible absolute top-2 right-2 z-10 group-hover:visible"
            size="sm"
            variant="ghost"
            color="neutral"
            :icon="
              copied
                ? 'i-heroicons-clipboard-document-check'
                : 'i-heroicons-clipboard-document'
            "
            @click="() => copyCode(node as CodeBlockNode)"
          />
          <CodeBlock
            :language="node.language"
            :syntax-highlighted-tokens="
              colorMode.value === 'light'
                ? node.syntaxHighlightedTokens
                : node.darkSyntaxHighlightedTokens
            "
          />
        </div>
      </template>
    </MyCard>
  </div>
  <hr v-if="node.type === 'hr'" class="border-default my-12 border-t" />
</template>
