"use client";

import { useState } from 'react';
import { useWorkoutData } from '@/hooks/use-workout-data';
import AppLayout from '@/components/layout/AppLayout';
import ManageExercises from '@/components/workout/ManageExercises';

export default function LibraryPage() {
    const { data, addCustomExercise, editCustomExercise, deleteCustomExercise } = useWorkoutData();
    const [isManageExercisesOpen, setIsManageExercisesOpen] = useState(false);

    return (
        <AppLayout>
            <ManageExercises 
                customExercises={data?.customExercises || []}
                addCustomExercise={addCustomExercise}
                editCustomExercise={editCustomExercise}
                deleteCustomExercise={deleteCustomExercise}
                isSheet={false} // Render as a page component, not a sheet
            />
        </AppLayout>
    );
}
