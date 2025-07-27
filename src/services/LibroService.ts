// src/services/LibroService.ts
import axios from 'axios';
import AuthService from './AuthService'; // Importa il nuovo AuthService

// Definizione dell'interfaccia per l'entità Libro
interface Libro {
  id?: number;
  titolo: string;
  autore: string;
  annoPubblicazione: number;
  genere: string;
  disponibile: boolean;
  prezzo: number;
}

const API_BASE_URL = 'http://localhost:8080/api/libri';

// Crea un'istanza di Axios personalizzata per le richieste ai libri
const axiosInstance = axios.create(); // <--- Questa è l'istanza corretta

// Aggiungi un interceptor per le richieste
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Interceptor Axios: Richiesta in uscita:', config.url);
    const token = AuthService.getToken();
    console.log('Interceptor Axios: Token recuperato:', token ? 'Presente' : 'Assente');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor Axios: Header Authorization aggiunto.');
    } else {
      console.log('Interceptor Axios: Nessun token trovato, header Authorization NON aggiunto.');
    }
    return config;
  },
  (error) => {
    console.error('Interceptor Axios: Errore nella richiesta:', error);
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
      // *** MODIFICA QUI: Usa axiosInstance.get invece di axios.get ***
      const response = await axiosInstance.get<Libro[]>(`${API_BASE_URL}/find-all-libri`);
      return response.data;
    } catch (error) {
      console.error('Errore durante il recupero dei libri:', error);
      throw error;
    }
  },

  /**
   * Aggiunge un nuovo libro al backend.
   * @param {Libro} libro - L'oggetto libro da aggiungere.
   * @returns {Promise<Libro>} Una Promise che si risolve con il libro aggiunto.
   */
  addLibro: async (libro: Libro): Promise<Libro> => {
    try {
      // *** MODIFICA QUI: Usa axiosInstance.post invece di axios.post ***
      const response = await axiosInstance.post<Libro>(`${API_BASE_URL}/create-libro`, libro);
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
      // *** MODIFICA QUI: Usa axiosInstance.delete invece di axios.delete ***
      const response = await axiosInstance.delete<string>(`${API_BASE_URL}/delete-libro/${id}`);
      return response.data;
    } catch (error) {
      console.error('Errore durante l\'eliminazione del libro:', error);
      throw error;
    }
  }
};

export default LibroService;
