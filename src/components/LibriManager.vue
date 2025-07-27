<!-- src/components/LibriManager.vue -->
<template>
  <b-container> <!-- RIMOSSO class="py-5" da qui -->
    <b-card title="Gestione Libri" class="text-center shadow-lg p-3 mb-5 bg-white rounded-lg">
      <b-card-text class="lead text-muted mb-4">
        Qui puoi visualizzare, aggiungere ed eliminare i libri dal tuo database.
      </b-card-text>

      <!-- Sezione per Aggiungere un Nuovo Libro -->
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

      <!-- Sezione per la Lista dei Libri -->
      <b-card title="Lista dei Libri" class="text-left shadow-sm rounded-lg">
        <div v-if="loading" class="text-center my-4">
          <b-spinner label="Caricamento..." variant="primary"></b-spinner>
          <p class="mt-2 text-muted">Caricamento libri...</p>
        </div>
        <div v-else-if="error" class="text-center my-4 text-danger">
          <p>Errore durante il caricamento dei libri: {{ error }}</p>
          <b-button variant="warning" @click="fetchLibri" class="rounded-pill">Riprova</b-button>
        </div>
        <div v-else-if="libri.length === 0" class="text-center my-4 text-muted">
          <p>Nessun libro trovato. Aggiungine uno!</p>
        </div>
        <b-table
          v-else
          striped
          hover
          bordered
          :items="libri"
          :fields="fields"
          primary-key="id"
          responsive="sm"
          class="table-custom-styles"
        >
          <template #cell(disponibile)="data">
            <i :class="['bi', data.item.disponibile ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger']"></i>
          </template>
          <template #cell(actions)="row">
            <b-button size="sm" variant="danger" @click="confirmDelete(row.item.id)" class="rounded-pill delete-button">
              Elimina
            </b-button>
          </template>
        </b-table>
      </b-card>
    </b-card>

    <!-- Modale di conferma eliminazione -->
    <b-modal id="delete-modal" title="Conferma Eliminazione" @ok="deleteLibro" ok-title="Elimina" cancel-title="Annulla" ok-variant="danger">
      Sei sicuro di voler eliminare il libro con ID <strong>{{ libroToDeleteId }}</strong>? Questa azione è irreversibile.
    </b-modal>
  </b-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  BCol,
  BTable,
  BSpinner,
  BModal
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

const libri = ref<Libro[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const newLibro = ref<Libro>({
  titolo: '',
  autore: '',
  annoPubblicazione: null as any, // Cast a any per permettere null iniziale, poi number
  genere: '',
  disponibile: true,
  prezzo: null as any // Cast a any per permettere null iniziale, poi number
});

const showAlert = ref<boolean>(false);
const alertMessage = ref<string>('');
const alertVariant = ref<AlertVariant>('info');

const libroToDeleteId = ref<number | null>(null);

const fields = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'titolo', label: 'Titolo', sortable: true },
  { key: 'autore', label: 'Autore', sortable: true },
  { key: 'annoPubblicazione', label: 'Anno Pubblicazione', sortable: true },
  { key: 'genere', label: 'Genere', sortable: true },
  { key: 'disponibile', label: 'Disponibile', sortable: true }, // Questa colonna userà lo slot personalizzato
  { key: 'prezzo', label: 'Prezzo', sortable: true },
  { key: 'actions', label: 'Azioni' }
];

const fetchLibri = async () => {
  loading.value = true;
  error.value = null;
  try {
    libri.value = await LibroService.getAllLibri();
  } catch (err: any) {
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
    await fetchLibri();
  } catch (err: any) {
    showAlertMessage('Errore durante l\'aggiunta del libro!', 'danger');
    console.error('Errore aggiunta libro:', err);
  }
};

const confirmDelete = (id: number) => {
  libroToDeleteId.value = id;
  const modalElement = document.getElementById('delete-modal');
  if (modalElement && (modalElement as any)._vue_modal && typeof (modalElement as any)._vue_modal.show === 'function') {
    (modalElement as any)._vue_modal.show();
  } else {
    if (confirm(`Sei sicuro di voler eliminare il libro con ID ${id}?`)) {
      deleteLibro();
    }
  }
};


const deleteLibro = async () => {
  if (libroToDeleteId.value) {
    try {
      const message = await LibroService.deleteLibro(libroToDeleteId.value);
      showAlertMessage(message, 'success');
      await fetchLibri();
    } catch (err: any) {
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

onMounted(() => {
  fetchLibri();
});
</script>

<style scoped>
/* Rimosso py-5 da qui, il padding è gestito da App.vue */
.py-5 {
  /* Questo selettore non dovrebbe più essere necessario se py-5 è rimosso dal template */
}

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
  padding: 3rem !important; /* Più padding su schermi medi e grandi */
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

.add-book-button, .delete-button {
  transition: all 0.3s ease;
  font-weight: bold;
}

.add-book-button:hover, .delete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.table-custom-styles {
  font-size: 0.95rem; /* Testo della tabella leggermente più piccolo */
}

.table-custom-styles th {
  background-color: #f0f2f5; /* Sfondo per gli header della tabella */
  color: #343a40;
  border-bottom: 2px solid #dee2e6;
}

.table-custom-styles td {
  vertical-align: middle; /* Allinea il contenuto delle celle al centro */
}

/* Stili per le icone di disponibilità */
.bi-check-circle-fill {
  color: #28a745; /* Verde Bootstrap */
}
.bi-x-circle-fill {
  color: #dc3545; /* Rosso Bootstrap */
}
</style>
