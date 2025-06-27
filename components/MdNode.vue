<script setup lang="ts">
import type {
  BadgeProps,
  CalloutProps,
  CardProps,
  CollapsibleProps,
  FieldProps,
  IconProps,
  KbdProps,
  MdNode,
} from "~/shared/types";
const props = defineProps<{
  node: MdNode;
  preview?: boolean;
}>();
const colorMode = useColorMode();
const snackbar = useSnackbar();
const copyCode = (code: string) => {
  navigator.clipboard
    .writeText(code)
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
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </blockquote>
  <Accordion v-else-if="node.type === 'accordion'" :node="node" />
  <Badge
    v-else-if="node.type === 'badge'"
    :componentProps="(node.componentProps as BadgeProps | undefined) || {}"
  >
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </Badge>
  <Callout
    v-else-if="node.type === 'callout'"
    :componentProps="(node.componentProps as CalloutProps | undefined) || {}"
  >
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </Callout>
  <Callout
    v-else-if="
      node.type === 'note' ||
      node.type === 'tip' ||
      node.type === 'warning' ||
      node.type === 'caution'
    "
    :componentProps="{
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
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </Callout>
  <Card
    v-else-if="node.type === 'card'"
    :componentProps="(node.componentProps as CardProps | undefined) || {}"
  >
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </Card>
  <CardGroup v-else-if="node.type === 'card-group'" :node="node" />
  <CodeCollapse v-else-if="node.type === 'code-collapse'" :node="node" />
  <CodeGroup v-else-if="node.type === 'code-group'" :node="node" />
  <CodeTree v-else-if="node.type === 'code-tree'" :node="node" />
  <Collapsible
    v-else-if="node.type === 'collapsible'"
    :componentProps="
      (node.componentProps as CollapsibleProps | undefined) || {}
    "
  >
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </Collapsible>
  <Field
    v-else-if="node.type === 'field'"
    :componentProps="(node.componentProps as FieldProps | undefined) || {}"
  >
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </Field>
  <div
    v-else-if="node.type === 'field-group'"
    class="divide-default my-5 divide-y *:not-last:pb-5"
  >
    <MdNode
      v-for="(item, index) in node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </div>
  <UIcon
    v-else-if="node.type === 'icon'"
    :name="`i-heroicons-${(node.componentProps as IconProps | undefined)?.name || 'question-mark-circle'}`"
  />
  <UKbd
    v-else-if="node.type === 'kbd'"
    :value="(node.componentProps as KbdProps | undefined)?.value || ''"
  />
  <Tabs
    v-else-if="node.type === 'tabs'"
    :node="node"
    :preview="props.preview"
  />
  <Stepper
    v-else-if="node.type === 'steps'"
    :node="node"
    :preview="props.preview"
  />
  <template v-else-if="node.type === 'heading'">
    <h1
      v-if="node.depth === 1"
      class="text-highlighted mb-8 text-4xl font-bold *:text-4xl"
    >
      <MdNode
        v-for="(item, index) in node.items"
        :key="index"
        :node="item"
        :preview="props.preview"
      />
    </h1>
    <h2
      v-else-if="node.depth === 2"
      class="text-highlighted relative mt-12 mb-6 text-2xl font-bold *:text-2xl"
    >
      <MdNode
        v-for="(item, index) in node.items"
        :key="index"
        :node="item"
        :preview="props.preview"
      />
    </h2>
    <h3
      v-else-if="node.depth === 3"
      class="text-highlighted relative mt-8 mb-3 text-xl font-bold *:text-xl"
    >
      <MdNode
        v-for="(item, index) in node.items"
        :key="index"
        :node="item"
        :preview="props.preview"
      />
    </h3>
    <h4
      v-else-if="node.depth === 4"
      class="text-highlighted relative mt-6 mb-2 text-lg font-bold *:text-lg"
    >
      <MdNode
        v-for="(item, index) in node.items"
        :key="index"
        :node="item"
        :preview="props.preview"
      />
    </h4>
    <h5
      v-else-if="node.depth === 5"
      class="text-highlighted relative mt-4 mb-1 text-base font-bold *:text-base"
    >
      <MdNode
        v-for="(item, index) in node.items"
        :key="index"
        :node="item"
        :preview="props.preview"
      />
    </h5>
    <h6
      v-else-if="node.depth === 6"
      class="text-highlighted relative mt-2 mb-1 text-sm font-bold *:text-sm"
    >
      <MdNode
        v-for="(item, index) in node.items"
        :key="index"
        :node="item"
        :preview="props.preview"
      />
    </h6>
    <div
      v-if="node.depth && node.depth > 3 && props.preview"
      class="mb-2 rounded border border-yellow-300 bg-yellow-100 px-3 py-2 text-sm text-yellow-800"
    >
      Warning: Heading levels greater than 3 are not recommended.
    </div>
  </template>
  <img
    v-else-if="node.type === 'image'"
    :src="
      !node.href?.includes('https://')
        ? preview
          ? `/api/private/avatars/${node.href}`
          : `/api/public/pages/images/${node.href}`
        : node.href
    "
    :alt="node.text"
    class="m-4"
  />
  <ul
    v-else-if="node.type === 'list-items'"
    class="my-5 list-disc ps-6 marker:text-(--ui-border-accented)"
  >
    <li v-for="item in node.items" class="my-1.5 ps-1.5 leading-7 [&>ul]:my-0">
      <MdNode
        v-for="node in item.items"
        :node="node"
        :preview="props.preview"
      />
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
    <li v-for="item in node.items" class="my-1.5 ps-1.5 leading-7 [&>ul]:my-0">
      <MdNode
        v-for="node in item.items"
        :node="node"
        :preview="props.preview"
      />
    </li>
  </ol>
  <div v-else-if="node.items && node.items.length">
    <MdNode
      v-for="(item, index) in props.node.items"
      :key="index"
      :node="item"
      :preview="props.preview"
    />
  </div>
  <template v-if="node.type === 'text'">
    {{ node.text }}
  </template>
  <p
    v-if="node.type === 'paragraph' && node.text"
    class="my-5 inline leading-7 text-pretty"
  >
    {{ node.text }}
  </p>
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
    <span
      v-if="
        node.type === 'inline-code' &&
        node.language &&
        node.syntaxHighlightedTokens &&
        node.syntaxHighlightedTokens.length === 1
      "
      v-for="token in node.syntaxHighlightedTokens[0]"
      :style="{
        color: token.color,
        backgroundColor: token.bgColor,
      }"
    >
      {{ token.content }}
    </span>
    <template v-else>
      {{ node.text }}
    </template>
  </code>
  <strong v-if="node.type === 'bold'" class="inline font-extrabold">{{
    node.text
  }}</strong>
  <em v-if="node.type === 'italic'" class="inline italic">{{ node.text }}</em>
  <a
    v-if="node.type === 'link'"
    :href="node.href"
    class="text-primary hover:border-primary focus-visible:outline-primary hover:[&>code]:border-primary hover:[&>code]:text-primary border-b border-transparent font-medium [&>code]:border-dashed"
    target="_blank"
    :external="true"
    rel="noopener noreferrer"
  >
    {{ node.text }}
  </a>
  <div
    v-if="node.type === 'code-block' && node.text"
    class="group relative my-2 rounded-lg bg-stone-50 p-3 text-sm shadow-sm *:overflow-auto dark:bg-stone-800 **:[.line]:isolate **:[.line]:not-last:min-h-[1lh]"
  >
    <UButton
      class="invisible absolute top-2 right-2 z-10 group-hover:visible"
      size="sm"
      variant="ghost"
      color="neutral"
      :icon="
        copied
          ? 'i-heroicons-clipboard-document-check'
          : 'i-heroicons-clipboard-document'
      "
      @click="() => copyCode(node.text || '')"
    />
    <CodeBlock
      :code="node.text"
      :language="node.language"
      :syntaxHighlightedTokens="
        colorMode.value === 'light'
          ? node.syntaxHighlightedTokens
          : node.darkSyntaxHighlightedTokens
      "
    />
  </div>
  <hr v-if="node.type === 'hr'" class="border-default my-12 border-t" />
</template>
