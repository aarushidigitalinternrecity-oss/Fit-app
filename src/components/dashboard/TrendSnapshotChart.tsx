"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Workout, CustomExercise } from "@/lib/types";
import { format } from 'date-fns';
import { AreaChart } from 'lucide-react';

const getProgressionData = (workouts: Workout[] | undefined, exerciseName: string | null) => {
    if (!workouts || !exerciseName) return [];

    return workouts
        .flatMap(w => w.exercises.map(ex => ({...ex, date: w.date})))
        .filter(ex => ex.name === exerciseName && ex.weight > 0)
        .map(ex => ({
            date: format(new Date(ex.date), 'MMM d'),
            weight: ex.weight,
            fullDate: new Date(ex.date)
        }))
        .sort((a,b) => a.fullDate.getTime() - b.fullDate.getTime());
};

const getUniqueExercises = (workouts: Workout[] | undefined, customExercises: CustomExercise[] | undefined) => {
    const exerciseSet = new Set<string>();
    if (workouts) {
        workouts.forEach(w => w.exercises.forEach(ex => ex.weight > 0 && exerciseSet.add(ex.name)));
    }
    // No need to add custom exercises separately if we get them from workouts.
    // If a custom exercise has never been performed, it won't have progression data anyway.
    return Array.from(exerciseSet).sort();
};

export default function TrendSnapshotChart({ workouts, customExercises }: { workouts: Workout[] | undefined, customExercises: CustomExercise[] | undefined }) {
  const uniqueExercises = useMemo(() => getUniqueExercises(workouts, customExercises), [workouts, customExercises]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    if (uniqueExercises.length > 0 && (!selectedExercise || !uniqueExercises.includes(selectedExercise))) {
      setSelectedExercise(uniqueExercises[0]);
    } else if (uniqueExercises.length === 0) {
        setSelectedExercise(null);
    }
  }, [uniqueExercises, selectedExercise]);

  const data = useMemo(() => getProgressionData(workouts, selectedExercise), [workouts, selectedExercise]);

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <AreaChart className="text-primary"/>
                    Trend Snapshot
                </CardTitle>
                <CardDescription>Progression for a key lift.</CardDescription>
            </div>
            <Select onValueChange={setSelectedExercise} value={selectedExercise || ''} disabled={uniqueExercises.length === 0} >
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueExercises.map(ex => (
                        <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[200px] md:h-[250px]">
        {data.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                }}
              />
              <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
            <div className='flex items-center justify-center h-full text-muted-foreground text-center'>
                <p>{uniqueExercises.length === 0 ? "Log a workout to see trends." : !selectedExercise ? "Select an exercise to see your trend." : "Not enough data to show a trend for this exercise."}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
