
"use client";

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';
import type { Workout, CustomExercise, ExerciseSet } from '@/lib/types';
import { PRELOADED_EXERCISES } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useMemo, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';

const exerciseSetSchema = z.object({
  id: z.string(),
  reps: z.coerce.number().min(0, "Reps can't be negative.").default(0),
  weight: z.coerce.number().min(0, "Weight can't be negative.").default(0),
  completed: z.boolean().default(false),
});

const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Exercise name is required."),
  sets: z.array(exerciseSetSchema),
});

const workoutSchema = z.object({
  exercises: z.array(exerciseSchema).min(1, "Add at least one exercise."),
});

export type WorkoutFormData = z.infer<typeof workoutSchema>;

interface WorkoutLoggerProps {
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  customExercises: CustomExercise[] | undefined;
  onSheetClose: () => void;
  suggestedWorkout?: Omit<WorkoutFormData, 'id'>;
}

const createNewSet = (): z.infer<typeof exerciseSetSchema> => ({
  id: crypto.randomUUID(),
  reps: 10,
  weight: 0,
  completed: false,
});

const createNewExercise = (): z.infer<typeof exerciseSchema> => ({
  id: crypto.randomUUID(),
  name: '',
  sets: [createNewSet()],
});

export default function WorkoutLogger({ addWorkout, customExercises, onSheetClose, suggestedWorkout }: WorkoutLoggerProps) {
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      exercises: [createNewExercise()],
    },
  });

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise, replace: replaceExercises } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  useEffect(() => {
    if (suggestedWorkout) {
        const suggested = suggestedWorkout.exercises.map(ex => ({
            id: crypto.randomUUID(),
            name: ex.name,
            sets: Array.from({ length: ex.sets.length > 0 ? ex.sets.length : 4 }, (_, i) => ({ // Fallback to 4 sets
                id: crypto.randomUUID(),
                reps: ex.sets[i]?.reps ?? 10,
                weight: ex.sets[i]?.weight ?? 0,
                completed: false,
            }))
        }))
        replaceExercises(suggested);
    }
  }, [suggestedWorkout, replaceExercises]);

  const availableExercises = useMemo(() => {
    const custom = customExercises?.map(e => ({ ...e, isCustom: true })) ?? [];
    const preloaded = PRELOADED_EXERCISES.map(e => ({ name: e, isCustom: false}));
    const all = [...custom, ...preloaded];
    
    const uniqueNames = new Set<string>();
    return all.filter(ex => {
        if(uniqueNames.has(ex.name)) return false;
        uniqueNames.add(ex.name);
        return true;
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [customExercises]);

  const onSubmit = (data: WorkoutFormData) => {
    const newWorkout: Omit<Workout, 'id'> = {
      date: new Date().toISOString(),
      exercises: data.exercises
        .filter(ex => ex.name && ex.sets.some(s => s.completed)) // Only include exercises with a name and at least one completed set
        .map(ex => ({
          ...ex,
          sets: ex.sets.filter(s => s.completed), // Only include completed sets
        })),
    };

    if (newWorkout.exercises.length > 0) {
        addWorkout(newWorkout);
    }
    form.reset({ exercises: [createNewExercise()]});
    onSheetClose();
  };

  const accordionDefaultValues = useMemo(() => exerciseFields.map(field => `item-${field.id}`), [exerciseFields]);

  return (
    <SheetContent className="w-full h-full flex flex-col p-4 sm:p-6 sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>{suggestedWorkout ? 'Log Suggested Workout' : 'Log New Workout'}</SheetTitle>
        <SheetDescription>
          {suggestedWorkout ? 'Adjust and confirm the details for your session.' : 'Add your exercises for today\'s session.'}
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <Accordion type="multiple" defaultValue={accordionDefaultValues} className="w-full space-y-4">
                {exerciseFields.map((exerciseField, exerciseIndex) => (
                <AccordionItem value={`item-${exerciseField.id}`} key={exerciseField.id} className="border-border border rounded-lg bg-card">
                    <AccordionTrigger className="p-4 hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                            <span className="font-semibold truncate pr-2">
                                {form.watch(`exercises.${exerciseIndex}.name`) || `Exercise ${exerciseIndex + 1}`}
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <ExerciseFormFields exerciseIndex={exerciseIndex} availableExercises={availableExercises} removeExercise={removeExercise} exerciseFields={exerciseFields} />
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
              onClick={() => appendExercise(createNewExercise())}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Exercise
            </Button>
            <Button type="submit" className="w-full">Save Workout</Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
}


function ExerciseFormFields({ exerciseIndex, availableExercises, removeExercise, exerciseFields }: { exerciseIndex: number, availableExercises: any[], removeExercise: (index: number) => void, exerciseFields: any[] }) {
    const { control, watch } = useFormContext<WorkoutFormData>();
    const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
        control,
        name: `exercises.${exerciseIndex}.sets`
    });

    const exerciseName = watch(`exercises.${exerciseIndex}.name`);

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name={`exercises.${exerciseIndex}.name`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Exercise Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
            
            <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-2 items-center text-sm font-medium text-muted-foreground px-2">
                    <span className="text-center">Set</span>
                    <span className="text-center">Weight (kg)</span>
                    <span className="text-center">Reps</span>
                    <span className="text-center">Done</span>
                </div>
                 {setFields.map((setField, setIndex) => (
                    <div key={setField.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-x-2 items-center">
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
                            render={({ field }) => (
                                <div className="flex justify-center">
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            )}
                        />
                    </div>
                ))}
            </div>
           
            <div className='flex gap-2'>
                <Button type="button" variant="outline" size="sm" onClick={() => appendSet(createNewSet())} className='flex-1'><Plus className="mr-2"/>Add Set</Button>
                {setFields.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeSet(setFields.length - 1)} className='flex-1'><Trash2 className="mr-2"/>Remove Set</Button>}
            </div>

            <Separator />
            
            {exerciseFields.length > 1 && (
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => removeExercise(exerciseIndex)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove {exerciseName || 'Exercise'}
                </Button>
            )}
        </div>
    );
}
