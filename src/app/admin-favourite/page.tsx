
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ADMIN_WORKOUTS, AdminWorkout, AdminWorkoutSection } from '@/lib/admin-workouts';
import AppLayout from '@/components/layout/AppLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkoutData } from '@/hooks/use-workout-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';


const exerciseSchema = z.object({
  name: z.string(),
  sets: z.coerce.number(),
  reps: z.coerce.number().min(0, "Reps can't be negative.").optional().default(0),
  weight: z.coerce.number().min(0, "Weight can't be negative.").optional().default(0),
  completed: z.boolean().default(false),
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

    const { fields, replace, update } = useFieldArray({
        control: form.control,
        name: "exercises"
    });

    useEffect(() => {
        const flattenedExercises = ADMIN_WORKOUTS[selectedWorkout].flatMap(section =>
            section.exercises.map(ex => ({
                name: ex.name,
                sets: ex.defaultSets,
                reps: ex.defaultReps,
                weight: 0,
                completed: false,
            }))
        );
        // We need to type cast here because of RHF's strict typing on `replace`.
        replace(flattenedExercises as (z.infer<typeof exerciseSchema> & { id?: string | undefined; })[]);
    }, [selectedWorkout, replace]);

    const onSubmit = (data: WorkoutFormData) => {
        const loggedExercises = data.exercises
            .filter(ex => ex.completed)
            .map(ex => ({
                id: crypto.randomUUID(),
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps || 0,
                weight: ex.weight || 0,
            }));

        if (loggedExercises.length > 0) {
            addWorkout({
                date: new Date().toISOString(),
                exercises: loggedExercises,
            });
        }
        form.reset();
    };
    
    const workoutProgress = useMemo(() => {
        const watchedExercises = form.watch('exercises');
        if (!watchedExercises) return 0;
        const completedCount = watchedExercises.filter(ex => ex.completed).length;
        const totalCount = watchedExercises.length;
        return totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    }, [form]);


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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                        {workoutData.map((section, sectionIndex) => (
                            <Card key={sectionIndex}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{section.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {section.exercises.map((exercise, exerciseIndex) => {
                                        const fieldIndex = workoutData.slice(0, sectionIndex).reduce((acc, sec) => acc + sec.exercises.length, 0) + exerciseIndex;
                                        const field = fields[fieldIndex];

                                        return field ? (
                                            <div key={field.id}>
                                                <div className="flex items-start gap-4">
                                                    <Controller
                                                        control={form.control}
                                                        name={`exercises.${fieldIndex}.completed`}
                                                        render={({ field: checkboxField }) => (
                                                            <Checkbox
                                                                checked={checkboxField.value}
                                                                onCheckedChange={checkboxField.onChange}
                                                                className="mt-1"
                                                                id={`completed-${field.id}`}
                                                            />
                                                        )}
                                                    />
                                                    <div className="flex-1 space-y-2">
                                                        <Label htmlFor={`completed-${field.id}`} className="font-semibold text-base">{exercise.name}</Label>
                                                        <p className="text-sm text-muted-foreground">{exercise.details}</p>

                                                        <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`exercises.${fieldIndex}.weight`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <Label>Weight (kg)</Label>
                                                                        <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                             <FormField
                                                                control={form.control}
                                                                name={`exercises.${fieldIndex}.reps`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <Label>Reps</Label>
                                                                        <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {exerciseIndex < section.exercises.length - 1 && <Separator className="my-4" />}
                                            </div>
                                        ) : null;
                                    })}
                                </CardContent>
                            </Card>
                        ))}
                         <Button type="submit" className="w-full">Log Completed Exercises</Button>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
