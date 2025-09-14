
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ADMIN_WORKOUTS } from '@/lib/admin-workouts';
import AppLayout from '@/components/layout/AppLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkoutData } from '@/hooks/use-workout-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const exerciseSetSchema = z.object({
  id: z.string(),
  reps: z.coerce.number().min(0, "Reps can't be negative.").default(0),
  weight: z.coerce.number().min(0, "Weight can't be negative.").default(0),
  completed: z.boolean().default(false),
});

const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sets: z.array(exerciseSetSchema),
});

const workoutFormSchema = z.object({
  exercises: z.array(exerciseSchema),
});

type WorkoutFormData = z.infer<typeof workoutFormSchema>;


export default function AdminFavouritePage() {
    const [selectedWorkout, setSelectedWorkout] = useState('Push');
    const workoutData = ADMIN_WORKOUTS[selectedWorkout];

    const { addWorkout } = useWorkoutData();

    const form = useForm<WorkoutFormData>({
        resolver: zodResolver(workoutFormSchema),
        defaultValues: { exercises: [] }
    });

    const { control, reset, watch, handleSubmit } = form;
    const { fields, replace } = useFieldArray({
        control,
        name: "exercises"
    });

    useEffect(() => {
        const newExercises = ADMIN_WORKOUTS[selectedWorkout].flatMap(section =>
            section.exercises.map(ex => ({
                id: crypto.randomUUID(),
                name: ex.name,
                sets: Array.from({ length: ex.defaultSets }, () => ({
                    id: crypto.randomUUID(),
                    reps: ex.defaultReps,
                    weight: 0,
                    completed: false,
                }))
            }))
        );
        replace(newExercises);
    }, [selectedWorkout, replace]);

    const onSubmit = (data: WorkoutFormData) => {
        const loggedWorkout = {
            date: new Date().toISOString(),
            exercises: data.exercises
                .map(ex => ({
                    ...ex,
                    sets: ex.sets.filter(s => s.completed),
                }))
                .filter(ex => ex.sets.length > 0)
        };

        if (loggedWorkout.exercises.length > 0) {
            addWorkout(loggedWorkout);
        }
        
        // Reset completion status but keep structure
        const currentExercises = watch('exercises');
        const resetExercises = currentExercises.map(ex => ({
            ...ex,
            sets: ex.sets.map(s => ({...s, completed: false, weight: 0}))
        }));
        reset({ exercises: resetExercises });
    };
    
    const workoutProgress = useMemo(() => {
        const watchedExercises = watch('exercises');
        if (!watchedExercises || watchedExercises.length === 0) return 0;
        
        let completedCount = 0;
        let totalCount = 0;
        
        watchedExercises.forEach(ex => {
            ex.sets.forEach(set => {
                totalCount++;
                if (set.completed) {
                    completedCount++;
                }
            })
        });

        return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    }, [watch]);


    return (
        <AppLayout>
            <div className="w-full max-w-lg mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Admin's Favourite</CardTitle>
                        <CardDescription>Select a workout routine curated by the admin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={setSelectedWorkout} value={selectedWorkout}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a workout" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(ADMIN_WORKOUTS).map(workoutName => (
                                    <SelectItem key={workoutName} value={workoutName}>{workoutName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{selectedWorkout} Day</CardTitle>
                                <div className="pt-2">
                                    <Label>Workout Progress</Label>
                                    <div className="h-2 w-full bg-muted rounded-full mt-1">
                                        <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${workoutProgress}%`}}></div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {workoutData.map((section) => {
                            const sectionExercises = fields.filter(field => 
                                section.exercises.some(ex => ex.name === field.name)
                            );
                            
                            return (
                                <Card key={section.title}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{section.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {sectionExercises.map((field, index) => {
                                            const exerciseIndex = fields.findIndex(f => f.id === field.id);
                                            const originalExerciseInfo = section.exercises.find(e => e.name === field.name);
                                            return (
                                                <div key={field.id}>
                                                    <div>
                                                        <p className="font-semibold text-base">{field.name}</p>
                                                        <p className="text-sm text-muted-foreground">{originalExerciseInfo?.details}</p>
                                                        <div className="space-y-2 mt-2">
                                                            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-2 items-center text-sm font-medium text-muted-foreground px-2">
                                                                <span className="text-center">Set</span>
                                                                <span className="text-center">Weight (kg)</span>
                                                                <span className="text-center">Reps</span>
                                                                <span className="text-center">Done</span>
                                                            </div>
                                                            {field.sets.map((set, setIndex) => (
                                                                <div key={set.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-2 items-center">
                                                                    <Label className="font-bold text-center">{setIndex + 1}</Label>
                                                                    <FormField
                                                                        control={control}
                                                                        name={`exercises.${exerciseIndex}.sets.${setIndex}.weight`}
                                                                        render={({ field }) => <Input type="number" placeholder="0" {...field} className="text-center" />}
                                                                    />
                                                                    <FormField
                                                                        control={control}
                                                                        name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
                                                                        render={({ field }) => <Input type="number" placeholder="0" {...field} className="text-center" />}
                                                                    />
                                                                    <Controller
                                                                        control={control}
                                                                        name={`exercises.${exerciseIndex}.sets.${setIndex}.completed`}
                                                                        render={({ field: checkboxField }) => (
                                                                             <div className="flex justify-center">
                                                                                <Checkbox
                                                                                    checked={checkboxField.value}
                                                                                    onCheckedChange={checkboxField.onChange}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {index < sectionExercises.length - 1 && <Separator className="my-4" />}
                                                </div>
                                            )
                                        })}
                                    </CardContent>
                                </Card>
                            )
                        })}
                         <Button type="submit" className="w-full">Log Completed Exercises</Button>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
