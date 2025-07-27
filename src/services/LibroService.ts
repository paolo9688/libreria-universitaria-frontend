// src/services/LibroService.ts
import axios from 'axios';
import AuthService from './AuthService'; // Importa il nuovo AuthService

// Definizione dell'interfaccia per l'entità Libro (deve corrispondere al tuo modello Spring Boot)
interface Libro {
  id?: number; // L'ID è opzionale perché non esiste quando si crea un nuovo libro
  titolo: string;
  autore: string;
  annoPubblicazione: number;
  genere: string;
  disponibile: boolean;
  prezzo: number;
}

// URL base del tuo backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/libri'; // Assicurati che questo corrisponda al tuo backend

// Crea un'istanza di Axios personalizzata per le richieste ai libri
const axiosInstance = axios.create();

// Aggiungi un interceptor per le richieste
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Interceptor Axios: Richiesta in uscita:', config.url); // Log dell'URL della richiesta
    const token = AuthService.getToken(); // Recupera il token
    console.log('Interceptor Axios: Token recuperato:', token ? 'Presente' : 'Assente'); // Log se il token è presente o assente

    if (token) {
      // Aggiungi il token all'header Authorization
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor Axios: Header Authorization aggiunto.'); // Log se l'header è stato aggiunto
    } else {
      console.log('Interceptor Axios: Nessun token trovato, header Authorization NON aggiunto.');
    }
    return config;
  },
  (error) => {
    console.error('Interceptor Axios: Errore nella richiesta:', error); // Log errori nell'interceptor
    return Promise.reject(error);
  }
);

const LibroService = {
  /**
   * Recupera tutti i libri dal backend.
   * @returns {Promise<Libro[]>} Una Promise che si risolve con la lista dei libri.
   */
  getAllLibri: async (): Promise<Libro[]> => {
    try {
      const response = await axios.get<Libro[]>(`${API_BASE_URL}/find-all-libri`);
      return response.data;
    } catch (error) {
      console.error('Errore durante il recupero dei libri:', error);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  },

  /**
   * Aggiunge un nuovo libro al backend.
   * @param {Libro} libro - L'oggetto libro da aggiungere.
   * @returns {Promise<Libro>} Una Promise che si risolve con il libro aggiunto.
   */
  addLibro: async (libro: Libro): Promise<Libro> => {
    try {
      const response = await axios.post<Libro>(`${API_BASE_URL}/create-libro`, libro);
      return response.data;
    } catch (error) {
      console.error('Errore durante l\'aggiunta del libro:', error);
      throw error;
    }
  },

  /**
   * Elimina un libro dal backend tramite ID.
   * @param {number} id - L'ID del libro da eliminare.
   * @returns {Promise<string>} Una Promise che si risolve con un messaggio di successo.
   */
  deleteLibro: async (id: number): Promise<string> => {
    try {
      const response = await axios.delete<string>(`${API_BASE_URL}/delete-libro/${id}`);
      return response.data;
    } catch (error) {
      console.error('Errore durante l\'eliminazione del libro:', error);
      throw error;
    }
  }
};

export default LibroService;
