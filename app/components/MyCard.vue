<template>
  <div
    class="w-full overflow-auto rounded border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div
      v-if="$slots.header"
      class="border-b border-neutral-300 dark:border-neutral-600"
    >
      <slot name="header"></slot>
    </div>
    <div class="bg-neutral-50 dark:bg-neutral-900">
      <slot name="content"></slot>
    </div>
  </div>
</template>
