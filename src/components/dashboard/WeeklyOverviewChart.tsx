
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Workout } from "@/lib/types";
import { subDays, getDay, format } from 'date-fns';
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

const getWeekData = (workouts: Workout[] | undefined) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let data = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return { name: format(date, 'EEE'), workouts: 0, volume: 0, date };
    });

    if (!workouts) return { data, totalVolume: 0 };

    const today = new Date();
    const oneWeekAgo = subDays(today, 6);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const thisWeekWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo);

    const dataByDate = data.reduce((acc, item) => {
        acc[format(item.date, 'yyyy-MM-dd')] = item;
        return acc;
    }, {} as Record<string, typeof data[0]>);

    thisWeekWorkouts.forEach(workout => {
        const workoutDateStr = format(new Date(workout.date), 'yyyy-MM-dd');
        const dayData = dataByDate[workoutDateStr];

        if (dayData) {
            if (!dayData.workouts) dayData.workouts = 0;
            dayData.workouts += 1;
            workout.exercises.forEach(ex => {
                if (!dayData.volume) dayData.volume = 0;
                if (Array.isArray(ex.sets)) {
                    dayData.volume += ex.sets.reduce((acc, set) => acc + (set.reps * set.weight), 0);
                }
            });
        }
    });

    const finalData = Object.values(dataByDate).sort((a,b) => a.date.getTime() - b.date.getTime());
    const totalVolume = finalData.reduce((acc, day) => acc + day.volume, 0);
    
    return { data: finalData, totalVolume };
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
