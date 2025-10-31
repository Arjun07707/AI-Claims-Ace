'use server';

/**
 * @fileOverview Generates AI summaries for claim status updates.
 *
 * - generateClaimUpdate - A function that generates a summary of a claim's status.
 * - GenerateClaimUpdateInput - The input type for the generateClaimUpdate function.
 * - GenerateClaimUpdateOutput - The return type for the generateClaimUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClaimUpdateInputSchema = z.object({
  claimStatus: z.string().describe('The current status of the claim.'),
  claimDetails: z.string().describe('Detailed information about the claim.'),
});
export type GenerateClaimUpdateInput = z.infer<typeof GenerateClaimUpdateInputSchema>;

const GenerateClaimUpdateOutputSchema = z.object({
  progress: z.string().describe('A one-sentence summary of the current claim status.'),
});
export type GenerateClaimUpdateOutput = z.infer<typeof GenerateClaimUpdateOutputSchema>;

export async function generateClaimUpdate(input: GenerateClaimUpdateInput): Promise<GenerateClaimUpdateOutput> {
  return generateClaimUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateClaimUpdatePrompt',
  input: {schema: GenerateClaimUpdateInputSchema},
  output: {schema: GenerateClaimUpdateOutputSchema},
  prompt: `You are an AI assistant summarizing claim status updates for users.\n\nGiven the following claim status and details, generate a concise one-sentence summary of the current status for the user.\n\nClaim Status: {{{claimStatus}}}\nClaim Details: {{{claimDetails}}}\n\nSummary:`,
});

const generateClaimUpdateFlow = ai.defineFlow(
  {
    name: 'generateClaimUpdateFlow',
    inputSchema: GenerateClaimUpdateInputSchema,
    outputSchema: GenerateClaimUpdateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      progress: output?.progress ?? 'The claim status is currently under review.',
    };
  }
);
