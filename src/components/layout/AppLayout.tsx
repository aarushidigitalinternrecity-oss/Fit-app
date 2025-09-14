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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data, addWorkout } = useWorkoutData();
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
          {children}
        </main>
      </div>
    </div>
  );
}
