'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Estado interno para la autenticación del usuario
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Estado combinado para el contexto de Firebase
export interface FirebaseContextState {
  areServicesAvailable: boolean; // Verdadero si los servicios principales (app, firestore, instancia de auth) son proporcionados
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // La instancia del servicio de Auth
  // Estado de autenticación del usuario
  user: User | null;
  isUserLoading: boolean; // Verdadero durante la verificación inicial de autenticación
  userError: Error | null; // Error del listener de autenticación
}

// Tipo de retorno para useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Tipo de retorno para useUser() - específico del estado de autenticación del usuario
export interface UserHookResult { 
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Contexto de React
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider gestiona y proporciona los servicios de Firebase y el estado de autenticación del usuario.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Comienza cargando hasta el primer evento de autenticación
    userError: null,
  });

  // Efecto para suscribirse a los cambios de estado de autenticación de Firebase
  useEffect(() => {
    if (!auth) { // Si no hay instancia del servicio de Auth, no se puede determinar el estado del usuario
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Servicio de autenticación no proporcionado.") });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null }); // Reinicia al cambiar la instancia de auth

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => { // Estado de autenticación determinado
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => { // Error del listener de autenticación
        console.error("FirebaseProvider: error en onAuthStateChanged:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe(); // Limpieza
  }, [auth]); // Depende de la instancia de auth

  // Memoiza el valor del contexto
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook para acceder a los servicios principales de Firebase y al estado de autenticación del usuario.
 * Lanza un error si los servicios principales no están disponibles o si se usa fuera del proveedor.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase debe ser usado dentro de un FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Los servicios principales de Firebase no están disponibles. Revisa las props de FirebaseProvider.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook para acceder a la instancia de Firebase Auth. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook para acceder a la instancia de Firestore. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook para acceder a la instancia de Firebase App. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook específico para acceder al estado del usuario autenticado.
 * Proporciona el objeto User, el estado de carga y cualquier error de autenticación.
 * @returns {UserHookResult} Objeto con user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase(); // Aprovecha el hook principal
  return { user, isUserLoading, userError };
};
