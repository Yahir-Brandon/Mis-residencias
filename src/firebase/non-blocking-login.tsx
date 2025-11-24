'use client';
import {
  Auth, // Importa el tipo Auth para las sugerencias de tipo
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Asume que getAuth y app se inicializan en otro lugar
} from 'firebase/auth';

/** Inicia el inicio de sesión anónimo (no bloqueante). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRÍTICO: Llama a signInAnonymously directamente. NO uses 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // El código continúa inmediatamente. El cambio de estado de autenticación es manejado por el listener onAuthStateChanged.
}

/** Inicia el registro con correo electrónico/contraseña (no bloqueante). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRÍTICO: Llama a createUserWithEmailAndPassword directamente. NO uses 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password);
  // El código continúa inmediatamente. El cambio de estado de autenticación es manejado por el listener onAuthStateChanged.
}

/** Inicia el inicio de sesión con correo electrónico/contraseña (no bloqueante). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRÍTICO: Llama a signInWithEmailAndPassword directamente. NO uses 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password);
  // El código continúa inmediatamente. El cambio de estado de autenticación es manejado por el listener onAuthStateChanged.
}
