import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import type { Workout } from "@/lib/types";
import { differenceInCalendarDays, parseISO, startOfToday } from 'date-fns';

const calculateStreak = (workouts: Workout[] | undefined): number => {
    if (!workouts || workouts.length === 0) return 0;

    const uniqueDays = [...new Set(workouts.map(w => w.date.split('T')[0]))]
      .map(d => parseISO(d))
      .sort((a,b) => b.getTime() - a.getTime());

    if (uniqueDays.length === 0) return 0;
    
    let streak = 0;
    const today = startOfToday();
    
    const diffFromToday = differenceInCalendarDays(today, uniqueDays[0]);

    if (diffFromToday > 1) {
        return 0; // Streak is broken
    }
    
    if (diffFromToday === 0 || diffFromToday === 1) {
        streak = 1;
        for (let i = 1; i < uniqueDays.length; i++) {
            const diff = differenceInCalendarDays(uniqueDays[i-1], uniqueDays[i]);
            if (diff === 1) {
                streak++;
            } else {
                break; // Gap in days, streak ends
            }
        }
    }
    
    return streak;
};

export default function StreakCounter({ workouts }: { workouts: Workout[] | undefined }) {
  const streak = calculateStreak(workouts);

  return (
    <Card className="flex flex-col items-center justify-center text-center h-full p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg">Workout Streak</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold text-primary">{streak}</span>
          <Flame className="size-8 text-orange-500" />
        </div>
        <p className="text-muted-foreground mt-1 text-sm">day streak</p>
      </CardContent>
    </Card>
  );
}
