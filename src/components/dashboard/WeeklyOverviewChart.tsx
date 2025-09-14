"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Workout } from "@/lib/types";
import { subDays, getDay } from 'date-fns';
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

const getWeekData = (workouts: Workout[] | undefined) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let data = weekDays.map(day => ({ name: day, workouts: 0, volume: 0 }));

    if (!workouts) return { data, totalVolume: 0 };

    const today = new Date();
    const oneWeekAgo = subDays(today, 6);
    oneWeekAgo.setHours(0,0,0,0);

    const thisWeekWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo);

    thisWeekWorkouts.forEach(workout => {
        const dayIndex = getDay(new Date(workout.date));
        if (data[dayIndex]) {
            data[dayIndex].workouts += 1;
            workout.exercises.forEach(ex => {
                data[dayIndex].volume += ex.sets * ex.reps * (ex.weight || 0);
            });
        }
    });

    const totalVolume = data.reduce((acc, day) => acc + day.volume, 0);
    const todayIndex = getDay(today);
    const reorderedData = [...data.slice(todayIndex + 1), ...data.slice(0, todayIndex + 1)];
    
    return { data: reorderedData, totalVolume };
};

export default function WeeklyOverviewChart({ workouts }: { workouts: Workout[] | undefined }) {
  const { data, totalVolume } = useMemo(() => getWeekData(workouts), [workouts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <TrendingUp className="text-primary"/>
            Weekly Overview
        </CardTitle>
        <CardDescription>
          Your workout activity for the last 7 days. Total Volume: {totalVolume.toLocaleString()} kg
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--border))', opacity: 0.3 }}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar dataKey="workouts" fill="hsl(var(--primary))" name="Workouts" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
