
"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame } from 'lucide-react';
import { subDays, format } from 'date-fns';
import type { Workout } from "@/lib/types";
import { calculateWorkoutVolume } from '@/hooks/use-workout-data';

// Calorie burn is a very rough estimate.
// We'll use a simple multiplier on total volume. 1kg of volume != 1 calorie.
// A common estimate is around 0.03-0.05 calories per kg of volume for weightlifting.
const CALORIE_MULTIPLIER = 0.04;

const getCalorieData = (workouts: Workout[] | undefined) => {
    let data = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return { name: format(date, 'EEE'), calories: 0, date };
    });

    if (!workouts) return { data, totalCalories: 0, avgCalories: 0 };
    
    const oneWeekAgo = subDays(new Date(), 6);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const thisWeekWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo);

    const dataByDate = data.reduce((acc, item) => {
        acc[format(item.date, 'yyyy-MM-dd')] = item;
        return acc;
    }, {} as Record<string, typeof data[0]>);

    let workoutCount = 0;
    
    thisWeekWorkouts.forEach(workout => {
        const workoutDateStr = format(new Date(workout.date), 'yyyy-MM-dd');
        const dayData = dataByDate[workoutDateStr];

        if (dayData) {
            const volume = calculateWorkoutVolume(workout);
            const calories = Math.round(volume * CALORIE_MULTIPLIER);
            if (!dayData.calories) dayData.calories = 0;
            dayData.calories += calories;
            workoutCount++;
        }
    });

    const finalData = Object.values(dataByDate).sort((a,b) => a.date.getTime() - b.date.getTime());
    const totalCalories = finalData.reduce((acc, day) => acc + day.calories, 0);
    const avgCalories = workoutCount > 0 ? Math.round(totalCalories / workoutCount) : 0;
    
    return { data: finalData, totalCalories, avgCalories };
};

export default function CalorieBurnStats({ workouts }: { workouts: Workout[] | undefined }) {
    const { data, totalCalories, avgCalories } = useMemo(() => getCalorieData(workouts), [workouts]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Flame className="text-primary"/>
                    Calorie Burn Stats
                </CardTitle>
                <CardDescription>
                    Weekly total: <span className="font-bold text-primary">{Math.round(totalCalories).toLocaleString()} kcal</span>.
                    Avg per workout: <span className="font-bold text-primary">{avgCalories.toLocaleString()} kcal</span>.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] md:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                        <Bar dataKey="calories" fill="hsl(var(--primary))" name="Calories Burned (kcal)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
