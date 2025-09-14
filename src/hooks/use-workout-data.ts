
"use client";

import { useState, useEffect, useCallback } from 'react';
import { MOCK_DATA } from '@/lib/mock-data';
import type { AppData, Workout, PersonalRecord, CustomExercise, PersonalGoal, Exercise } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const DATA_KEY = 'vibefit_data';

export function useWorkoutData() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure arrays exist to prevent errors on older data structures
        if (!Array.isArray(parsedData.customExercises)) {
            parsedData.customExercises = [];
        }
        if (!Array.isArray(parsedData.personalGoals)) {
            parsedData.personalGoals = [];
        }
        setData(parsedData);
      } else {
        localStorage.setItem(DATA_KEY, JSON.stringify(MOCK_DATA));
        setData(MOCK_DATA);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setData(MOCK_DATA); // Fallback to mock data on error
    } finally {
      setLoading(false);
    }
  }, []);

  const saveData = useCallback((newData: AppData) => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
      toast({
        variant: 'destructive',
        title: "Oh no! Something went wrong.",
        description: "Your data could not be saved. Please try again.",
      });
    }
  }, [toast]);
  
  const addWorkout = useCallback((newWorkout: Omit<Workout, 'id'>) => {
    if (!data) return;

    const workoutWithId = { ...newWorkout, id: crypto.randomUUID() };
    
    // Check for new Personal Records
    const currentPRs = calculatePersonalRecords(data.workouts);
    workoutWithId.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (!set.completed) return;
        const existingPR = currentPRs.find(pr => pr.exerciseName === exercise.name);
        if (!existingPR || set.weight > existingPR.weight) {
          toast({
            title: "🎉 New PR Unlocked!",
            description: `${exercise.name}: ${set.weight}kg for ${set.reps} reps`,
          });
        }
      });
    });

    const newData: AppData = {
      ...data,
      workouts: [workoutWithId, ...data.workouts],
    };
    saveData(newData);
    toast({ title: "✅ Workout Saved!", description: "Your session has been logged." });
  }, [data, saveData, toast]);

  const addCustomExercise = useCallback((exercise: Omit<CustomExercise, 'id'>) => {
    if (!data) return;
    const newExercise = { ...exercise, id: crypto.randomUUID() };
    const newData: AppData = {
      ...data,
      customExercises: [...(data.customExercises || []), newExercise],
    };
    saveData(newData);
    toast({ title: "✅ Exercise added!", description: `"${newExercise.name}" has been added to your library.` });
  }, [data, saveData, toast]);

  const editCustomExercise = useCallback((exerciseToUpdate: CustomExercise) => {
    if (!data) return;
    const updatedExercises = (data.customExercises || []).map(ex => 
        ex.id === exerciseToUpdate.id ? exerciseToUpdate : ex
    );
    const newData: AppData = { ...data, customExercises: updatedExercises };
    saveData(newData);
    toast({ title: "✅ Exercise updated!", description: `"${exerciseToUpdate.name}" has been updated.` });
  }, [data, saveData, toast]);

  const deleteCustomExercise = useCallback((exerciseId: string) => {
    if (!data) return;
    const exerciseToDelete = (data.customExercises || []).find(ex => ex.id === exerciseId);
    if (!exerciseToDelete) return;
    const updatedExercises = (data.customExercises || []).filter(ex => ex.id !== exerciseId);
    const newData: AppData = { ...data, customExercises: updatedExercises };
    saveData(newData);
    toast({ title: "🗑️ Exercise deleted", description: `"${exerciseToDelete.name}" has been removed.`, variant: 'destructive' });
  }, [data, saveData, toast]);

  const addPersonalGoal = useCallback((goal: Omit<PersonalGoal, 'id'>) => {
    if (!data) return;
    const newGoal = { ...goal, id: crypto.randomUUID() };
    const newData: AppData = {
      ...data,
      personalGoals: [...(data.personalGoals || []), newGoal],
    };
    saveData(newData);
    toast({ title: "🎯 Goal Set!", description: `New goal for ${newGoal.exerciseName} added.` });
  }, [data, saveData, toast]);

  const editPersonalGoal = useCallback((goalToUpdate: PersonalGoal) => {
    if (!data) return;
    const updatedGoals = (data.personalGoals || []).map(g => 
        g.id === goalToUpdate.id ? goalToUpdate : g
    );
    const newData: AppData = { ...data, personalGoals: updatedGoals };
    saveData(newData);
    toast({ title: "✅ Goal Updated!", description: `Your goal for ${goalToUpdate.exerciseName} has been updated.` });
  }, [data, saveData, toast]);

  const deletePersonalGoal = useCallback((goalId: string) => {
    if (!data) return;
    const goalToDelete = (data.personalGoals || []).find(g => g.id === goalId);
    if(!goalToDelete) return;
    const updatedGoals = (data.personalGoals || []).filter(g => g.id !== goalId);
    const newData: AppData = { ...data, personalGoals: updatedGoals };
    saveData(newData);
    toast({ title: "🗑️ Goal Removed", description: `The goal for ${goalToDelete.exerciseName} has been removed.`, variant: 'destructive' });
  }, [data, saveData, toast]);

  return { data, loading, addWorkout, addCustomExercise, editCustomExercise, deleteCustomExercise, addPersonalGoal, editPersonalGoal, deletePersonalGoal };
}

/**
 * Calculates personal records from a list of workouts.
 * For each exercise, it finds the session with the highest weight.
 * @param workouts Array of workout objects.
 * @returns An array of personal record objects.
 */
export const calculatePersonalRecords = (workouts: Workout[] | undefined): PersonalRecord[] => {
    const prs: { [key: string]: PersonalRecord } = {};
    
    if (!workouts) return [];

    // Flatten all sets from all exercises from all workouts into a single array with dates and names
    const allSets = workouts.flatMap(workout => 
        workout.exercises.flatMap(exercise => 
            exercise.sets.map(set => ({
                ...set,
                name: exercise.name,
                date: workout.date
            }))
        )
    );

    // Group sets by exercise name
    const exercisesByName: { [key: string]: typeof allSets } = allSets.reduce((acc, set) => {
        if (!acc[set.name]) {
            acc[set.name] = [];
        }
        acc[set.name].push(set);
        return acc;
    }, {} as { [key: string]: typeof allSets });

    // Find the PR for each exercise group
    for (const exerciseName in exercisesByName) {
        const sortedSets = exercisesByName[exerciseName].sort((a, b) => {
            // Prioritize higher weight, then higher reps, then more recent date
            if (b.weight !== a.weight) return b.weight - a.weight;
            if (b.reps !== a.reps) return b.reps - a.reps;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        const bestPerformance = sortedSets[0];
        
        if (bestPerformance) {
            prs[exerciseName] = {
                exerciseName: bestPerformance.name,
                weight: bestPerformance.weight,
                reps: bestPerformance.reps,
                date: bestPerformance.date,
            };
        }
    }

    return Object.values(prs).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
