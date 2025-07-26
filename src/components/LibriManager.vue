<!-- src/components/LibriManager.vue -->
<template>
  <b-container class="py-5">
    <b-card title="Gestione Libri" class="text-center shadow-lg p-3 mb-5 bg-white rounded">
      <b-card-text class="lead mb-4">
        Qui puoi visualizzare, aggiungere ed eliminare i libri dal tuo database Spring Boot.
      </b-card-text>

      <!-- Sezione per Aggiungere un Nuovo Libro -->
      <b-card title="Aggiungi Nuovo Libro" class="mb-4 text-left">
        <b-form @submit.prevent="submitNewLibro">
          <b-row>
            <b-col md="6">
              <b-form-group label="Titolo:" label-for="titolo-input">
                <b-form-input id="titolo-input" v-model="newLibro.titolo" required></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Autore:" label-for="autore-input">
                <b-form-input id="autore-input" v-model="newLibro.autore" required></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label="Anno Pubblicazione:" label-for="anno-input">
                <b-form-input id="anno-input" v-model.number="newLibro.annoPubblicazione" type="number" required></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Genere:" label-for="genere-input">
                <b-form-input id="genere-input" v-model="newLibro.genere" required></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label="Disponibile:" label-for="disponibile-check">
                <b-form-checkbox id="disponibile-check" v-model="newLibro.disponibile" switch>
                  {{ newLibro.disponibile ? 'Sì' : 'No' }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Prezzo:" label-for="prezzo-input">
                <b-form-input id="prezzo-input" v-model.number="newLibro.prezzo" type="number" step="0.01" required></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-button type="submit" variant="primary" class="mt-3">Aggiungi Libro</b-button>
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

      <!-- Sezione per la Lista dei Libri -->
      <b-card title="Lista dei Libri" class="text-left">
        <div v-if="loading" class="text-center my-4">
          <b-spinner label="Caricamento..."></b-spinner>
          <p>Caricamento libri...</p>
        </div>
        <div v-else-if="error" class="text-center my-4 text-danger">
          <p>Errore durante il caricamento dei libri: {{ error }}</p>
          <b-button variant="warning" @click="fetchLibri">Riprova</b-button>
        </div>
        <div v-else-if="libri.length === 0" class="text-center my-4">
          <p>Nessun libro trovato. Aggiungine uno!</p>
        </div>
        <b-table
          v-else
          striped
          hover
          :items="libri"
          :fields="fields"
          primary-key="id"
          responsive="sm"
        >
          <template #cell(disponibile)="data">
            <!-- Usa un <i> tag con le classi Bootstrap Icons -->
            <i :class="['bi', data.item.disponibile ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger']"></i>
          </template>
          <template #cell(actions)="row">
            <b-button size="sm" variant="danger" @click="confirmDelete(row.item.id)" class="mr-1">
              Elimina
            </b-button>
          </template>
        </b-table>
      </b-card>
    </b-card>

    <!-- Modale di conferma eliminazione -->
    <b-modal id="delete-modal" title="Conferma Eliminazione" @ok="deleteLibro">
      Sei sicuro di voler eliminare il libro con ID {{ libroToDeleteId }}? Questa azione è irreversibile.
    </b-modal>
  </b-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LibroService from '@/services/LibroService'; // Importa il servizio API

// Importa i componenti di BootstrapVue che stai usando
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
  BCol,
  BTable,
  BSpinner,
  BModal
} from 'bootstrap-vue-next';

// Dati reattivi
const libri = ref([]);
const loading = ref(true);
const error = ref(null);

const newLibro = ref({
  titolo: '',
  autore: '',
  annoPubblicazione: null,
  genere: '',
  disponibile: true,
  prezzo: null
});

const showAlert = ref(false);
const alertMessage = ref('');
const alertVariant = ref('info');

const libroToDeleteId = ref(null); // ID del libro da eliminare

// Campi per la tabella
const fields = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'titolo', label: 'Titolo', sortable: true },
  { key: 'autore', label: 'Autore', sortable: true },
  { key: 'annoPubblicazione', label: 'Anno Pubblicazione', sortable: true },
  { key: 'genere', label: 'Genere', sortable: true },
  { key: 'disponibile', label: 'Disponibile', sortable: true },
  { key: 'prezzo', label: 'Prezzo', sortable: true },
  { key: 'actions', label: 'Azioni' }
];

// Funzioni
const fetchLibri = async () => {
  loading.value = true;
  error.value = null;
  try {
    libri.value = await LibroService.getAllLibri();
  } catch (err) {
    error.value = err.message || 'Si è verificato un errore sconosciuto.';
    showAlertMessage('Errore durante il caricamento dei libri!', 'danger');
  } finally {
    loading.value = false;
  }
};

const submitNewLibro = async () => {
  try {
    const addedLibro = await LibroService.addLibro(newLibro.value);
    showAlertMessage(`Libro "${addedLibro.titolo}" aggiunto con successo!`, 'success');
    resetNewLibroForm();
    await fetchLibri(); // Ricarica la lista dei libri
  } catch (err) {
    showAlertMessage('Errore durante l\'aggiunta del libro!', 'danger');
    console.error('Errore aggiunta libro:', err);
  }
};

const confirmDelete = (id) => {
  libroToDeleteId.value = id;
  // Mostra la modale di conferma
  // Nota: in un ambiente reale, useresti $bvModal.show('delete-modal')
  // o un'altra API per mostrare la modale. Qui simuliamo con un alert temporaneo.
  // Per BootstrapVueNext, potresti aver bisogno di importare useModal() o usare un ref sulla modale.
  // Per semplicità, qui useremo una modale di conferma nativa o un approccio più diretto.
  // Se la modale non appare, controlla la documentazione di bootstrap-vue-next per BModal.
  document.getElementById('delete-modal')._vue_modal.show(); // Accesso diretto per test
};

const deleteLibro = async () => {
  if (libroToDeleteId.value) {
    try {
      const message = await LibroService.deleteLibro(libroToDeleteId.value);
      showAlertMessage(message, 'success');
      await fetchLibri(); // Ricarica la lista dei libri
    } catch (err) {
      showAlertMessage('Errore durante l\'eliminazione del libro!', 'danger');
      console.error('Errore eliminazione libro:', err);
    } finally {
      libroToDeleteId.value = null;
    }
  }
};

const resetNewLibroForm = () => {
  newLibro.value = {
    titolo: '',
    autore: '',
    annoPubblicazione: null,
    genere: '',
    disponibile: true,
    prezzo: null
  };
};

const showAlertMessage = (message, variant) => {
  alertMessage.value = message;
  alertVariant.value = variant;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 5000);
};

// Hook di ciclo vita: quando il componente è montato, recupera i libri
onMounted(() => {
  fetchLibri();
});
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

.text-left {
  text-align: left;
}

/* Stili per le icone di disponibilità */
.b-icon.bi-check-circle-fill {
  color: green;
}
.b-icon.bi-x-circle-fill {
  color: red;
}
</style>
