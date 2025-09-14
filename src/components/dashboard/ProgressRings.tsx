"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Workout } from "@/lib/types";
import { subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useEffect, useState } from "react";

const getWorkoutsThisWeek = (workouts: Workout[] | undefined) => {
    if (!workouts) return 0;
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    
    const uniqueDaysThisWeek = new Set(
        workouts
            .filter(w => isWithinInterval(new Date(w.date), { start: weekStart, end: weekEnd }))
            .map(w => w.date.split('T')[0])
    );
    
    return uniqueDaysThisWeek.size;
}

const CircleProgress = ({ percentage, size }: { percentage: number, size: number }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const progressOffset = circumference - (percentage / 100) * circumference;
        setOffset(progressOffset);
    }, [percentage, circumference]);


    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle
                className="text-muted"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className="text-primary"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
        </svg>
    );
};

export default function ProgressRings({ workouts, weeklyGoal }: { workouts: Workout[] | undefined, weeklyGoal: number | undefined }) {
  const [workoutsDone, setWorkoutsDone] = useState(0);

  useEffect(() => {
    setWorkoutsDone(getWorkoutsThisWeek(workouts));
  }, [workouts]);

  const goal = weeklyGoal || 5;
  const percentage = Math.min((workoutsDone / goal) * 100, 100);

  return (
    <Card className="flex flex-col items-center justify-center text-center h-full p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">Weekly Goal</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex items-center justify-center">
        <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]">
            <CircleProgress percentage={percentage} size={150} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold">{workoutsDone}</span>
                <span className="text-sm text-muted-foreground">/{goal}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
