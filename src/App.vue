<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Navbar -->
    <b-navbar toggleable="lg" type="dark" variant="primary" class="shadow-sm fixed-top"> <!-- Mantenuto variant="primary" come tua soluzione temporanea -->
      <b-container class="d-flex align-items-center">
        <b-navbar-brand href="#" class="font-weight-bold text-white">Libreria Universitaria</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto align-items-center">
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
      <!-- Rimosso b-container qui, il footer si estenderà per tutta la larghezza -->
      <div class="text-center w-100"> <!-- Aggiunto w-100 per sicurezza -->
        &copy; {{ currentYear }} Libreria Universitaria. Tutti i diritti riservati.
      </div>
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
  width: 100%; /* Assicura che il body occupi l'intera larghezza */
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
  width: 100%; /* Assicura che #app occupi l'intera larghezza */
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f8f9fa;
}

.b-navbar.fixed-top {
    height: 56px; /* Altezza standard di una navbar Bootstrap */
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
  width: 100%; /* Assicura che il footer occupi l'intera larghezza */
  /* Aggiunto display flex e justify-content-center per centrare il contenuto */
  display: flex;
  justify-content: center;
  align-items: center; /* Centra verticalmente il testo nel footer */
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* Stili per i link della navbar (testo dei pulsanti) */
.b-navbar .navbar-nav .nav-item .nav-link,
.b-navbar .navbar-nav .nav-item .nav-link:hover,
.b-navbar .navbar-nav .nav-item .nav-link:focus,
.b-navbar .navbar-nav .nav-item .nav-link:active {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  color: white !important; /* Forza il colore bianco per il testo dei pulsanti */
  display: flex;
  align-items: center;
  height: 100%;
  background-color: transparent;
  border-radius: 0.25rem;
}

/* Aggiunto stile per il brand per assicurare che sia sempre bianco */
.b-navbar-brand.text-white {
    color: white !important;
}

/* Stile al passaggio del mouse per i link della navbar */
.b-navbar .navbar-nav .nav-item .nav-link:hover,
.b-navbar .navbar-nav .nav-item .nav-link:focus {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-brand {
  margin-right: 2rem !important;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
