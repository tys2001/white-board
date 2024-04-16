<script setup lang="ts"></script>

<template>
  <div class="root">
    <router-view />
    <footer>
      White-Board -
      <a href="/">Top page</a>
    </footer>
  </div>
</template>

<style scoped>
.root {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 24px;
}
footer {
  background-color: dimgray;
  color: white;
  text-align: right;
  padding: 0 5px;
}
footer a {
  color: white;
}
</style>
