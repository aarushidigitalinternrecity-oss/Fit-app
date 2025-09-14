import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { Workout } from "@/lib/types";
import { isToday } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export default function TodaySummary({ workouts }: { workouts: Workout[] | undefined }) {
  const todayWorkouts = workouts?.filter(w => isToday(new Date(w.date))) ?? [];
  const allExercises = todayWorkouts.flatMap(w => w.exercises);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="text-primary" />
          Today's Summary
        </CardTitle>
        <CardDescription>
          {allExercises.length > 0 ? "Here's what you've logged today." : "No workouts logged today. Let's get it!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allExercises.length > 0 ? (
          <ScrollArea className="h-[150px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise</TableHead>
                  <TableHead className="text-right">Sets</TableHead>
                  <TableHead className="text-right">Reps</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allExercises.map((ex) => (
                  <TableRow key={ex.id}>
                    <TableCell className="font-medium">{ex.name}</TableCell>
                    <TableCell className="text-right">{ex.sets}</TableCell>
                    <TableCell className="text-right">{ex.reps}</TableCell>
                    <TableCell className="text-right">{ex.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="flex h-[150px] flex-col items-center justify-center text-center text-muted-foreground p-8">
            <p>Your logged exercises for today will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
