'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Tipo de utilidad para agregar un campo 'id' a un tipo T dado. */
type WithId<T> = T & { id: string };

/**
 * Interfaz para el valor de retorno del gancho useDoc.
 * @template T Tipo de los datos del documento.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Datos del documento con ID, o null.
  isLoading: boolean;       // Verdadero si está cargando.
  error: FirestoreError | Error | null; // Objeto de error, o null.
}

/**
 * Gancho de React para suscribirse a un único documento de Firestore en tiempo real.
 * Maneja referencias nulas.
 * 
 * ¡IMPORTANTE! DEBES MEMOIZAR el docRef de entrada o sucederán COSAS MALAS.
 * Usa useMemo para memoizarlo según la guía de React. También asegúrate de que sus dependencias sean estables.
 *
 *
 * @template T Tipo opcional para los datos del documento. Por defecto es any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * La DocumentReference de Firestore. Espera si es null/undefined.
 * @returns {UseDocResult<T>} Objeto con datos, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: DocumentReference<DocumentData> | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    // Opcional: setData(null); // Limpia los datos anteriores al instante

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          // El documento no existe
          setData(null);
        }
        setError(null); // Limpia cualquier error anterior en una instantánea exitosa (incluso si el documento no existe)
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // desencadena la propagación global de errores
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]); // Vuelve a ejecutar si memoizedDocRef cambia.

  return { data, isLoading, error };
}
