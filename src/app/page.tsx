"use client";

import { useWorkoutData } from '@/hooks/use-workout-data';
import { VibeFitLogo } from '@/components/VibeFitLogo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import dynamic from 'next/dynamic';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import WorkoutLogger from '@/components/workout/WorkoutLogger';

const TodaySummary = dynamic(() => import('@/components/dashboard/TodaySummary'), { 
  loading: () => <Skeleton className="h-[260px] w-full" />,
  ssr: false 
});
const WeeklyOverviewChart = dynamic(() => import('@/components/dashboard/WeeklyOverviewChart'), { 
  loading: () => <Skeleton className="h-[350px] w-full" />,
  ssr: false 
});
const PersonalRecords = dynamic(() => import('@/components/dashboard/PersonalRecords'), { 
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false 
});
const StreakCounter = dynamic(() => import('@/components/dashboard/StreakCounter'), { 
  loading: () => <Skeleton className="h-[180px] w-full" />,
  ssr: false 
});
const ProgressRings = dynamic(() => import('@/components/dashboard/ProgressRings'), { 
  loading: () => <Skeleton className="h-[180px] w-full" />,
  ssr: false 
});
const MuscleHeatmap = dynamic(() => import('@/components/dashboard/MuscleHeatmap'), { 
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false 
});
const TrendSnapshotChart = dynamic(() => import('@/components/dashboard/TrendSnapshotChart'), { 
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false 
});
const QuickStats = dynamic(() => import('@/components/dashboard/QuickStats'), { 
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false 
});
const WorkoutMotivation = dynamic(() => import('@/components/dashboard/WorkoutMotivation'), { 
  loading: () => <Skeleton className="h-[260px] w-full" />,
  ssr: false 
});


export default function Home() {
  const { data, addWorkout } = useWorkoutData();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <VibeFitLogo />
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Workout
            </Button>
          </SheetTrigger>
          <WorkoutLogger addWorkout={addWorkout} />
        </Sheet>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
            <TodaySummary workouts={data?.workouts} />
        </div>
        <div className="lg:col-span-2">
            <WorkoutMotivation workouts={data?.workouts} />
        </div>
        
        <div className="lg:col-span-2">
            <WeeklyOverviewChart workouts={data?.workouts} />
        </div>
        
        <div className="lg:col-span-2 xl:col-span-1 grid grid-cols-2 gap-6">
            <StreakCounter workouts={data?.workouts} />
            <ProgressRings workouts={data?.workouts} weeklyGoal={data?.user.goals.weeklyWorkoutTarget} />
        </div>
        
        <div className="lg:col-span-2 xl:col-span-1">
            <QuickStats workouts={data?.workouts} />
        </div>

        <div className="lg:col-span-2">
            <PersonalRecords workouts={data?.workouts} />
        </div>
        
        <div className="lg:col-span-2">
            <TrendSnapshotChart workouts={data?.workouts} />
        </div>
        
        <div className="lg:col-span-4">
            <MuscleHeatmap />
        </div>
      </main>
    </div>
  );
}
