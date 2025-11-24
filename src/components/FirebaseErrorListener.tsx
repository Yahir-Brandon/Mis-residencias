'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Un componente invisible que escucha eventos 'permission-error' emitidos globalmente.
 * Lanza cualquier error recibido para ser capturado por global-error.tsx de Next.js.
 */
export function FirebaseErrorListener() {
  // Usa el tipo de error específico para el estado para mayor seguridad de tipos.
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // El callback ahora espera un error fuertemente tipado, que coincide con el payload del evento.
    const handleError = (error: FirestorePermissionError) => {
      // Establece el error en el estado para desencadenar una nueva renderización.
      setError(error);
    };

    // El emisor tipado forzará que el callback para 'permission-error'
    // coincida con el tipo de payload esperado (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Anula la suscripción al desmontar para evitar fugas de memoria.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // En la nueva renderización, si existe un error en el estado, lo lanza.
  if (error) {
    throw error;
  }

  // Este componente no renderiza nada.
  return null;
}
