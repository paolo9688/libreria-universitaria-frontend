<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Navbar -->
    <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow-sm fixed-top">
      <b-container>
        <b-navbar-brand href="#" class="font-weight-bold text-white">Libreria Universitaria</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <!-- Pulsanti di navigazione nella navbar -->
            <b-nav-item v-if="isAuthenticated && currentPage === 'bookList'" @click="currentPage = 'manageBooks'" class="text-white">Gestione Libri</b-nav-item>
            <b-nav-item v-if="isAuthenticated && currentPage === 'manageBooks'" @click="currentPage = 'bookList'" class="text-white">Lista Libri</b-nav-item>
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
        <!-- Visualizzazione condizionale basata su currentPage -->
        <LibriManager @showBookList="currentPage = 'bookList'" v-if="currentPage === 'manageBooks'" />
        <BookList @goToManageBooks="currentPage = 'manageBooks'" v-else-if="currentPage === 'bookList'" />
      </template>
      <template v-else>
        <!-- Wrapper per Login/Register per centrare il contenuto e farlo espandere -->
        <div class="d-flex justify-content-center align-items-center flex-grow-1">
          <Login @loginSuccess="handleLoginSuccess" @goToRegister="showRegisterForm = true" v-if="!showRegisterForm"/>
          <Register @registrationSuccess="handleRegistrationSuccess" @goToLogin="showRegisterForm = false" v-else />
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
import BookList from './components/BookList.vue'; // Nuovo import
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
const currentPage = ref<string>('manageBooks'); // Stato per la pagina corrente: 'manageBooks' o 'bookList'
const currentYear = ref<number>(new Date().getFullYear());

const checkAuthStatus = () => {
  isAuthenticated.value = AuthService.isAuthenticated();
  if (isAuthenticated.value) {
    currentPage.value = 'manageBooks'; // Se autenticato, vai alla pagina di gestione libri
  } else {
    currentPage.value = 'login'; // Se non autenticato, vai alla pagina di login
  }
};

const handleLoginSuccess = () => {
  checkAuthStatus(); // Aggiorna lo stato di autenticazione
  currentPage.value = 'manageBooks'; // Dopo il login, vai alla pagina di gestione libri
};

const handleRegistrationSuccess = () => {
  showRegisterForm.value = false; // Torna al form di login
  // Non chiamare checkAuthStatus qui, perché l'utente non è ancora loggato
};

const handleLogout = () => {
  AuthService.logout();
  checkAuthStatus(); // Aggiorna lo stato di autenticazione (torna alla pagina di login)
};

onMounted(() => {
  checkAuthStatus();
});
</script>

<style>
/* Stili globali per l'applicazione */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f8f9fa;
}

.b-navbar.fixed-top {
    height: 56px;
    z-index: 1030;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
}

.app-main-content {
  flex-grow: 1;
  overflow-y: auto;
  padding-top: 56px; /* Offset per la navbar fissa */
  padding-bottom: 20px;
}

.app-footer {
  flex-shrink: 0;
  background-color: #343a40 !important;
  height: auto;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important;
}

.navbar-nav .nav-link {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.navbar-brand {
  margin-right: 2rem !important;
}
</style>
