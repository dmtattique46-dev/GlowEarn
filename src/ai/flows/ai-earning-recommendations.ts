'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing AI-powered earning recommendations.
 *
 * - aiEarningRecommendations - A function that handles the generation of personalized earning recommendations.
 * - AiEarningRecommendationsInput - The input type for the aiEarningRecommendations function.
 * - AiEarningRecommendationsOutput - The return type for the aiEarningRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiEarningRecommendationsInputSchema = z.object({
  userId: z.string().describe('The unique identifier for the user.'),
  userProfile:
    z.string().describe(
      'A description of the user\u0027s profile, interests, and preferences (e.g., "User is a new user interested in gaming and surveys. Prefers short tasks.").'
    ),
  userActivityHistory:
    z.string().describe(
      'A summary of the user\u0027s past activities and performance within the app (e.g., "User completed 3 surveys, earned $5, mostly active on weekends. Last activity was 2 days ago.").'
    ),
});
export type AiEarningRecommendationsInput = z.infer<
  typeof AiEarningRecommendationsInputSchema
>;

// Output Schema
const AiEarningRecommendationsOutputSchema = z.object({
  recommendations:
    z.array(z.string()).describe(
      'A list of personalized recommendations for the user to maximize earnings within the app.'
    ),
  summary:
    z.string().describe('A brief summary of the earning recommendations provided.'),
});
export type AiEarningRecommendationsOutput = z.infer<
  typeof AiEarningRecommendationsOutputSchema
>;

// Wrapper function
export async function aiEarningRecommendations(
  input: AiEarningRecommendationsInput
): Promise<AiEarningRecommendationsOutput> {
  return aiEarningRecommendationsFlow(input);
}

// Define the prompt
const aiEarningRecommendationsPrompt = ai.definePrompt({
  name: 'aiEarningRecommendationsPrompt',
  input: {schema: AiEarningRecommendationsInputSchema},
  output: {schema: AiEarningRecommendationsOutputSchema},
  prompt: `You are an AI-powered financial advisor for the GlowEarn app, specializing in helping users maximize their earning potential.
Your goal is to analyze user data and provide highly personalized and actionable recommendations.

Consider the following information about the user:
User ID: {{{userId}}}
User Profile: {{{userProfile}}}
User Activity History: {{{userActivityHistory}}}

Based on this data, provide a list of specific earning recommendations and a concise summary.
The recommendations should be tailored to their profile, past activities, and potential areas for growth within the app.
Be encouraging and clear.`,
});

// Define the flow
const aiEarningRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiEarningRecommendationsFlow',
    inputSchema: AiEarningRecommendationsInputSchema,
    outputSchema: AiEarningRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await aiEarningRecommendationsPrompt(input);
    if (!output) {
      throw new Error('No output received from the AI model.');
    }
    return output;
  }
);
