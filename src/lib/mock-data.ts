
import type { AppData } from '@/lib/types';
import { subDays, addMonths } from 'date-fns';

const generateId = () => crypto.randomUUID();

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
        { id: generateId(), name: 'Bench Press', sets: [
            { id: generateId(), weight: 100, reps: 8, completed: true },
            { id: generateId(), weight: 100, reps: 8, completed: true },
            { id: generateId(), weight: 100, reps: 7, completed: true },
            { id: generateId(), weight: 100, reps: 6, completed: true },
        ]},
        { id: generateId(), name: 'Incline Dumbbell Press', sets: [
            { id: generateId(), weight: 30, reps: 10, completed: true },
            { id: generateId(), weight: 30, reps: 10, completed: true },
            { id: generateId(), weight: 30, reps: 9, completed: true },
        ] },
        { id: generateId(), name: 'Tricep Pushdown', sets: [
            { id: generateId(), weight: 25, reps: 12, completed: true },
            { id: generateId(), weight: 25, reps: 12, completed: true },
            { id: generateId(), weight: 25, reps: 11, completed: true },
        ]},
      ],
    },
    {
      id: generateId(),
      date: subDays(new Date(), 3).toISOString(),
      exercises: [
        { id: generateId(), name: 'Squat', sets: [
            { id: generateId(), weight: 120, reps: 5, completed: true },
            { id: generateId(), weight: 120, reps: 5, completed: true },
            { id: generateId(), weight: 120, reps: 5, completed: true },
            { id: generateId(), weight: 120, reps: 5, completed: true },
            { id: generateId(), weight: 120, reps: 5, completed: true },
        ]},
        { id: generateId(), name: 'Leg Press', sets: [
            { id: generateId(), weight: 200, reps: 10, completed: true },
            { id: generateId(), weight: 200, reps: 10, completed: true },
            { id: generateId(), weight: 200, reps: 10, completed: true },
        ]},
        { id: generateId(), name: 'Leg Curl', sets: [
            { id: generateId(), weight: 50, reps: 12, completed: true },
            { id: generateId(), weight: 50, reps: 12, completed: true },
            { id: generateId(), weight: 50, reps: 12, completed: true },
        ]},
      ],
    },
    {
      id: generateId(),
      date: subDays(new Date(), 5).toISOString(),
      exercises: [
        { id: generateId(), name: 'Deadlift', sets: [
            { id: generateId(), weight: 150, reps: 5, completed: true },
            { id: generateId(), weight: 150, reps: 4, completed: true },
            { id: generateId(), weight: 150, reps: 4, completed: true },
        ]},
        { id: generateId(), name: 'Pull Ups', sets: [
            { id: generateId(), weight: 0, reps: 8, completed: true },
            { id: generateId(), weight: 0, reps: 8, completed: true },
            { id: generateId(), weight: 0, reps: 7, completed: true },
            { id: generateId(), weight: 0, reps: 6, completed: true },
        ] },
        { id: generateId(), name: 'Barbell Row', sets: [
            { id: generateId(), weight: 70, reps: 8, completed: true },
            { id: generateId(), weight: 70, reps: 8, completed: true },
            { id: generateId(), weight: 70, reps: 8, completed: true },
        ]},
      ],
    },
    {
      id: generateId(),
      date: subDays(new Date(), 7).toISOString(),
      exercises: [
        { id: generateId(), name: 'Bench Press', sets: [
            { id: generateId(), weight: 95, reps: 8, completed: true },
            { id: generateId(), weight: 95, reps: 8, completed: true },
            { id: generateId(), weight: 95, reps: 8, completed: true },
            { id: generateId(), weight: 95, reps: 8, completed: true },
        ]},
        { id: generateId(), name: 'Overhead Press', sets: [
             { id: generateId(), weight: 50, reps: 8, completed: true },
             { id: generateId(), weight: 50, reps: 8, completed: true },
             { id: generateId(), weight: 50, reps: 7, completed: true },
             { id: generateId(), weight: 50, reps: 6, completed: true },
        ]},
        { id: generateId(), name: 'Lateral Raises', sets: [
            { id: generateId(), weight: 10, reps: 15, completed: true },
            { id: generateId(), weight: 10, reps: 15, completed: true },
            { id: generateId(), weight: 10, reps: 14, completed: true },
        ]},
      ],
    },
     {
      id: generateId(),
      date: subDays(new Date(), 10).toISOString(),
      exercises: [
        { id: generateId(), name: 'Squat', sets: [
            { id: generateId(), weight: 115, reps: 5, completed: true },
            { id: generateId(), weight: 115, reps: 5, completed: true },
            { id: generateId(), weight: 115, reps: 5, completed: true },
        ]},
      ],
    },
    {
      id: generateId(),
      date: subDays(new Date(), 12).toISOString(),
      exercises: [
        { id: generateId(), name: 'Bench Press', sets: [
            { id: generateId(), weight: 90, reps: 10, completed: true },
            { id: generateId(), weight: 90, reps: 10, completed: true },
            { id: generateId(), weight: 90, reps: 9, completed: true },
        ]},
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
