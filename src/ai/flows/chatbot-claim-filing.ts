'use server';
/**
 * @fileOverview AI chatbot flow for filing insurance claims.
 *
 * - fileClaimChatbot - A function that initiates the claim filing process via a chatbot.
 * - ChatbotClaimFilingInput - The input type for the fileClaimChatbot function.
 * - ChatbotClaimFilingOutput - The return type for the fileClaimChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotClaimFilingInputSchema = z.object({
  userQuery: z.string().describe('The user input describing the claim issue in natural language.'),
});

export type ChatbotClaimFilingInput = z.infer<typeof ChatbotClaimFilingInputSchema>;

const ChatbotClaimFilingOutputSchema = z.object({
  claimDetails: z
    .object({
      name: z.string().describe('The name of the claimant.'),
      policyNumber: z.string().describe('The policy number of the claimant.'),
      dateOfIncident: z.string().describe('The date when the incident occurred.'),
      damageType: z.string().describe('The type of damage or loss.'),
      description: z.string().describe('A detailed description of the incident.'),
      amount: z.string().describe('The amount of claim requested.'),
    })
    .describe('Extracted claim details from the user input.'),
  intent: z.enum(['file_new_claim', 'check_claim_status', 'request_support']).describe('The intent of the user query.'),
});

export type ChatbotClaimFilingOutput = z.infer<typeof ChatbotClaimFilingOutputSchema>;

export async function fileClaimChatbot(input: ChatbotClaimFilingInput): Promise<ChatbotClaimFilingOutput> {
  return fileClaimChatbotFlow(input);
}

const extractClaimDetailsPrompt = ai.definePrompt({
  name: 'extractClaimDetailsPrompt',
  input: {schema: ChatbotClaimFilingInputSchema},
  output: {schema: ChatbotClaimFilingOutputSchema},
  prompt: `You are an AI assistant designed to extract claim details from user input.

  Given the following user query, extract the key claim details and determine the intent of the user.

  User Query: {{{userQuery}}}

  Return the extracted claim details in JSON format, including name, policy number, date of incident, damage type, description, and amount.
  Also, classify the intent of the user query as either file_new_claim, check_claim_status, or request_support.
  `,
});

const fileClaimChatbotFlow = ai.defineFlow(
  {
    name: 'fileClaimChatbotFlow',
    inputSchema: ChatbotClaimFilingInputSchema,
    outputSchema: ChatbotClaimFilingOutputSchema,
  },
  async input => {
    const {output} = await extractClaimDetailsPrompt(input);
    return output!;
  }
);
