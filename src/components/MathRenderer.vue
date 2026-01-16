<template>
  <div class="math-renderer prose max-w-none" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import katex from 'katex';

const props = defineProps<{
  content: string;
}>();

const renderedContent = computed(() => {
  if (!props.content) return '';

  // Render HTML first? No, we should process the raw string to find delimiters.
  // HOWEVER, the logic usually is:
  // 1. We receive HTML from Quill (which might contain text like "Compute $$x^2$$").
  // 2. We want to replace valid delimiters with KaTeX rendered HTML.
  
  // Simple regex-based replacement for $$...$$ and \(...\)
  // Note: This is a basic implementation. For production robust parsing, better libraries exist, 
  // but for this task we implement a simple replacer.

  let html = props.content;

  // Replace $$...$$ (Display Mode)
  html = html.replace(/\$\$(.+?)\$\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: true, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  // Replace \(...\) (Inline Mode) - escaped backslashes in regex
  html = html.replace(/\\\((.+?)\\\)/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: false, throwOnError: false });
    } catch (e) {
      return match;
    }
  });
  
  // Also support \[...\] for Display Mode
   html = html.replace(/\\\[(.+?)\\\]/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: true, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  return html;
});
</script>

<style>
/* Ensure KaTeX fits nicely */
.math-renderer .katex-display {
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
