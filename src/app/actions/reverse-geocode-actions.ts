'use server';

import { reverseGeocodeCoordinates, type ReverseGeocodeInput, type ReverseGeocodeOutput } from "@/ai/flows/reverse-geocode-flow";

/**
 * Esta es una Server Action que envuelve el flujo de Genkit para la geocodificación inversa.
 * Puede ser llamada de forma segura desde los Client Components.
 * @param input Las coordenadas a geocodificar.
 * @returns Una promesa que se resuelve con la dirección estructurada.
 */
export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> {
    return reverseGeocodeCoordinates(input);
}
