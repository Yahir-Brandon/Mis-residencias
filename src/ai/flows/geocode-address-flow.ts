/**
 * @fileOverview Flujo y herramienta de IA para la geocodificación de direcciones utilizando la API de Google Maps.
 *
 * - geocodeAddress - Una función que convierte una dirección de texto en coordenadas geográficas.
 * - GeocodeAddressInputSchema - El esquema de entrada para la función.
 * - GeocodeAddressOutputSchema - El esquema de salida para la función.
 * - geocodeAddressTool - Una herramienta de Genkit que expone la funcionalidad de geocodificación.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GeocodeAddressInputSchema = z.object({
  address: z.string().describe('La dirección de calle a geocodificar.'),
});
export type GeocodeAddressInput = z.infer<typeof GeocodeAddressInputSchema>;

export const GeocodeAddressOutputSchema = z.object({
  lat: z.number().describe('La latitud de la dirección.'),
  lng: z.number().describe('La longitud de la dirección.'),
});
export type GeocodeAddressOutput = z.infer<typeof GeocodeAddressOutputSchema>;

/**
 * Convierte una dirección de texto en coordenadas geográficas.
 * @param input Un objeto que contiene la dirección a geocodificar.
 * @returns Una promesa que se resuelve con las coordenadas de latitud y longitud.
 */
export async function geocodeAddress(
  input: GeocodeAddressInput
): Promise<GeocodeAddressOutput> {
  'use server';
  return geocodeAddressFlow(input);
}

// Define la herramienta de Genkit para la geocodificación
export const geocodeAddressTool = ai.defineTool(
  {
    name: 'geocodeAddress',
    description: 'Obtiene las coordenadas de latitud y longitud para una dirección de calle dada.',
    inputSchema: GeocodeAddressInputSchema,
    outputSchema: GeocodeAddressOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('La clave de API de Google Maps no está configurada en las variables de entorno.');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      input.address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Geocoding API response:', data);
      throw new Error(`La geocodificación falló con el estado: ${data.status}. ${data.error_message || ''}`);
    }

    return data.results[0].geometry.location;
  }
);


// Define el flujo de Genkit que utiliza la herramienta de geocodificación.
const geocodeAddressFlow = ai.defineFlow(
  {
    name: 'geocodeAddressFlow',
    inputSchema: GeocodeAddressInputSchema,
    outputSchema: GeocodeAddressOutputSchema,
  },
  async (input) => {
    // Llama directamente a la implementación de la herramienta.
    return geocodeAddressTool(input);
  }
);
