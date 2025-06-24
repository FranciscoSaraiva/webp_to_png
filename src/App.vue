<template>
  <main>
    <h1>WebP to PNG Converter</h1>
    <Converter />
  </main>
</template>

<script setup lang="ts">
import Converter from './components/Converter.vue';
</script>

<style>
main {
  max-width: 800px;
  margin: auto;
  text-align: center;
  padding: 2rem;
}
</style>

