"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import type { Workout, CustomExercise } from '@/lib/types';
import { PRELOADED_EXERCISES } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required."),
  sets: z.coerce.number().min(1, "Must be at least 1 set."),
  reps: z.coerce.number().min(1, "Must be at least 1 rep."),
  weight: z.coerce.number().min(0, "Weight can't be negative."),
});

const workoutSchema = z.object({
  exercises: z.array(exerciseSchema).min(1, "Add at least one exercise."),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

interface WorkoutLoggerProps {
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  customExercises: CustomExercise[] | undefined;
  onSheetClose: () => void;
}

export default function WorkoutLogger({ addWorkout, customExercises, onSheetClose }: WorkoutLoggerProps) {
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      exercises: [{ name: '', sets: 1, reps: 1, weight: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const availableExercises = useMemo(() => {
    const custom = customExercises?.map(e => ({ ...e, isCustom: true })) ?? [];
    const preloaded = PRELOADED_EXERCISES.map(e => ({ name: e, isCustom: false}));
    const all = [...custom, ...preloaded];
    
    // Deduplicate
    const uniqueNames = new Set<string>();
    return all.filter(ex => {
        if(uniqueNames.has(ex.name)) return false;
        uniqueNames.add(ex.name);
        return true;
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [customExercises]);

  const onSubmit = (data: WorkoutFormData) => {
    const newWorkout = {
      date: new Date().toISOString(),
      exercises: data.exercises.map(ex => ({ ...ex, id: crypto.randomUUID() })),
    };
    addWorkout(newWorkout);
    form.reset({ exercises: [{ name: '', sets: 1, reps: 1, weight: 0 }]});
    onSheetClose();
  };

  return (
    <SheetContent className="w-full h-full flex flex-col p-4 sm:p-6">
      <SheetHeader>
        <SheetTitle>Log New Workout</SheetTitle>
        <SheetDescription>
          Add your exercises for today's session.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <Accordion type="multiple" defaultValue={['item-0']} className="w-full space-y-4">
                {fields.map((field, index) => (
                <AccordionItem value={`item-${index}`} key={field.id} className="border-border border rounded-lg bg-card">
                    <AccordionTrigger className="p-4">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-semibold truncate">
                                {form.watch(`exercises.${index}.name`) || `Exercise ${index + 1}`}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name={`exercises.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Exercise Name</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an exercise" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {availableExercises.map(ex => (
                                            <SelectItem key={ex.name} value={ex.name}>
                                            {ex.isCustom && "⭐ "}
                                            {ex.name}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name={`exercises.${index}.sets`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sets</FormLabel>
                                    <FormControl>
                                    <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`exercises.${index}.reps`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reps</FormLabel>
                                    <FormControl>
                                    <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`exercises.${index}.weight`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                    <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            </div>
                            {fields.length > 1 && <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => remove(index)}
                            >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Exercise
                            </Button>}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
          </div>

          <SheetFooter className="mt-auto pt-4 flex-col sm:flex-col space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ name: '', sets: 1, reps: 1, weight: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
            <Button type="submit" className="w-full">Save Workout</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
}
