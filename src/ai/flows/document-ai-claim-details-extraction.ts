'use server';
/**
 * @fileOverview Extracts claim details from uploaded documents using OCR and NLP.
 *
 * - extractClaimDetails - Extracts information from documents to pre-fill claim form fields.
 * - ExtractClaimDetailsInput - The input type for the extractClaimDetails function.
 * - ExtractClaimDetailsOutput - The return type for the extractClaimDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractClaimDetailsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (e.g., invoice, accident report) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' for the document."
    ),
});
export type ExtractClaimDetailsInput = z.infer<typeof ExtractClaimDetailsInputSchema>;

const ExtractClaimDetailsOutputSchema = z.object({
  claimDetails: z.object({
    name: z.string().optional().describe('The claimant name.'),
    policyNumber: z.string().optional().describe('The policy number associated with the claim.'),
    dateOfIncident: z.string().optional().describe('The date when the incident occurred.'),
    description: z.string().optional().describe('A description of the incident.'),
    amountClaimed: z.number().optional().describe('The amount being claimed.'),
  }).describe('Extracted claim details.'),
});
export type ExtractClaimDetailsOutput = z.infer<typeof ExtractClaimDetailsOutputSchema>;

export async function extractClaimDetails(input: ExtractClaimDetailsInput): Promise<ExtractClaimDetailsOutput> {
  return extractClaimDetailsFlow(input);
}

const extractClaimDetailsPrompt = ai.definePrompt({
  name: 'extractClaimDetailsPrompt',
  input: {schema: ExtractClaimDetailsInputSchema},
  output: {schema: ExtractClaimDetailsOutputSchema},
  prompt: `You are an AI assistant tasked with extracting claim details from documents.

  Analyze the provided document and extract the following information:
  - Claimant Name
  - Policy Number
  - Date of Incident
  - Description of Incident
  - Amount Claimed

  Document: {{media url=documentDataUri}}

  Provide the extracted information in the following JSON format:
  {{$instructions=ExtractClaimDetailsOutputSchema}}`,
});

const extractClaimDetailsFlow = ai.defineFlow(
  {
    name: 'extractClaimDetailsFlow',
    inputSchema: ExtractClaimDetailsInputSchema,
    outputSchema: ExtractClaimDetailsOutputSchema,
  },
  async input => {
    const {output} = await extractClaimDetailsPrompt(input);
    return output!;
  }
);
