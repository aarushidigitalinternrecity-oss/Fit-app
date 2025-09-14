
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot } from "lucide-react";
import { personalizedWorkoutMotivation } from "@/ai/flows/personalized-workout-motivation";
import type { Workout } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

function formatWorkoutHistory(workouts: Workout[] | undefined): string {
    if (!workouts || workouts.length === 0) {
        return "No workouts recorded yet.";
    }
    const recentWorkouts = workouts.slice(0, 3);
    return recentWorkouts.map(w => 
        `On ${new Date(w.date).toLocaleDateString()}, user did: ${w.exercises.map(e => `${e.name} (${e.sets}x${e.reps} at ${e.weight}kg)`).join(', ')}`
    ).join('; ');
}

export default function WorkoutMotivation({ workouts }: { workouts: Workout[] | undefined }) {
  const [motivation, setMotivation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const getMotivation = async (force = false) => {
    // Don't refetch if we already have a message, unless forced
    if (motivation && !force && !error) {
        setLoading(true); // Briefly set loading for button press feedback
        setTimeout(() => setLoading(false), 300); // Simulate a quick action
        // Then get a new tip
    }
    
    setLoading(true);
    setError(false);

    try {
      const workoutHistory = formatWorkoutHistory(workouts);
      if (workoutHistory === "No workouts recorded yet.") {
          setMotivation("Log a workout to get your first personalized tip!");
          setLoading(false);
          return;
      }

      const result = await personalizedWorkoutMotivation({
        workoutHistory,
        fitnessGoals: "Build muscle and increase strength",
      });
      setMotivation(result.motivationMessage);
    } catch (error) {
      console.error("Failed to get motivation:", error);
      setMotivation("Couldn't get a tip right now, but you're doing great. Keep it up!");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMotivation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workouts]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Bot className="text-primary" />
          Personal Coach
        </CardTitle>
        <CardDescription>AI-powered tips based on your progress.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {loading ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        ) : (
            <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
                {motivation}
            </blockquote>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => getMotivation(true)} disabled={loading} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Get a New Tip"}
        </Button>
      </CardFooter>
    </Card>
  );
}
