
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart3, Repeat, Weight, Dumbbell } from "lucide-react";
import type { Workout } from "@/lib/types";
import { useMemo } from "react";

interface StatProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

const StatItem = ({ icon, label, value }: StatProps) => (
    <div className="flex items-center gap-4">
        <div className="bg-muted p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="text-lg md:text-xl font-bold">{value}</p>
        </div>
    </div>
);

const getStats = (workouts: Workout[] | undefined) => {
    if (!workouts) {
        return { totalWorkouts: 0, totalVolume: 0, mostTrained: "N/A" };
    }
    
    const totalWorkouts = workouts.length;
    
    const totalVolume = workouts.reduce((total, w) => 
        total + w.exercises.reduce((sub, ex) => 
            sub + ex.sets.reduce((setTotal, set) => setTotal + (set.reps * (set.weight || 0)), 0)
        , 0), 0);
    
    const exerciseCounts = workouts.flatMap(w => w.exercises).reduce((acc, ex) => {
        acc[ex.name] = (acc[ex.name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostTrained = Object.entries(exerciseCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";

    return { totalWorkouts, totalVolume, mostTrained };
};

export default function QuickStats({ workouts }: { workouts: Workout[] | undefined }) {
    const { totalWorkouts, totalVolume, mostTrained } = useMemo(() => getStats(workouts), [workouts]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <BarChart3 className="text-primary"/>
                    Quick Stats
                </CardTitle>
                <CardDescription>Your lifetime statistics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <StatItem icon={<Repeat className="text-primary"/>} label="Total Workouts" value={totalWorkouts} />
                <StatItem icon={<Weight className="text-primary"/>} label="Total Volume (kg)" value={totalVolume.toLocaleString()} />
                <StatItem icon={<Dumbbell className="text-primary"/>} label="Most Trained" value={mostTrained} />
            </CardContent>
        </Card>
    );
}
