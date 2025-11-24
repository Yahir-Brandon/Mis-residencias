'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Tipo de utilidad para agregar un campo 'id' a un tipo T dado. */
export type WithId<T> = T & { id: string };

/**
 * Interfaz para el valor de retorno del gancho useCollection.
 * @template T Tipo de los datos del documento.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Datos del documento con ID, o null.
  isLoading: boolean;       // Verdadero si está cargando.
  error: FirestoreError | Error | null; // Objeto de error, o null.
}

/* Implementación interna de Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * Gancho de React para suscribirse a una colección o consulta de Firestore en tiempo real.
 * Maneja referencias/consultas nulas.
 * 
 *
 * ¡IMPORTANTE! DEBES MEMOIZAR el memoizedTargetRefOrQuery de entrada o sucederán COSAS MALAS
 * usa useMemo para memoizarlo según la guía de React. También asegúrate de que sus dependencias sean estables
 * referencias
 *  
 * @template T Tipo opcional para los datos del documento. Por defecto es any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * La CollectionReference o Query de Firestore. Espera si es null/undefined.
 * @returns {UseCollectionResult<T>} Objeto con datos, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Usa directamente memoizedTargetRefOrQuery ya que se asume que es la consulta final
    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        // Esta lógica extrae la ruta de una referencia o una consulta
        const path: string =
          memoizedTargetRefOrQuery.type === 'collection'
            ? (memoizedTargetRefOrQuery as CollectionReference).path
            : (memoizedTargetRefOrQuery as unknown as InternalQuery)._query.path.canonicalString()

        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // desencadena la propagación global de errores
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]); // Vuelve a ejecutar si la consulta/referencia de destino cambia.
  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error(memoizedTargetRefOrQuery + ' no fue correctamente memoizado usando useMemoFirebase');
  }
  return { data, isLoading, error };
}
