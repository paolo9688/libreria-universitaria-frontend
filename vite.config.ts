// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url' // Importa questi per la risoluzione dei percorsi

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      // Aggiungi questa riga per definire l'alias @/
      // Questo dice a Vite che "@/" punta alla cartella "src/" del tuo progetto.
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

