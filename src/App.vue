<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Navbar (opzionale, ma utile per logout) -->
    <b-navbar toggleable="lg" type="dark" variant="dark" v-if="isAuthenticated">
      <b-navbar-brand href="#">Libreria Universitaria</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item @click="handleLogout">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- Visualizzazione condizionale dei componenti -->
    <template v-if="isAuthenticated">
      <LibriManager />
    </template>
    <template v-else>
      <!-- Passiamo un prop per indicare se mostrare il form di registrazione -->
      <Login @loginSuccess="checkAuthStatus" @goToRegister="showRegisterForm = true" v-if="!showRegisterForm"/>
      <Register @registrationSuccess="showRegisterForm = false; checkAuthStatus()" @goToLogin="showRegisterForm = false" v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LibriManager from './components/LibriManager.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue'; // Dovremo creare questo componente
import AuthService from './services/AuthService'; // Importa il servizio di autenticazione

// Importa i componenti di BootstrapVue per la Navbar
import {
  BNavbar,
  BNavbarBrand,
  BNavbarToggle,
  BCollapse,
  BNavbarNav,
  BNavItem
} from 'bootstrap-vue-next';

// Stato reattivo per l'autenticazione
const isAuthenticated = ref<boolean>(false);
const showRegisterForm = ref<boolean>(false); // Per alternare tra login e registrazione

// Funzione per controllare lo stato di autenticazione
const checkAuthStatus = () => {
  isAuthenticated.value = AuthService.isAuthenticated();
};

// Funzione per gestire il logout
const handleLogout = () => {
  AuthService.logout(); // Rimuove il token
  checkAuthStatus(); // Aggiorna lo stato di autenticazione (torna alla pagina di login)
};

// Quando il componente App è montato, controlla subito lo stato di autenticazione
onMounted(() => {
  checkAuthStatus();
});
</script>

<style>
/* Stili globali per l'applicazione */
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Stili per la navbar, se necessario */
.ml-auto {
  margin-left: auto !important; /* Sposta gli elementi a destra */
}
</style>
