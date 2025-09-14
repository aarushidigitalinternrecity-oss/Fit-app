"use client";

import { useWorkoutData } from '@/hooks/use-workout-data';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/layout/AppLayout';

const TrendSnapshotChart = dynamic(() => import('@/components/dashboard/TrendSnapshotChart'), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false
});
const QuickStats = dynamic(() => import('@/components/dashboard/QuickStats'), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false
});
const MuscleHeatmap = dynamic(() => import('@/components/dashboard/MuscleHeatmap'), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false
});

export default function StatsPage() {
  const { data } = useWorkoutData();

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <QuickStats workouts={data?.workouts} />
        <TrendSnapshotChart workouts={data?.workouts} customExercises={data?.customExercises} />
        <MuscleHeatmap />
      </div>
    </AppLayout>
  );
}
