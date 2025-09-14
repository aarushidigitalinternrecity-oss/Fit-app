import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { Workout } from "@/lib/types";
import { calculatePersonalRecords } from "@/hooks/use-workout-data";
import { formatDistanceToNow } from 'date-fns';

export default function PersonalRecords({ workouts }: { workouts: Workout[] | undefined }) {
    if (!workouts) {
        return <Card>
            <CardHeader><CardTitle>Personal Records</CardTitle></CardHeader>
            <CardContent><p>Loading records...</p></CardContent>
        </Card>;
    }
    const prs = calculatePersonalRecords(workouts);
    const top3PRs = prs.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Personal Records
        </CardTitle>
        <CardDescription>Your all-time best lifts.</CardDescription>
      </CardHeader>
      <CardContent>
        {top3PRs.length > 0 ? (
          <ul className="space-y-4">
            {top3PRs.map((pr) => (
              <li key={pr.exerciseName} className="flex justify-between items-center bg-card-foreground/5 p-3 rounded-lg">
                <div>
                  <p className="font-semibold">{pr.exerciseName}</p>
                  <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(pr.date), { addSuffix: true })}</p>
                </div>
                <p className="text-xl font-bold text-primary">{pr.weight} kg</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center text-center text-muted-foreground p-4 h-[150px]">
            <p>Log some heavy lifts to see your PRs here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
