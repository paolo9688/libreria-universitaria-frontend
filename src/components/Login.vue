<!-- src/components/Login.vue -->
<template>
  <b-container class="py-5 d-flex justify-content-center align-items-center min-vh-100">
    <b-card title="Accedi alla Libreria" class="text-center shadow-lg p-4" style="max-width: 500px; width: 100%;">
      <b-card-text class="mb-4">
        Inserisci le tue credenziali per accedere.
      </b-card-text>

      <b-form @submit.prevent="handleLogin">
        <b-form-group label="Email:" label-for="email-input" class="mb-3">
          <b-form-input
            id="email-input"
            v-model="email"
            type="email"
            placeholder="Inserisci la tua email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password:" label-for="password-input" class="mb-4">
          <b-form-input
            id="password-input"
            v-model="password"
            type="password"
            placeholder="Inserisci la tua password"
            required
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="w-100 mb-3" :disabled="loading">
          <b-spinner small v-if="loading"></b-spinner>
          {{ loading ? 'Accesso in corso...' : 'Accedi' }}
        </b-button>
      </b-form>

      <b-alert v-model="showAlert" :variant="alertVariant" dismissible fade class="mt-3">
        {{ alertMessage }}
      </b-alert>

      <b-card-text class="mt-4">
        Non hai un account? <b-link @click="goToRegister">Registrati qui</b-link>
      </b-card-text>

    </b-card>
  </b-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AuthService from '@/services/AuthService';

import {
  BContainer,
  BCard,
  BCardText,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BAlert,
  BSpinner,
  BLink
} from 'bootstrap-vue-next';

// Definisci un tipo union per le varianti di colore di Bootstrap
type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

// Dati reattivi per il form di login
const email = ref<string>('');
const password = ref<string>('');
const loading = ref<boolean>(false);

// Dati reattivi per l'alert, ora con il tipo AlertVariant
const showAlert = ref<boolean>(false);
const alertMessage = ref<string>('');
const alertVariant = ref<AlertVariant>('danger'); // Inizializza con una variante valida

const emit = defineEmits(['loginSuccess', 'goToRegister']);

const handleLogin = async () => {
  loading.value = true;
  showAlert.value = false;

  try {
    await AuthService.login({ email: email.value, password: password.value });
    showAlertMessage('Login effettuato con successo!', 'success');
    emit('loginSuccess');
  } catch (error: any) {
    console.error('Errore login:', error);
    const errorMessage = error.response?.data || 'Credenziali non valide. Riprova.';
    showAlertMessage(errorMessage, 'danger');
  } finally {
    loading.value = false;
  }
};

const showAlertMessage = (message: string, variant: AlertVariant) => { // Anche qui il parametro 'variant' usa il nuovo tipo
  alertMessage.value = message;
  alertVariant.value = variant;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

const goToRegister = () => {
  emit('goToRegister');
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.d-flex {
  display: flex;
}
.justify-content-center {
  justify-content: center;
}
.align-items-center {
  align-items: center;
}
.p-4 {
  padding: 1.5rem !important;
}
.w-100 {
  width: 100% !important;
}
.mb-3 {
  margin-bottom: 1rem !important;
}
.mb-4 {
  margin-bottom: 1.5rem !important;
}
.mt-3 {
  margin-top: 1rem !important;
}
.mt-4 {
  margin-top: 1.5rem !important;
}
</style>
