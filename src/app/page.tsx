
"use client";

import { useWorkoutData } from '@/hooks/use-workout-data';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/layout/AppLayout';

const StreakCounter = dynamic(() => import('@/components/dashboard/StreakCounter'), {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false
});
const ProgressRings = dynamic(() => import('@/components/dashboard/ProgressRings'), {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false
});
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


export default function DashboardPage() {
  const { data } = useWorkoutData();

  return (
    <AppLayout>
      <div className="flex flex-col items-center gap-4 md:gap-6">
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <StreakCounter workouts={data?.workouts} />
            <ProgressRings workouts={data?.workouts} weeklyGoal={data?.user.goals.weeklyWorkoutTarget} />
        </div>
        <div className="w-full max-w-md space-y-4 md:space-y-6">
            <TodaySummary workouts={data?.workouts} />
            <WeeklyOverviewChart workouts={data?.workouts} />
            <PersonalRecords workouts={data?.workouts} />
        </div>
      </div>
    </AppLayout>
  );
}

