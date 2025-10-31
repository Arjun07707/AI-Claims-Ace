'use server';

/**
 * @fileOverview Implements an AI flow to detect potentially fraudulent or inconsistent claims.
 *
 * - detectFraudulentClaim - A function that analyzes claim data and flags potentially fraudulent or inconsistent claims.
 * - DetectFraudulentClaimInput - The input type for the detectFraudulentClaim function.
 * - DetectFraudulentClaimOutput - The return type for the detectFraudulentClaim function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFraudulentClaimInputSchema = z.object({
  claimDetails: z
    .string()
    .describe('The details of the claim, including personal information, claim description, and any supporting evidence.'),
  supportingDocuments: z
    .string()
    .describe(
      'Optional: A data URI containing supporting documents or images related to the claim. Must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected description
    )
    .optional(),
});

export type DetectFraudulentClaimInput = z.infer<typeof DetectFraudulentClaimInputSchema>;

const DetectFraudulentClaimOutputSchema = z.object({
  isFraudulent: z.boolean().describe('Whether the claim is potentially fraudulent or inconsistent.'),
  fraudExplanation: z
    .string()
    .describe('An explanation of why the claim is considered potentially fraudulent.'),
  confidenceScore: z.number().describe('A score indicating the confidence level of the fraud detection.'),
});

export type DetectFraudulentClaimOutput = z.infer<typeof DetectFraudulentClaimOutputSchema>;

export async function detectFraudulentClaim(
  input: DetectFraudulentClaimInput
): Promise<DetectFraudulentClaimOutput> {
  return detectFraudulentClaimFlow(input);
}

const detectFraudulentClaimPrompt = ai.definePrompt({
  name: 'detectFraudulentClaimPrompt',
  input: {schema: DetectFraudulentClaimInputSchema},
  output: {schema: DetectFraudulentClaimOutputSchema},
  prompt: `You are an AI expert in detecting fraudulent insurance claims. Analyze the claim details and supporting documents to determine if the claim is potentially fraudulent or inconsistent.

Claim Details: {{{claimDetails}}}

Supporting Documents: {{#if supportingDocuments}}{{media url=supportingDocuments}}{{else}}None{{/if}}

Determine if the claim is fraudulent and provide an explanation. Also, provide a confidence score between 0 and 1.

Output in JSON format.
`,
});

const detectFraudulentClaimFlow = ai.defineFlow(
  {
    name: 'detectFraudulentClaimFlow',
    inputSchema: DetectFraudulentClaimInputSchema,
    outputSchema: DetectFraudulentClaimOutputSchema,
  },
  async input => {
    const {output} = await detectFraudulentClaimPrompt(input);
    return output!;
  }
);
