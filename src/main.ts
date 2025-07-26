import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Importa il CSS di Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
// Importa il CSS di BootstrapVue
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// *** MODIFICA QUI: Importa 'createBootstrap' da 'bootstrap-vue-next' ***
import { createBootstrap } from 'bootstrap-vue-next'

const app = createApp(App)

// Usa la funzione createBootstrap per registrare i componenti globalmente
app.use(createBootstrap()) // Chiamiamo la funzione createBootstrap

app.mount('#app')
