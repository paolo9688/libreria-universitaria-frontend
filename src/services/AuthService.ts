// src/services/AuthService.ts
import axios from 'axios';

// Interfaccia per i dati di registrazione dell'utente
interface RegisterRequest {
  nome: string;
  cognome: string;
  indirizzo: string;
  email: string;
  password: string;
}

// Interfaccia per i dati di login
interface LoginRequest {
  email: string;
  password: string;
}

// Interfaccia per la risposta di login (contiene il token JWT)
interface LoginResponse {
  jwt: string;
}

// Interfaccia per l'utente registrato (senza password)
interface RegisteredUser {
  id: number;
  nome: string;
  cognome: string;
  indirizzo: string;
  email: string;
}

// URL base per gli endpoint di autenticazione
const AUTH_API_BASE_URL = 'http://localhost:8080/api/utenti';
const TOKEN_KEY = 'jwt_token'; // Chiave per salvare il token in localStorage

const AuthService = {
  /**
   * Registra un nuovo utente.
   * @param {RegisterRequest} userData - Dati dell'utente per la registrazione.
   * @returns {Promise<RegisteredUser>} Una Promise che si risolve con i dettagli dell'utente registrato.
   */
  register: async (userData: RegisterRequest): Promise<RegisteredUser> => {
    try {
      const response = await axios.post<RegisteredUser>(`${AUTH_API_BASE_URL}/register-utente`, userData);
      return response.data;
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      throw error;
    }
  },

  /**
   * Effettua il login dell'utente e salva il token JWT.
   * @param {LoginRequest} credentials - Credenziali dell'utente (email e password).
   * @returns {Promise<LoginResponse>} Una Promise che si risolve con il token JWT.
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(`${AUTH_API_BASE_URL}/login-utente`, credentials);
      if (response.data.jwt) {
        localStorage.setItem(TOKEN_KEY, response.data.jwt); // Salva il token
      }
      return response.data;
    } catch (error) {
      console.error('Errore durante il login:', error);
      throw error;
    }
  },

  /**
   * Effettua il logout dell'utente rimuovendo il token.
   */
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY); // Rimuove il token
  },

  /**
   * Recupera il token JWT salvato.
   * @returns {string | null} Il token JWT o null se non presente.
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Controlla se l'utente è autenticato (se un token è presente).
   * @returns {boolean} True se il token è presente, false altrimenti.
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export default AuthService;
