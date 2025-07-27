<!-- src/components/Register.vue -->
<template>
  <!-- Rimosso min-vh-100 dal div contenitore, ora gestito da App.vue -->
  <div class="register-page-container d-flex justify-content-center align-items-center py-5">
    <b-card title="Registrati" class="register-card text-center shadow-lg p-md-5 p-4 rounded-lg">
      <b-card-text class="text-muted mb-4">
        Crea un nuovo account per accedere alla libreria.
      </b-card-text>

      <b-form @submit.prevent="handleRegister">
        <b-row>
          <b-col md="6">
            <b-form-group label="Nome:" label-for="nome-input" class="mb-3 text-left">
              <b-form-input id="nome-input" v-model="form.nome" required class="rounded-pill"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Cognome:" label-for="cognome-input" class="mb-3 text-left">
              <b-form-input id="cognome-input" v-model="form.cognome" required class="rounded-pill"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Indirizzo:" label-for="indirizzo-input" class="mb-3 text-left">
          <b-form-input id="indirizzo-input" v-model="form.indirizzo" class="rounded-pill"></b-form-input>
        </b-form-group>
        <b-form-group label="Email:" label-for="email-input" class="mb-3 text-left">
          <b-form-input id="email-input" v-model="form.email" type="email" required class="rounded-pill"></b-form-input>
        </b-form-group>
        <b-form-group label="Password:" label-for="password-input" class="mb-4 text-left">
          <b-form-input id="password-input" v-model="form.password" type="password" required class="rounded-pill"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success" class="w-100 mb-3 rounded-pill register-button" :disabled="loading">
          <b-spinner small v-if="loading"></b-spinner>
          {{ loading ? 'Registrazione in corso...' : 'Registrati' }}
        </b-button>
      </b-form>

      <b-alert v-model="showAlert" :variant="alertVariant" dismissible fade class="mt-3">
        {{ alertMessage }}
      </b-alert>

      <b-card-text class="mt-4">
        Hai già un account? <b-link @click="goToLogin" class="text-success font-weight-bold">Accedi qui</b-link>
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
  BLink,
  BRow,
  BCol
} from 'bootstrap-vue-next';

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
const alertVariant = ref<AlertVariant>('danger');

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

const showAlertMessage = (message: string, variant: AlertVariant) => {
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
.register-page-container {
  background: linear-gradient(to right, #2575fc 0%, #6a11cb 100%);
  /* Rimosso min-vh-100 da qui */
  padding: 2rem 0;
  flex-grow: 1; /* Permette al contenitore di espandersi nel flexbox di App.vue */
}

.register-card {
  max-width: 600px;
  width: 90%;
  border-radius: 1rem;
  border: none;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out;
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

.register-button {
  transition: all 0.3s ease;
  font-weight: bold;
}

.register-button:hover {
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

.text-success {
  color: #28a745 !important;
}
.font-weight-bold {
  font-weight: 700 !important;
}
</style>
