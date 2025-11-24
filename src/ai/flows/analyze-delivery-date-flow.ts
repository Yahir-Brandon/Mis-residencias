'use server';
/**
 * @fileOverview Flow de IA para analizar la prioridad de las fechas de entrega.
 *
 * - analyzeDeliveryDate - Una función que determina la urgencia de un pedido.
 * - AnalyzeDeliveryDateInput - El tipo de entrada para la función.
 * - AnalyzeDeliveryDateOutput - El tipo de retorno para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeDeliveryDateInputSchema = z.object({
  startDate: z.string().describe('La fecha de inicio de la entrega en formato ISO string.'),
  endDate: z.string().describe('La fecha de fin de la entrega en formato ISO string.'),
});
export type AnalyzeDeliveryDateInput = z.infer<typeof AnalyzeDeliveryDateInputSchema>;

const AnalyzeDeliveryDateOutputSchema = z.object({
  priority: z
    .enum(['Urgente', 'Pronto', 'Normal'])
    .describe('La prioridad del pedido basada en las fechas de entrega.'),
});
export type AnalyzeDeliveryDateOutput = z.infer<
  typeof AnalyzeDeliveryDateOutputSchema
>;

export async function analyzeDeliveryDate(
  input: AnalyzeDeliveryDateInput
): Promise<AnalyzeDeliveryDateOutput> {
  return analyzeDeliveryDateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDeliveryDatePrompt',
  input: { schema: AnalyzeDeliveryDateInputSchema },
  output: { schema: AnalyzeDeliveryDateOutputSchema },
  prompt: `Eres un asistente de logística. Tu tarea es determinar la prioridad de un pedido basándote en la fecha de inicio de entrega. La fecha y hora actual es ${new Date().toISOString()}.

Fecha de inicio del pedido: {{{startDate}}}

Clasifica la prioridad de la siguiente manera:
- "Urgente": Si la fecha de inicio es dentro de los próximos 3 días.
- "Pronto": Si la fecha de inicio es entre 4 y 7 días a partir de ahora.
- "Normal": Si la fecha de inicio es más de 7 días en el futuro.

Responde únicamente con la clasificación de prioridad.`,
});

const analyzeDeliveryDateFlow = ai.defineFlow(
  {
    name: 'analyzeDeliveryDateFlow',
    inputSchema: AnalyzeDeliveryDateInputSchema,
    outputSchema: AnalyzeDeliveryDateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
