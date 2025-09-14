"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Workout, CustomExercise } from '@/lib/types';
import { PRELOADED_EXERCISES } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useMemo } from 'react';

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
    <SheetContent className="sm:max-w-lg w-full overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Log New Workout</SheetTitle>
        <SheetDescription>
          Add your exercises for today's session. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 flex flex-col h-[calc(100%-4rem)]">
          <div className="space-y-4 flex-grow overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-background">
                <div className="grid grid-cols-1 gap-4">
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
                </div>
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
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>}
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 space-y-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ name: '', sets: 1, reps: 1, weight: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Exercise
            </Button>

            <SheetFooter>
                <Button type="submit" className="w-full">Save Workout</Button>
            </SheetFooter>
          </div>
        </form>
      </Form>
    </SheetContent>
  );
}
