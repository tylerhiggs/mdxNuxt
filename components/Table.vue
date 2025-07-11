<script setup lang="ts">
import type { TableNode } from "@/shared/types";
defineProps<{
  node: TableNode;
}>();
</script>

<template>
  <div class="relative my-5 overflow-x-auto">
    <table class="w-full border-separate border-spacing-0 rounded-md">
      <thead v-if="node.headers?.length" class="bg-muted">
        <tr
          class="[&:first-child>th:first-child]:rounded-tl-md [&:first-child>th:last-child]:rounded-tr-md [&:last-child>td:first-child]:rounded-bl-md [&:last-child>td:last-child]:rounded-br-md"
        >
          <th
            v-for="(header, index) in node.headers"
            :key="index"
            class="border-muted border-e border-t border-b px-4 py-3 text-sm font-semibold first:border-s"
            :class="{
              'text-left': !node.align[index] || node.align[index] === 'left',
              'text-center': node.align[index] === 'center',
              'text-right': node.align[index] === 'right',
            }"
          >
            <MdNode v-for="item in header" :key="item.id" :node="item" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in node.rows"
          :key="rowIndex"
          class="[&:first-child>th:first-child]:rounded-tl-md [&:first-child>th:last-child]:rounded-tr-md [&:last-child>td:first-child]:rounded-bl-md [&:last-child>td:last-child]:rounded-br-md"
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            class="border-muted border-e border-b px-4 py-3 align-top text-sm first:border-s [&_code]:text-xs/5 [&_li]:my-0.5 [&_li]:leading-6 [&_ol]:my-0 [&_ol]:ps-4.5 [&_p]:my-0 [&_p]:leading-6 [&_ul]:my-0 [&_ul]:ps-4.5"
            :class="{
              'text-left':
                !node.align[cellIndex] || node.align[cellIndex] === 'left',
              'text-center': node.align[cellIndex] === 'center',
              'text-right': node.align[cellIndex] === 'right',
            }"
          >
            <MdNode v-for="item in cell" :key="item.id" :node="item" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
