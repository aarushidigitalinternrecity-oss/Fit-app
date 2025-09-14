'use server';

/**
 * @fileOverview Generates personalized workout tips and motivational messages based on the user's workout history.
 *
 * - personalizedWorkoutMotivation - A function that generates personalized workout tips and motivational messages.
 * - PersonalizedWorkoutMotivationInput - The input type for the personalizedWorkoutMotivation function.
 * - PersonalizedWorkoutMotivationOutput - The return type for the personalizedWorkoutMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWorkoutMotivationInputSchema = z.object({
  workoutHistory: z
    .string()
    .describe(
      'A summary of the user workout history, including exercises, sets, reps, and weight lifted.'
    ),
  fitnessGoals: z
    .string()
    .describe('The fitness goals of the user.'),
});
export type PersonalizedWorkoutMotivationInput = z.infer<
  typeof PersonalizedWorkoutMotivationInputSchema
>;

const PersonalizedWorkoutMotivationOutputSchema = z.object({
  motivationMessage: z
    .string()
    .describe('A personalized workout tip and motivational message.'),
});
export type PersonalizedWorkoutMotivationOutput = z.infer<
  typeof PersonalizedWorkoutMotivationOutputSchema
>;

export async function personalizedWorkoutMotivation(
  input: PersonalizedWorkoutMotivationInput
): Promise<PersonalizedWorkoutMotivationOutput> {
  return personalizedWorkoutMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedWorkoutMotivationPrompt',
  input: {schema: PersonalizedWorkoutMotivationInputSchema},
  output: {schema: PersonalizedWorkoutMotivationOutputSchema},
  prompt: `You are a personal fitness coach. You will generate a personalized workout tip and motivational message based on the user's workout history and fitness goals.

Workout History: {{{workoutHistory}}}
Fitness Goals: {{{fitnessGoals}}}

Tip and Message:`,
});

const personalizedWorkoutMotivationFlow = ai.defineFlow(
  {
    name: 'personalizedWorkoutMotivationFlow',
    inputSchema: PersonalizedWorkoutMotivationInputSchema,
    outputSchema: PersonalizedWorkoutMotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
