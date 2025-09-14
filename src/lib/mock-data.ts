import type { AppData } from '@/lib/types';
import { subDays, addMonths } from 'date-fns';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const PRELOADED_EXERCISES = [
  'Bench Press',
  'Incline Dumbbell Press',
  'Tricep Pushdown',
  'Squat',
  'Leg Press',
  'Leg Curl',
  'Deadlift',
  'Pull Ups',
  'Barbell Row',
  'Overhead Press',
  'Lateral Raises',
];

export const MOCK_DATA: AppData = {
  workouts: [
    {
      id: generateId(),
      date: subDays(new Date(), 1).toISOString(),
      exercises: [
        { id: generateId(), name: 'Bench Press', sets: 4, reps: 8, weight: 100 },
        { id: generateId(), name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 30 },
        { id: generateId(), name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 25 },
      ],
    },
    {
      id: generateId(),
      date: subDays(new Date(), 2).toISOString(),
      exercises: [
        { id: generateId(), name: 'Squat', sets: 5, reps: 5, weight: 120 },
        { id: generateId(), name: 'Leg Press', sets: 3, reps: 10, weight: 200 },
        { id: generateId(), name: 'Leg Curl', sets: 3, reps: 12, weight: 50 },
      ],
    },
    {
      id: generateId(),
      date: subDays(new Date(), 4).toISOString(),
      exercises: [
        { id: generateId(), name: 'Deadlift', sets: 3, reps: 5, weight: 150 },
        { id: generateId(), name: 'Pull Ups', sets: 4, reps: 8, weight: 0 },
        { id: generateId(), name: 'Barbell Row', sets: 3, reps: 8, weight: 70 },
      ],
    },
    {
      id: generateId(),
      date: subDays(new Date(), 6).toISOString(),
      exercises: [
        { id: generateId(), name: 'Bench Press', sets: 4, reps: 8, weight: 95 },
        { id: generateId(), name: 'Overhead Press', sets: 4, reps: 8, weight: 50 },
        { id: generateId(), name: 'Lateral Raises', sets: 3, reps: 15, weight: 10 },
      ],
    },
     {
      id: generateId(),
      date: subDays(new Date(), 8).toISOString(),
      exercises: [
        { id: generateId(), name: 'Squat', sets: 5, reps: 5, weight: 115 },
      ],
    },
  ],
  user: {
    name: 'Alex',
    goals: {
      weeklyWorkoutTarget: 4,
    },
  },
  customExercises: [
    { id: generateId(), name: 'Cable Crossover', muscleGroup: 'Chest' },
    { id: generateId(), name: 'Hammer Curls', muscleGroup: 'Arms' },
  ],
  personalGoals: [
    { id: generateId(), exerciseName: 'Bench Press', targetWeight: 110, targetReps: 5, deadline: addMonths(new Date(), 1).toISOString() },
    { id: generateId(), exerciseName: 'Squat', targetWeight: 130, targetReps: 5 },
    { id: generateId(), exerciseName: 'Pull Ups', targetWeight: 0, targetReps: 12 },
  ],
};
