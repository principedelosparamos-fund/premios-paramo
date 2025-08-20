// src/lib/firebase.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ PRUEBA CONTROLADA: valores literales (del snippet oficial)
const config = {
  apiKey: "AIzaSyBp2bEoUGYUZ_oz4TZXMVeHUiq-w76LFEo",
  authDomain: "premios-paramo-938eb.firebaseapp.com",
  projectId: "premios-paramo-938eb",
  storageBucket: "premios-paramo-938eb.firebasestorage.app",
  messagingSenderId: "298114311534",
  appId: "1:298114311534:web:43f7c9f3b9b62565c5cd7f",
  measurementId: "G-H3YP0KL2K4",
};

// Log temporal para confirmar que llegan literales
if (typeof window !== 'undefined') {
  console.log('[firebase][client][FORCED]', {
    apiKey: config.apiKey.slice(0, 6) + '...',
    authDomain: config.authDomain,
    projectId: config.projectId,
  });
}

const app = getApps().length ? getApp() : initializeApp(config);

export const auth = getAuth(app);
export const db = getFirestore(app);
