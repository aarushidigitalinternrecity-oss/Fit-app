"use client";

import { useState, useEffect, useCallback } from 'react';
import { MOCK_DATA } from '@/lib/mock-data';
import type { AppData, Workout, PersonalRecord } from '@/lib/types';
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
        setData(JSON.parse(storedData));
      } else {
        localStorage.setItem(DATA_KEY, JSON.stringify(MOCK_DATA));
        setData(MOCK_DATA);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setData(MOCK_DATA);
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
    }
  }, []);
  
  const addWorkout = useCallback((newWorkout: Omit<Workout, 'id'>) => {
    if (!data) return;

    const workoutWithId = { ...newWorkout, id: Date.now().toString() };
    
    const currentPRs = calculatePersonalRecords(data.workouts);
    workoutWithId.exercises.forEach(exercise => {
      const existingPR = currentPRs.find(pr => pr.exerciseName === exercise.name);
      if (!existingPR || exercise.weight > existingPR.weight) {
        toast({
          title: "🎉 New PR Unlocked!",
          description: `${exercise.name}: ${exercise.weight}kg`,
          className: "bg-primary text-primary-foreground border-green-400",
        });
      }
    });

    const newData: AppData = {
      ...data,
      workouts: [workoutWithId, ...data.workouts],
    };
    saveData(newData);
  }, [data, saveData, toast]);

  return { data, loading, addWorkout };
}

export const calculatePersonalRecords = (workouts: Workout[]): PersonalRecord[] => {
    const prs: { [key: string]: PersonalRecord } = {};
    
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedWorkouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
            if (exercise.weight > 0) {
                if (!prs[exercise.name] || exercise.weight >= prs[exercise.name].weight) {
                    prs[exercise.name] = {
                        exerciseName: exercise.name,
                        weight: exercise.weight,
                        date: workout.date,
                    };
                }
            }
        });
    });

    return Object.values(prs).sort((a, b) => b.weight - a.weight);
};
