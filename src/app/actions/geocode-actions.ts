'use server';

import { geocodeAddressFlow, type GeocodeAddressInput, type GeocodeAddressOutput } from "@/ai/flows/geocode-address-flow";

/**
 * Esta es una Server Action que envuelve el flujo de Genkit para la geocodificación.
 * Puede ser llamada de forma segura desde los Client Components.
 * @param input La dirección a geocodificar.
 * @returns Una promesa que se resuelve con las coordenadas de latitud y longitud.
 */
export async function geocodeAddress(input: GeocodeAddressInput): Promise<GeocodeAddressOutput> {
    return geocodeAddressFlow(input);
}
