
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { Workout, Exercise, ExerciseSet } from "@/lib/types";
import { isToday } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function TodaySummary({ workouts }: { workouts: Workout[] | undefined }) {
  const todayWorkouts = workouts?.filter(w => isToday(new Date(w.date))) ?? [];
  const allExercisesToday = todayWorkouts.flatMap(w => w.exercises);

  // Flatten sets for display
  const allSetsToday: (ExerciseSet & { exerciseName: string })[] = allExercisesToday.flatMap(ex =>
    ex.sets.map(set => ({ ...set, exerciseName: ex.name }))
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Activity className="text-primary" />
          Today's Summary
        </CardTitle>
        <CardDescription>
          {allSetsToday.length > 0 ? "Here's what you've logged today." : "No workouts logged today. Let's get it!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allSetsToday.length > 0 ? (
          <ScrollArea className="h-[150px] md:h-[180px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead className="text-right">Set</TableHead>
                  <TableHead className="text-right">Reps</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allExercisesToday.map((ex) => (
                  ex.sets.map((set, setIndex) => (
                    <TableRow key={`${ex.id}-${set.id}`}>
                      <TableCell className="font-medium">{setIndex === 0 ? ex.name : ''}</TableCell>
                      <TableCell className="text-right">{setIndex + 1}</TableCell>
                      <TableCell className="text-right">{set.reps}</TableCell>
                      <TableCell className="text-right">{set.weight}</TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="flex h-[150px] md:h-[180px] flex-col items-center justify-center text-center text-muted-foreground p-8">
            <p>Your logged exercises for today will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
