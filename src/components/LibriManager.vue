<!-- src/components/LibriManager.vue -->
<template>
  <b-container>
    <b-card title="Gestione Libri" class="text-center shadow-lg p-3 mb-5 bg-white rounded-lg">
      <b-card-text class="lead text-muted mb-4">
        Qui puoi aggiungere nuovi libri al tuo database.
      </b-card-text>

      <!-- Sezione per Aggiungere un Nuovo Libro (sempre visibile) -->
      <b-card title="Aggiungi Nuovo Libro" class="mb-5 text-left shadow-sm rounded-lg">
        <b-form @submit.prevent="submitNewLibro">
          <b-row class="mb-3">
            <b-col md="6">
              <b-form-group label="Titolo:" label-for="titolo-input">
                <b-form-input id="titolo-input" v-model="newLibro.titolo" required class="rounded-pill"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Autore:" label-for="autore-input">
                <b-form-input id="autore-input" v-model="newLibro.autore" required class="rounded-pill"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col md="6">
              <b-form-group label="Anno Pubblicazione:" label-for="anno-input">
                <b-form-input id="anno-input" v-model.number="newLibro.annoPubblicazione" type="number" required class="rounded-pill"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Genere:" label-for="genere-input">
                <b-form-input id="genere-input" v-model="newLibro.genere" required class="rounded-pill"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mb-4">
            <b-col md="6">
              <b-form-group label="Disponibile:" label-for="disponibile-check">
                <b-form-checkbox id="disponibile-check" v-model="newLibro.disponibile" switch class="mt-2">
                  {{ newLibro.disponibile ? 'Sì' : 'No' }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Prezzo:" label-for="prezzo-input">
                <b-form-input id="prezzo-input" v-model.number="newLibro.prezzo" type="number" step="0.01" required class="rounded-pill"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-button type="submit" variant="primary" class="mt-3 rounded-pill add-book-button">Aggiungi Libro</b-button>
        </b-form>
      </b-card>

      <!-- Alert per messaggi di stato -->
      <b-alert
        v-model="showAlert"
        :variant="alertVariant"
        dismissible
        fade
        class="mt-4 mx-auto"
        style="max-width: 800px;"
      >
        {{ alertMessage }}
      </b-alert>

      <!-- Pulsante per andare alla pagina della lista dei libri -->
      <div class="text-center mt-5">
        <b-button variant="info" @click="goToBookList" class="rounded-pill show-list-button">
          Visualizza Lista Libri
        </b-button>
      </div>

    </b-card>
  </b-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'; // Rimosso onMounted, fetchLibri, libri, loading, error, fields, confirmDelete, deleteLibro, libroToDeleteId, showBookList
import LibroService from '@/services/LibroService';

import {
  BContainer,
  BCard,
  BCardText,
  BForm,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BButton,
  BAlert,
  BRow,
  BCol
  // Rimosso BTable, BSpinner, BModal
} from 'bootstrap-vue-next';

type AlertVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface Libro {
  id?: number;
  titolo: string;
  autore: string;
  annoPubblicazione: number;
  genere: string;
  disponibile: boolean;
  prezzo: number;
}

// Rimosso libri, loading, error, showBookList
const newLibro = ref<Libro>({
  titolo: '',
  autore: '',
  annoPubblicazione: null as any,
  genere: '',
  disponibile: true,
  prezzo: null as any
});

const showAlert = ref<boolean>(false);
const alertMessage = ref<string>('');
const alertVariant = ref<AlertVariant>('info');

// Rimosso libroToDeleteId, fields

// Rimosso fetchLibri

const submitNewLibro = async () => {
  try {
    const addedLibro = await LibroService.addLibro(newLibro.value);
    showAlertMessage(`Libro "${addedLibro.titolo}" aggiunto con successo!`, 'success');
    resetNewLibroForm();
    // Non ricarichiamo la lista qui, perché è in un altro componente
  } catch (err: any) {
    showAlertMessage('Errore durante l\'aggiunta del libro!', 'danger');
    console.error('Errore aggiunta libro:', err);
  }
};

// Rimosso confirmDelete, deleteLibro

const resetNewLibroForm = () => {
  newLibro.value = {
    titolo: '',
    autore: '',
    annoPubblicazione: null as any,
    genere: '',
    disponibile: true,
    prezzo: null as any
  };
};

const showAlertMessage = (message: string, variant: AlertVariant) => {
  alertMessage.value = message;
  alertVariant.value = variant;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

// Emette un evento per navigare alla pagina della lista libri
const emit = defineEmits(['showBookList']);
const goToBookList = () => {
  emit('showBookList');
};

// Rimosso onMounted
</script>

<style scoped>
.text-center {
  text-align: center;
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,.075)!important;
}

.p-3 {
  padding: 1rem !important;
}

.p-md-5 {
  padding: 3rem !important;
}

.mb-5 {
  margin-bottom: 3rem !important;
}

.bg-white {
  background-color: #fff !important;
}

.rounded-lg {
  border-radius: 1rem !important;
}

.lead {
  font-size: 1.25rem;
  font-weight: 300;
}

.text-muted {
  color: #6c757d !important;
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
  gap: 1rem !important;
}

.mt-4 {
  margin-top: 1.5rem !important;
}

.mx-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}

.text-left {
  text-align: left !important;
}

.rounded-pill {
  border-radius: 50rem !important;
}

.add-book-button, .show-list-button {
  transition: all 0.3s ease;
  font-weight: bold;
}

.add-book-button:hover, .show-list-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Rimosse classi relative alla tabella */
</style>
