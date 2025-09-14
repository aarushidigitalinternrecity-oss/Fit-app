"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Target, Plus, Edit, Trash2, CheckCircle2, CalendarIcon } from "lucide-react";
import type { PersonalGoal, Workout, CustomExercise } from "@/lib/types";
import { calculatePersonalRecords } from '@/hooks/use-workout-data';
import { format, formatDistanceToNow } from 'date-fns';
import { PRELOADED_EXERCISES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const goalSchema = z.object({
    exerciseName: z.string().min(1, "Please select an exercise."),
    targetWeight: z.coerce.number().min(0, "Target weight must be positive."),
    targetReps: z.coerce.number().min(1, "Target reps must be at least 1."),
    deadline: z.date().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface PersonalGoalsProps {
    personalGoals: PersonalGoal[] | undefined;
    workouts: Workout[] | undefined;
    customExercises: CustomExercise[] | undefined;
    addPersonalGoal: (goal: Omit<PersonalGoal, 'id'>) => void;
    editPersonalGoal: (goal: PersonalGoal) => void;
    deletePersonalGoal: (id: string) => void;
}

const GoalForm = ({
    goal,
    availableExercises,
    onFormSubmit,
    onClose,
}: {
    goal?: PersonalGoal;
    availableExercises: { name: string; isCustom: boolean }[];
    onFormSubmit: (data: GoalFormData) => void;
    onClose: () => void;
}) => {
    const form = useForm<GoalFormData>({
        resolver: zodResolver(goalSchema),
        defaultValues: goal ? {
            ...goal,
            deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        } : {
            exerciseName: '',
            targetWeight: 0,
            targetReps: 5,
        },
    });

    const onSubmit = (data: GoalFormData) => {
        onFormSubmit(data);
        onClose();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="exerciseName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exercise</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select an exercise" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {availableExercises.map(ex => (
                                        <SelectItem key={ex.name} value={ex.name}>
                                            {ex.isCustom && "⭐ "} {ex.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="targetWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Weight (kg)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="targetReps"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Reps</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Deadline (Optional)</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit">{goal ? 'Save Changes' : 'Set Goal'}</Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default function PersonalGoals({ personalGoals, workouts, customExercises, addPersonalGoal, editPersonalGoal, deletePersonalGoal }: PersonalGoalsProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<PersonalGoal | undefined>(undefined);
    
    const personalRecords = useMemo(() => calculatePersonalRecords(workouts), [workouts]);

    const availableExercises = useMemo(() => {
        const custom = customExercises?.map(e => ({ ...e, isCustom: true })) ?? [];
        const preloaded = PRELOADED_EXERCISES.map(e => ({ name: e, isCustom: false }));
        const all = [...custom, ...preloaded];
        const uniqueNames = new Set<string>();
        return all.filter(ex => {
            if (uniqueNames.has(ex.name)) return false;
            uniqueNames.add(ex.name);
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [customExercises]);

    const handleFormSubmit = (data: GoalFormData) => {
        const goalData = {
            ...data,
            deadline: data.deadline?.toISOString(),
        };
        if (editingGoal) {
            editPersonalGoal({ ...editingGoal, ...goalData });
        } else {
            addPersonalGoal(goalData);
        }
    };
    
    const openEditForm = (goal: PersonalGoal) => {
        setEditingGoal(goal);
        setIsFormOpen(true);
    };

    const openAddForm = () => {
        setEditingGoal(undefined);
        setIsFormOpen(true);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Target className="text-primary" />
                    Personal Goals
                </CardTitle>
                <CardDescription>Set and track your fitness goals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {personalGoals && personalGoals.length > 0 ? (
                    personalGoals.map(goal => {
                        const pr = personalRecords.find(p => p.exerciseName === goal.exerciseName);
                        const currentWeight = pr?.weight ?? 0;
                        const progress = Math.min((currentWeight / goal.targetWeight) * 100, 100);
                        const isAchieved = currentWeight >= goal.targetWeight && (pr?.reps ?? 0) >= goal.targetReps;

                        return (
                            <div key={goal.id} className="bg-card-foreground/5 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-base">{goal.exerciseName}</p>
                                        <p className="text-sm text-primary font-bold">
                                            {goal.targetWeight}kg for {goal.targetReps} reps
                                        </p>
                                        {goal.deadline && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Due {formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => openEditForm(goal)}><Edit className="h-4 w-4"/></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this goal.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deletePersonalGoal(goal.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-medium text-muted-foreground">Progress</span>
                                        {isAchieved ? (
                                            <span className="text-xs font-bold text-green-400 flex items-center gap-1"><CheckCircle2 size={14}/> Achieved!</span>
                                        ) : (
                                            <span className="text-xs font-medium text-primary">{currentWeight} / {goal.targetWeight} kg</span>
                                        )}
                                    </div>
                                    <Progress value={progress} className={cn(isAchieved && '[&>*]:bg-green-400')} />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-4 h-[100px]">
                        <p>You haven't set any goals yet. Let's add one!</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full" onClick={openAddForm}>
                            <Plus className="mr-2" /> Add New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Set a New Goal'}</DialogTitle>
                        </DialogHeader>
                        <GoalForm 
                            goal={editingGoal} 
                            availableExercises={availableExercises} 
                            onFormSubmit={handleFormSubmit}
                            onClose={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
