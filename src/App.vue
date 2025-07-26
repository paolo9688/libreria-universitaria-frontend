<!-- src/App.vue -->
<template>
  <!-- b-container per un layout centrato e responsivo -->
  <b-container class="py-5">
    <!-- b-card per raggruppare il contenuto in un riquadro elegante -->
    <b-card title="Benvenuto nella Tua App Libri!" class="text-center shadow-lg p-3 mb-5 bg-white rounded">
      <b-card-text class="lead mb-4">
        Questa è una pagina di test migliorata per dimostrare l'integrazione di BootstrapVue.
        Ora puoi vedere un input, un bottone e un alert dinamico.
      </b-card-text>

      <!-- Esempio di b-form-input -->
      <b-form-group
        id="input-group-1"
        label="Inserisci il tuo nome:"
        label-for="input-1"
        class="mb-4"
      >
        <b-form-input
          id="input-1"
          v-model="userName"
          type="text"
          placeholder="Il tuo nome"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Bottoni con diverse varianti -->
      <div class="d-flex justify-content-center gap-3 mb-4">
        <b-button variant="primary" size="lg" @click="greetUser">
          Saluta!
        </b-button>
        <b-button variant="outline-secondary" size="lg" @click="resetInput">
          Resetta
        </b-button>
      </div>

      <!-- Alert dinamico che appare al click del bottone -->
      <b-alert
        v-model="showAlert"
        :variant="alertVariant"
        dismissible
        fade
        class="mt-4 mx-auto"
        style="max-width: 600px;"
      >
        {{ alertMessage }}
      </b-alert>

    </b-card>
  </b-container>
</template>

<script setup>
import { ref } from 'vue';

// Importa i componenti di BootstrapVue che stai usando
import {
  BContainer,
  BCard,
  BCardText,
  BFormGroup,
  BFormInput,
  BButton,
  BAlert
} from 'bootstrap-vue-next';


// Variabili reattive per l'input del nome
const userName = ref('');
// Variabili reattive per l'alert
const showAlert = ref(false);
const alertMessage = ref('');
const alertVariant = ref('info');

// Funzione per salutare l'utente e mostrare l'alert
const greetUser = () => {
  if (userName.value.trim() !== '') {
    alertMessage.value = `Ciao, ${userName.value}! Benvenuto in BootstrapVue.`;
    alertVariant.value = 'success';
  } else {
    alertMessage.value = 'Per favor, inserisci il tuo nome.';
    alertVariant.value = 'warning';
  }
  showAlert.value = true; // Mostra l'alert

  // Nascondi l'alert dopo 5 secondi
  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

// Funzione per resettare l'input e l'alert
const resetInput = () => {
  userName.value = '';
  showAlert.value = false;
  alertMessage.value = '';
};
</script>

<style scoped>
/* Stili di base per il layout */
.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.text-center {
  text-align: center;
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
}

.p-3 {
  padding: 1rem !important;
}

.mb-5 {
  margin-bottom: 3rem !important;
}

.bg-white {
  background-color: #fff !important;
}

.rounded {
  border-radius: 0.25rem !important;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.d-flex {
  display: flex !important;
}

.justify-content-center {
  justify-content: center !important;
}

.gap-3 {
  gap: 1rem !important; /* Spazio tra gli elementi flex */
}

.mt-4 {
  margin-top: 1.5rem !important;
}

.mx-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}
</style>
