<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Qui verrà renderizzato il componente LibriManager -->
    <LibriManager />
  </div>
</template>

<script setup>
import LibriManager from './components/LibriManager.vue';

// Non sono necessari altri script qui, App.vue funge da contenitore principale.
</script>

<style>
/* Stili globali per l'applicazione */
body {
  font-family: 'Inter', sans-serif; /* Usa il font Inter o un altro font a tua scelta */
  background-color: #f8f9fa; /* Un leggero sfondo grigio */
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* Rimuovi text-align: center se vuoi che il contenuto sia allineato a sinistra di default */
}
</style>
