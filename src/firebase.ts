import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ╔══════════════════════════════════════════════════════════════╗
// ║  INSTRUCTIONS POUR CONFIGURER FIREBASE                      ║
// ║                                                              ║
// ║  1. Allez sur https://console.firebase.google.com            ║
// ║  2. Créez un nouveau projet (gratuit)                        ║
// ║  3. Allez dans "Paramètres du projet" > "Général"            ║
// ║  4. Ajoutez une application Web                              ║
// ║  5. Copiez les valeurs de firebaseConfig ci-dessous          ║
// ║  6. Allez dans "Firestore Database" et créez une base        ║
// ║     en mode TEST (pour commencer)                            ║
// ║                                                              ║
// ║  Remplacez les valeurs "VOTRE_..." par vos vraies valeurs    ║
// ╚══════════════════════════════════════════════════════════════╝

const firebaseConfig = {
  apiKey: "AIzaSyCkQxF_bSbURWpQBxD5bu9VIck_Qe_cc14",
  authDomain: "site-f477e.firebaseapp.com",
  projectId: "site-f477e",
  storageBucket: "site-f477e.firebasestorage.app",
  messagingSenderId: "730419252381",
  appId: "1:730419252381:web:7a1875aa950187c94cd874",
  measurementId: "G-1JEC7WBMWM"
};

// Détecte si Firebase est configuré ou non
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith('VOTRE_');

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.error('Firebase init error:', e);
  }
}

export { db };
export default app;
