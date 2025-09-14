'use client';

import { Home, BarChart2, BookOpen, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetTrigger } from '../ui/sheet';
import WorkoutLogger from '../workout/WorkoutLogger';
import { useWorkoutData } from '@/hooks/use-workout-data';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/suggestions', label: 'Suggest', icon: Sparkles },
  { href: '/stats', label: 'Stats', icon: BarChart2 },
  { href: '/library', label: 'Library', icon: BookOpen },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data, addWorkout } = useWorkoutData();
  const [isWorkoutLoggerOpen, setIsWorkoutLoggerOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center text-center px-3 py-2 relative">
              <item.icon
                className={cn(
                  'h-6 w-6 mb-1 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                  <div className="absolute top-0 h-1 w-8 bg-primary rounded-b-full animate-glow"></div>
              )}
            </Link>
          );
        })}
        <Sheet open={isWorkoutLoggerOpen} onOpenChange={setIsWorkoutLoggerOpen}>
          <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center text-center px-3 py-2 text-muted-foreground">
                  <div className="bg-primary text-primary-foreground rounded-full p-3 mb-1">
                      <Plus className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium">Log</span>
              </button>
          </SheetTrigger>
          <WorkoutLogger 
              addWorkout={addWorkout} 
              customExercises={data?.customExercises}
              onSheetClose={() => setIsWorkoutLoggerOpen(false)}
          />
        </Sheet>
      </div>
    </nav>
  );
}
