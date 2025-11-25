'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANTE: NO MODIFICAR ESTA FUNCIÓN
export function initializeFirebase() {
  if (!getApps().length) {
    // ¡Importante! initializeApp() se llama sin argumentos porque Firebase App Hosting
    // se integra con la función initializeApp() para proporcionar las variables de entorno necesarias para
    // poblar las FirebaseOptions en producción. Es crítico que intentemos llamar a initializeApp()
    // sin argumentos.
    let firebaseApp;
    try {
      // Intenta inicializar a través de las variables de entorno de Firebase App Hosting
      firebaseApp = initializeApp();
    } catch (e) {
      // Solo advertir en producción porque es normal usar firebaseConfig para inicializar
      // durante el desarrollo
      if (process.env.NODE_ENV === "production") {
        console.warn('La inicialización automática falló. Se recurrirá al objeto de configuración de Firebase.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // Si ya está inicializado, devuelve los SDKs con la App ya inicializada
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
