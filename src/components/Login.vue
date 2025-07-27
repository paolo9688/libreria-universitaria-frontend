<!-- src/components/Login.vue -->
<template>
  <div class="login-page-container d-flex justify-content-center align-items-center">
    <b-card title="Accedi alla Libreria" class="login-card text-center shadow-lg p-md-5 p-4 rounded-lg mx-auto my-auto">
      <b-card-text class="text-muted mb-4">
        Inserisci le tue credenziali per accedere.
      </b-card-text>

      <b-form @submit.prevent="handleLogin">
        <b-form-group label="Email:" label-for="email-input" class="mb-3 text-left">
          <b-form-input
            id="email-input"
            v-model="email"
            type="email"
            placeholder="La tua email"
            required
            class="rounded-pill"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password:" label-for="password-input" class="mb-4 text-left">
          <b-form-input
            id="password-input"
            v-model="password"
            type="password"
            placeholder="La tua password"
            required
            class="rounded-pill"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="w-100 mb-3 rounded-pill login-button" :disabled="loading">
          <b-spinner small v-if="loading"></b-spinner>
          {{ loading ? 'Accesso in corso...' : 'Accedi' }}
        </b-button>
      </b-form>

      <b-alert v-model="showAlert" :variant="alertVariant" dismissible fade class="mt-3">
        {{ alertMessage }}
      </b-alert>

      <b-card-text class="mt-4">
        Non hai un account? <b-link @click="goToRegister" class="text-primary font-weight-bold">Registrati qui</b-link>
      </b-card-text>

    </b-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AuthService from '@/services/AuthService';

import {
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

type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

const email = ref<string>('');
const password = ref<string>('');
const loading = ref<boolean>(false);

const showAlert = ref<boolean>(false);
const alertMessage = ref<string>('');
const alertVariant = ref<AlertVariant>('danger');

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

const showAlertMessage = (message: string, variant: AlertVariant) => {
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
.login-page-container {
  background: linear-gradient(to right, #6a11cb 0%, #2575fc 100%); /* Gradiente di sfondo */
  flex-grow: 1; /* Permette al contenitore di espandersi nel flexbox di App.vue */
  width: 100%; /* Assicura che occupi tutta la larghezza disponibile */
  /* RIMOSSO height: 100%; */
  /* RIMOSSO min-height: 100%; */
  padding: 0; /* Padding interno per la card, per dare spazio al contenuto */
}

.login-card {
  max-width: 500px;
  width: 90%;
  border-radius: 1rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.rounded-lg {
  border-radius: 1rem !important;
}

.rounded-pill {
  border-radius: 50rem !important;
}

.text-left {
  text-align: left !important;
}

.login-button {
  transition: all 0.3s ease;
  font-weight: bold;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-primary {
  color: #007bff !important;
}
.font-weight-bold {
  font-weight: 700 !important;
}
</style>
