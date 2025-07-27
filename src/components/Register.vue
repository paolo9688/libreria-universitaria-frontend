<!-- src/components/Register.vue -->
<template>
  <b-container class="py-5 d-flex justify-content-center align-items-center min-vh-100">
    <b-card title="Registrati" class="text-center shadow-lg p-4" style="max-width: 600px; width: 100%;">
      <b-card-text class="mb-4">
        Crea un nuovo account per accedere alla libreria.
      </b-card-text>

      <b-form @submit.prevent="handleRegister">
        <b-row>
          <b-col md="6">
            <b-form-group label="Nome:" label-for="nome-input" class="mb-3">
              <b-form-input id="nome-input" v-model="form.nome" required></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Cognome:" label-for="cognome-input" class="mb-3">
              <b-form-input id="cognome-input" v-model="form.cognome" required></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Indirizzo:" label-for="indirizzo-input" class="mb-3">
          <b-form-input id="indirizzo-input" v-model="form.indirizzo"></b-form-input>
        </b-form-group>
        <b-form-group label="Email:" label-for="email-input" class="mb-3">
          <b-form-input id="email-input" v-model="form.email" type="email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Password:" label-for="password-input" class="mb-4">
          <b-form-input id="password-input" v-model="form.password" type="password" required></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success" class="w-100 mb-3" :disabled="loading">
          <b-spinner small v-if="loading"></b-spinner>
          {{ loading ? 'Registrazione in corso...' : 'Registrati' }}
        </b-button>
      </b-form>

      <b-alert v-model="showAlert" :variant="alertVariant" dismissible fade class="mt-3">
        {{ alertMessage }}
      </b-alert>

      <b-card-text class="mt-4">
        Hai già un account? <b-link @click="goToLogin">Accedi qui</b-link>
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
  BLink,
  BRow,
  BCol
} from 'bootstrap-vue-next';

// Definisci un tipo union per le varianti di colore di Bootstrap
type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

const form = ref({
  nome: '',
  cognome: '',
  indirizzo: '',
  email: '',
  password: ''
});

const loading = ref<boolean>(false);
const showAlert = ref<boolean>(false);
const alertMessage = ref<string>('');
const alertVariant = ref<AlertVariant>('danger'); // Inizializza con una variante valida

const emit = defineEmits(['registrationSuccess', 'goToLogin']);

const handleRegister = async () => {
  loading.value = true;
  showAlert.value = false;

  try {
    await AuthService.register(form.value);
    showAlertMessage('Registrazione completata con successo! Ora puoi accedere.', 'success');
    emit('registrationSuccess');
  } catch (error: any) {
    console.error('Errore registrazione:', error);
    const errorMessage = error.response?.data || 'Errore durante la registrazione. Riprova.';
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

const goToLogin = () => {
  emit('goToLogin');
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
