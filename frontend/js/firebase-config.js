/**
 * Configuração e Inicialização do Firebase v10 (ESM Web SDK)
 * Camada 3: Execução
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configuração do Firebase conforme arquivo .env do BurguerSync
const firebaseConfig = {
  apiKey: "AIzaSyD4jfwsCKrOOJoUiY2jQmnyd7fNXTKY_Fg",
  authDomain: "burguersync.firebaseapp.com",
  projectId: "burguersync",
  storageBucket: "burguersync.firebasestorage.app",
  messagingSenderId: "85820651078",
  appId: "1:85820651078:web:61d6022b3a70b0118dbc47"
};

// Inicializa a aplicação Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { 
  app, 
  db, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy 
};
