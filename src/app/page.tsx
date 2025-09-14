
"use client";

import { useWorkoutData } from '@/hooks/use-workout-data';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';

const TodaySummary = dynamic(() => import('@/components/dashboard/TodaySummary'), {
  loading: () => <Skeleton className="h-[250px] w-full" />,
  ssr: false
});
const PersonalRecords = dynamic(() => import('@/components/dashboard/PersonalRecords'), {
  loading: () => <Skeleton className="h-[250px] w-full" />,
  ssr: false
});
const WeeklyOverviewChart = dynamic(() => import('@/components/dashboard/WeeklyOverviewChart'), {
    loading: () => <Skeleton className="h-[350px] w-full" />,
    ssr: false
});
const ProgressRings = dynamic(() => import('@/components/dashboard/ProgressRings'), {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false
});
const StreakCounter = dynamic(() => import('@/components/dashboard/StreakCounter'), {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false
});
const WorkoutMotivation = dynamic(() => import('@/components/dashboard/WorkoutMotivation'), {
    loading: () => <Skeleton className="h-[250px] w-full" />,
    ssr: false
});


export default function DashboardPage() {
  const { data, loading } = useWorkoutData();

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {/* Main column */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          <TodaySummary workouts={data?.workouts} />
          <WeeklyOverviewChart workouts={data?.workouts} />
          <PersonalRecords workouts={data?.workouts} />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
                <StreakCounter workouts={data?.workouts} />
                <ProgressRings workouts={data?.workouts} weeklyGoal={data?.user.goals.weeklyWorkoutTarget} />
            </div>
          <WorkoutMotivation workouts={data?.workouts} />
        </div>
      </div>
    </AppLayout>
  );
}
