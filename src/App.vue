<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Navbar -->
    <!-- Aggiunto class="fixed-top" per far sì che la navbar rimanga in cima -->
    <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow-sm fixed-top">
      <b-container>
        <b-navbar-brand href="#" class="font-weight-bold text-white">Libreria Universitaria</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="isAuthenticated" @click="handleLogout" class="text-white">Logout</b-nav-item>
            <b-nav-item v-else @click="showRegisterForm = false" class="text-white">Login</b-nav-item>
            <b-nav-item v-if="!isAuthenticated && !showRegisterForm" @click="showRegisterForm = true" class="text-white">Registrati</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <!-- Contenuto principale -->
    <main class="app-main-content">
      <template v-if="isAuthenticated">
        <LibriManager />
      </template>
      <template v-else>
        <!-- Wrapper per Login/Register per centrare il contenuto e farlo espandere -->
        <div class="d-flex justify-content-center align-items-center flex-grow-1">
          <Login @loginSuccess="checkAuthStatus" @goToRegister="showRegisterForm = true" v-if="!showRegisterForm"/>
          <Register @registrationSuccess="showRegisterForm = false; checkAuthStatus()" @goToLogin="showRegisterForm = false" v-else />
        </div>
      </template>
    </main>

    <!-- Footer -->
    <footer class="app-footer bg-dark text-white-50 py-3">
      <b-container class="text-center">
        &copy; {{ currentYear }} Libreria Universitaria. Tutti i diritti riservati.
      </b-container>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LibriManager from './components/LibriManager.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import AuthService from './services/AuthService';

import {
  BNavbar,
  BNavbarBrand,
  BNavbarToggle,
  BCollapse,
  BNavbarNav,
  BNavItem,
  BContainer
} from 'bootstrap-vue-next';

const isAuthenticated = ref<boolean>(false);
const showRegisterForm = ref<boolean>(false);
const currentYear = ref<number>(new Date().getFullYear());

const checkAuthStatus = () => {
  isAuthenticated.value = AuthService.isAuthenticated();
};

const handleLogout = () => {
  AuthService.logout();
  checkAuthStatus();
};

onMounted(() => {
  checkAuthStatus();
});
</script>

<style>
/* Stili globali per l'applicazione */
html, body {
  height: 100%; /* Assicura che html e body occupino l'intera altezza */
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Evita scroll orizzontale */
  box-sizing: border-box; /* Importante: include padding e bordo nella dimensione dell'elemento */
}

*, *::before, *::after {
  box-sizing: inherit; /* Tutti gli elementi ereditano il box-sizing */
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh; /* #app occupa l'intera altezza della viewport */
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f8f9fa; /* Sfondo generale più chiaro */
}

/* Regola l'altezza della navbar per un offset preciso */
.b-navbar.fixed-top {
    height: 56px; /* Altezza standard di una navbar Bootstrap */
    z-index: 1030; /* Assicura che sia sopra gli altri contenuti */
    position: fixed; /* Assicurati che sia fisso */
    top: 0;
    left: 0;
    right: 0;
    width: 100%; /* Si estende per tutta la larghezza */
}

.app-main-content {
  flex-grow: 1; /* Il contenuto principale si espande per riempire lo spazio */
  overflow-y: auto; /* Permette lo scorrimento verticale se il contenuto è troppo lungo */
  padding-top: 56px; /* Offset per la navbar fissa */
  padding-bottom: 20px; /* Padding in basso per separare dal footer */
}

.app-footer {
  flex-shrink: 0; /* Il footer non si riduce */
  background-color: #343a40 !important; /* Sfondo scuro per il footer */
  height: auto; /* L'altezza del footer si adatta al contenuto */
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* Overrides per BootstrapVue */
.navbar-nav .nav-link {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.navbar-brand {
  margin-right: 2rem !important;
}
</style>
