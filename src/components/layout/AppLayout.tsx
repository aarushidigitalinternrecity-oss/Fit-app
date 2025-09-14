"use client";

import { VibeFitLogo } from '@/components/VibeFitLogo';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import WorkoutLogger from '@/components/workout/WorkoutLogger';
import { useState } from 'react';
import { useWorkoutData } from '@/hooks/use-workout-data';
import BottomNav from './BottomNav';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data, addWorkout, loading } = useWorkoutData();
  const [isWorkoutLoggerOpen, setIsWorkoutLoggerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="md:hidden">
        <BottomNav />
      </div>
      <div className="p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <VibeFitLogo />
          <div className='hidden md:flex gap-2'>
            <Button variant="outline" asChild>
                <Link href="/library">
                    <BookOpen className="mr-2 h-4 w-4" /> Manage Exercises
                </Link>
            </Button>
            <Sheet open={isWorkoutLoggerOpen} onOpenChange={setIsWorkoutLoggerOpen}>
                <SheetTrigger asChild>
                    <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Workout
                    </Button>
                </SheetTrigger>
                <WorkoutLogger 
                    addWorkout={addWorkout} 
                    customExercises={data?.customExercises}
                    onSheetClose={() => setIsWorkoutLoggerOpen(false)}
                />
            </Sheet>
          </div>
        </header>

        <main>
          {loading ? <AppSkeleton /> : children}
        </main>
      </div>
    </div>
  );
}

function AppSkeleton() {
    return (
        <div className="flex flex-col items-center gap-4 md:gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
            </div>
            <div className="w-full max-w-md space-y-4 md:space-y-6">
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-[350px] w-full" />
                <Skeleton className="h-[250px] w-full" />
            </div>
        </div>
    )
}
