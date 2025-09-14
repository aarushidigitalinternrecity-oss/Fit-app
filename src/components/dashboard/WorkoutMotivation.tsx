"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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

  const getMotivation = async () => {
    setLoading(true);
    try {
      const workoutHistory = formatWorkoutHistory(workouts);
      const result = await personalizedWorkoutMotivation({
        workoutHistory,
        fitnessGoals: "Build muscle and increase strength",
      });
      setMotivation(result.motivationMessage);
    } catch (error) {
      console.error("Failed to get motivation:", error);
      setMotivation("Couldn't get a tip right now. Keep up the great work!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMotivation();
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
      <div className="p-6 pt-0">
        <Button onClick={getMotivation} disabled={loading} variant="ghost" className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? "Generating..." : "Get a new tip"}
        </Button>
      </div>
    </Card>
  );
}
