"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Edit, Save, Trash2, X } from 'lucide-react';
import type { CustomExercise } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';


const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Other"];

const exerciseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  muscleGroup: z.string().min(1, "Please select a muscle group."),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface ManageExercisesProps {
  customExercises: CustomExercise[];
  addCustomExercise: (exercise: Omit<CustomExercise, 'id'>) => void;
  editCustomExercise: (exercise: CustomExercise) => void;
  deleteCustomExercise: (id: string) => void;
  onSheetClose?: () => void;
  isSheet?: boolean;
}

function ManageExercisesContent({ customExercises, addCustomExercise, editCustomExercise, deleteCustomExercise }: Omit<ManageExercisesProps, 'onSheetClose' | 'isSheet'>) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: { name: "", muscleGroup: "" },
  });

  const onAddSubmit = (data: ExerciseFormData) => {
    addCustomExercise(data);
    form.reset();
  };
  
  const onEditSubmit = (data: ExerciseFormData) => {
    if(!editingId) return;
    editCustomExercise({ id: editingId, ...data });
    setEditingId(null);
    form.reset();
  };

  const startEditing = (exercise: CustomExercise) => {
    setEditingId(exercise.id);
    form.reset(exercise);
  }

  const cancelEditing = () => {
    setEditingId(null);
    form.reset({ name: "", muscleGroup: "" });
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(editingId ? onEditSubmit : onAddSubmit)} className="space-y-4 p-4 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg">{editingId ? 'Edit Exercise' : 'Add New Exercise'}</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Cable Crossover" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="muscleGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Muscle Group</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a muscle group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MUSCLE_GROUPS.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            {editingId && (
              <Button type="button" variant="ghost" onClick={cancelEditing}><X className="mr-2"/>Cancel</Button>
            )}
            <Button type="submit"><Save className="mr-2"/>{editingId ? 'Save Changes' : 'Save Exercise'}</Button>
          </div>
        </form>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Your Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {customExercises.length > 0 ? (
            <ul className='space-y-2'>
              {customExercises.map(ex => (
                <li key={ex.id} className='flex items-center justify-between p-3 rounded-lg bg-card-foreground/5'>
                  <div>
                    <p className="font-medium">{ex.name}</p>
                    <p className="text-sm text-muted-foreground">{ex.muscleGroup}</p>
                  </div>
                  <div className='flex gap-1'>
                    <Button variant="ghost" size="icon" onClick={() => startEditing(ex)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className='text-destructive hover:text-destructive'>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the exercise "{ex.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCustomExercise(ex.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-muted-foreground text-center p-4'>You haven't added any custom exercises yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ManageExercises({ customExercises, addCustomExercise, editCustomExercise, deleteCustomExercise, isSheet = true }: ManageExercisesProps) {

  const commonProps = {
    customExercises,
    addCustomExercise,
    editCustomExercise,
    deleteCustomExercise
  };

  if (isSheet) {
    return (
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Manage Custom Exercises</SheetTitle>
          <SheetDescription>
            Add, edit, or delete your custom exercises.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ManageExercisesContent {...commonProps} />
        </div>
      </SheetContent>
    );
  }

  return <ManageExercisesContent {...commonProps} />;
}
