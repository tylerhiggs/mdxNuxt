<script setup lang="ts">
import type {
  HeadingNode,
  MdNode,
  HeadingOutlineItem,
  SectionNode,
} from "~/shared/types";

const props = defineProps<{
  nodes: MdNode[];
}>();

const headings = computed(() => {
  const filtered = (
    props.nodes.filter((node) => node.type === "section") as SectionNode[]
  )
    .map((node) => node.items.at(0) as HeadingNode | undefined)
    .filter((node) => node && node.type === "heading") as HeadingNode[];

  let headingHierarchyStack: HeadingOutlineItem[] = [];
  const res: HeadingOutlineItem[] = [];
  filtered.forEach((node) => {
    headingHierarchyStack = headingHierarchyStack.filter(
      (item) => item.depth < node.depth,
    );
    const item: HeadingOutlineItem = {
      id: node.id,
      label: getTextContent(node),
      depth: node.depth,
      items: [],
    };
    const listToPush = headingHierarchyStack.length
      ? headingHierarchyStack.at(-1)!.items
      : res;
    listToPush.push(item);
    headingHierarchyStack.push(item);
  });
  return res;
});
</script>

<template>
  <nav class="z-10 flex h-full flex-col overflow-y-auto px-6 pt-24 pb-6">
    <div class="font-semibold">On this page</div>
    <OutlineItems :items="headings" />
  </nav>
</template>
