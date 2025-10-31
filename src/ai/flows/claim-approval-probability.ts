'use server';

/**
 * @fileOverview Provides a flow to predict the likelihood of a claim being approved.
 *
 * - predictClaimApprovalProbability - Predicts the approval probability of a claim.
 * - ClaimApprovalProbabilityInput - The input type for the predictClaimApprovalProbability function.
 * - ClaimApprovalProbabilityOutput - The return type for the predictClaimApprovalProbability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClaimApprovalProbabilityInputSchema = z.object({
  claimDetails: z
    .string()
    .describe('The detailed information about the claim submitted by the user.'),
  userProfile: z
    .string()
    .describe('Information about the user submitting the claim, including history.'),
  policyDetails: z.string().describe('The details of the insurance policy.'),
});
export type ClaimApprovalProbabilityInput = z.infer<
  typeof ClaimApprovalProbabilityInputSchema
>;

const ClaimApprovalProbabilityOutputSchema = z.object({
  approvalProbability: z
    .number()
    .describe(
      'The estimated probability (0 to 1) of the claim being approved.'
    ),
  reasons: z.string().describe('The reasons for the predicted probability.'),
});
export type ClaimApprovalProbabilityOutput = z.infer<
  typeof ClaimApprovalProbabilityOutputSchema
>;

export async function predictClaimApprovalProbability(
  input: ClaimApprovalProbabilityInput
): Promise<ClaimApprovalProbabilityOutput> {
  return predictClaimApprovalProbabilityFlow(input);
}

const predictClaimApprovalProbabilityPrompt = ai.definePrompt({
  name: 'predictClaimApprovalProbabilityPrompt',
  input: {schema: ClaimApprovalProbabilityInputSchema},
  output: {schema: ClaimApprovalProbabilityOutputSchema},
  prompt: `You are an AI assistant designed to predict the likelihood of an insurance claim being approved. Based on the claim details, user profile, and policy details provided, estimate the probability of approval and provide reasons for your prediction. Return a number between 0 and 1 for the approvalProbability field. For the reasons field explain why the claim is likely to be approved or rejected.

Claim Details: {{{claimDetails}}}
User Profile: {{{userProfile}}}
Policy Details: {{{policyDetails}}}`,
});

const predictClaimApprovalProbabilityFlow = ai.defineFlow(
  {
    name: 'predictClaimApprovalProbabilityFlow',
    inputSchema: ClaimApprovalProbabilityInputSchema,
    outputSchema: ClaimApprovalProbabilityOutputSchema,
  },
  async input => {
    const {output} = await predictClaimApprovalProbabilityPrompt(input);
    return output!;
  }
);
