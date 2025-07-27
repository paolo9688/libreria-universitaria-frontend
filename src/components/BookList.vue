<!-- src/components/BookList.vue -->
<template>
  <b-container class="py-4">
    <b-card title="Lista dei Libri Attuali" class="text-center shadow-lg p-3 mb-5 bg-white rounded-lg">
      <b-card-text class="lead text-muted mb-4">
        Visualizza tutti i libri presenti nel database.
      </b-card-text>

      <!-- Pulsante per tornare alla gestione libri -->
      <div class="text-center mb-5">
        <b-button variant="secondary" @click="goToManageBooks" class="rounded-pill back-button">
          Torna a Gestione Libri
        </b-button>
      </div>

      <!-- Sezione per la Lista dei Libri -->
      <b-card class="text-left shadow-sm rounded-lg">
        <div v-if="loading" class="text-center my-4">
          <b-spinner label="Caricamento..." variant="primary"></b-spinner>
          <p class="mt-2 text-muted">Caricamento libri...</p>
        </div>
        <div v-else-if="error" class="text-center my-4 text-danger">
          <p>Errore durante il caricamento dei libri: {{ error }}</p>
          <b-button variant="warning" @click="fetchLibri" class="rounded-pill">Riprova</b-button>
        </div>
        <div v-else-if="libri.length === 0" class="text-center my-4 text-muted">
          <p>Nessun libro trovato. Aggiungine uno dalla pagina di gestione!</p>
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
            <b-button
              size="sm"
              variant="danger"
              @click="row.item.id !== undefined ? confirmDelete(row.item.id) : null"
              class="rounded-pill delete-button"
            >
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
  </b-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import LibroService from '@/services/LibroService';

import {
  BContainer,
  BCard,
  BCardText,
  BButton,
  BAlert,
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
  { key: 'disponibile', label: 'Disponibile', sortable: true },
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
      await fetchLibri(); // Ricarica la lista dopo l'eliminazione
    } catch (err: any) {
      showAlertMessage('Errore durante l\'eliminazione del libro!', 'danger');
      console.error('Errore eliminazione libro:', err);
    } finally {
      libroToDeleteId.value = null;
    }
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

// Emette un evento per navigare alla pagina di gestione libri
const emit = defineEmits(['goToManageBooks']);
const goToManageBooks = () => {
  emit('goToManageBooks');
};

onMounted(() => {
  fetchLibri(); // Carica i libri all'apertura di questa pagina
});
</script>

<style scoped>
.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
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

.delete-button, .back-button {
  transition: all 0.3s ease;
  font-weight: bold;
}

.delete-button:hover, .back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.table-custom-styles {
  font-size: 0.95rem;
}

.table-custom-styles th {
  background-color: #f0f2f5;
  color: #343a40;
  border-bottom: 2px solid #dee2e6;
}

.table-custom-styles td {
  vertical-align: middle;
}

.bi-check-circle-fill {
  color: #28a745;
}
.bi-x-circle-fill {
  color: #dc3545;
}
</style>
