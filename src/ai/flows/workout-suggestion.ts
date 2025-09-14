'use server';

/**
 * @fileOverview Generates a personalized workout suggestion based on user data.
 *
 * - suggestWorkout - A function that generates a personalized workout.
 * - SuggestWorkoutInput - The input type for the suggestWorkout function.
 * - SuggestWorkoutOutput - The return type for the suggestWorkout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWorkoutInputSchema = z.object({
  workoutHistory: z.string().describe('A summary of the user\'s recent workout history.'),
  fitnessGoals: z.string().describe('The user\'s primary fitness goals.'),
  personalRecords: z.string().describe('A summary of the user\'s personal records for key lifts.'),
  availableExercises: z.array(z.string()).describe('A list of exercises the user has available to them.'),
});
export type SuggestWorkoutInput = z.infer<typeof SuggestWorkoutInputSchema>;

const SuggestWorkoutOutputSchema = z.object({
    suggestionTitle: z.string().describe('A catchy and descriptive title for the suggested workout session (e.g., "Dynamic Upper Body Power Day").'),
    workoutRationale: z.string().describe('A brief (2-3 sentences) explanation of why this workout is being suggested, linking it to the user\'s goals and history.'),
    duration: z.string().describe('Estimated total duration of the workout (e.g., "45-60 minutes").'),
    intensity: z.string().describe('The target intensity level for the workout (e.g., "Moderate", "High", "Light").'),
    suggestedExercises: z.array(z.object({
        name: z.string().describe('The name of the exercise.'),
        sets: z.number().describe('The number of sets to perform.'),
        reps: z.string().describe('The target repetition range (e.g., "8-12" or "5").'),
        tip: z.string().optional().describe('An optional short tip for performing the exercise correctly or maximizing its benefit.'),
    })).describe('An array of exercises to perform for the workout.'),
});
export type SuggestWorkoutOutput = z.infer<typeof SuggestWorkoutOutputSchema>;


export async function suggestWorkout(input: SuggestWorkoutInput): Promise<SuggestWorkoutOutput> {
  return suggestWorkoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWorkoutPrompt',
  input: {schema: SuggestWorkoutInputSchema},
  output: {schema: SuggestWorkoutOutputSchema},
  prompt: `You are an expert fitness coach named "Turbo Granny Coach". Your task is to create a personalized workout suggestion for a user based on their data. The workout should be effective, safe, and aligned with their goals.

Analyze the following user data:
- Fitness Goals: {{{fitnessGoals}}}
- Workout History: {{{workoutHistory}}}
- Personal Records (PRs): {{{personalRecords}}}
- Available Exercises: {{{json availableExercises}}}

Based on this data, generate a structured workout suggestion. The workout should be designed to help the user make progress towards their goals. Avoid recently performed exercises if possible to ensure muscle recovery, unless the goal is frequency-based.

Your response must be in the structured format defined by the output schema. Ensure all fields are populated with relevant, high-quality information. The suggested exercises must be chosen from the provided list of available exercises.`,
});

const suggestWorkoutFlow = ai.defineFlow(
  {
    name: 'suggestWorkoutFlow',
    inputSchema: SuggestWorkoutInputSchema,
    outputSchema: SuggestWorkoutOutputSchema,
    retries: 3,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
