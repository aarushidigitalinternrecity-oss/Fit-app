export type AdminExercise = {
  name: string;
  details: string; // e.g., "3 sets of 10-12 reps"
  defaultReps: number;
  defaultSets: number;
};

export type AdminWorkoutSection = {
  title: string;
  exercises: AdminExercise[];
};

export type AdminWorkout = {
  [key: string]: AdminWorkoutSection[];
};

export const ADMIN_WORKOUTS: AdminWorkout = {
  Push: [
    {
      title: "Boxing",
      exercises: [
        { name: "Shadow Boxing", details: "3 rounds (3 min)", defaultSets: 3, defaultReps: 0 },
        { name: "Jabs & Crosses", details: "3 rounds (3 min)", defaultSets: 3, defaultReps: 0 },
      ],
    },
    {
      title: "Dumbbell Exercises",
      exercises: [
        { name: "Dumbbell Bench Press", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Dumbbell Overhead Press", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
        { name: "Dumbbell Tricep Kickbacks", details: "3 sets of 12-15 reps per arm", defaultSets: 3, defaultReps: 14 },
        { name: "Dumbbell Pullover", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Dumbbell Flies", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Dumbbell Around the World", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
      ],
    },
    {
      title: "Barbell Exercises",
      exercises: [
        { name: "Barbell Bench Press", details: "4 sets of 6-8 reps", defaultSets: 4, defaultReps: 7 },
        { name: "Barbell Military Press", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
      ],
    },
    {
      title: "Landmine Exercises",
      exercises: [
        { name: "Landmine Press", details: "3 sets of 8-10 reps per side", defaultSets: 3, defaultReps: 9 },
        { name: "Landmine Tricep Extensions", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Landmine Chest Press", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
        { name: "Single Hand Landmine Push", details: "3 sets of 8-10 reps per side", defaultSets: 3, defaultReps: 9 },
      ],
    },
  ],
  Pull: [
    {
      title: "Boxing",
      exercises: [
        { name: "Speed Bag Drills", details: "3 sets of 2 min", defaultSets: 3, defaultReps: 0 },
        { name: "Heavy Bag Combinations", details: "3 rounds (3 min)", defaultSets: 3, defaultReps: 0 },
      ],
    },
    {
      title: "Dumbbell Exercises",
      exercises: [
        { name: "Dumbbell Rows", details: "3 sets of 10-12 reps per arm", defaultSets: 3, defaultReps: 11 },
        { name: "Dumbbell Bicep Curls", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Hammer Curls", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Dumbbell Bicep Pause and Curl", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
      ],
    },
    {
      title: "Barbell Exercises",
      exercises: [
        { name: "Barbell Rows", details: "4 sets of 6-8 reps", defaultSets: 4, defaultReps: 7 },
        { name: "Deadlifts", details: "3 sets of 6-8 reps", defaultSets: 3, defaultReps: 7 },
        { name: "Barbell Curls", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
      ],
    },
    {
      title: "Landmine Exercises",
      exercises: [
        { name: "Landmine Rows", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
        { name: "Landmine T-Bar Rows", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
        { name: "One Hand Landmine Row", details: "3 sets of 8-10 reps per arm", defaultSets: 3, defaultReps: 9 },
      ],
    },
  ],
  Legs: [
    {
      title: "Boxing",
      exercises: [
        { name: "Footwork Drills", details: "3 rounds (2 min)", defaultSets: 3, defaultReps: 0 },
        { name: "Jump Rope", details: "3 rounds (3 min)", defaultSets: 3, defaultReps: 0 },
      ],
    },
    {
      title: "Dumbbell Exercises",
      exercises: [
        { name: "Dumbbell Goblet Squats", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Dumbbell Lunges", details: "3 sets of 10-12 reps per leg", defaultSets: 3, defaultReps: 11 },
        { name: "Dumbbell Calf Raises", details: "3 sets of 15-20 reps", defaultSets: 3, defaultReps: 18 },
      ],
    },
    {
      title: "Barbell Exercises",
      exercises: [
        { name: "Barbell Squats", details: "4 sets of 6-8 reps", defaultSets: 4, defaultReps: 7 },
        { name: "Barbell Romanian Deadlifts", details: "3 sets of 8-10 reps", defaultSets: 3, defaultReps: 9 },
      ],
    },
    {
      title: "Landmine Exercises",
      exercises: [
        { name: "Landmine Squats", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
        { name: "Landmine Reverse Lunges", details: "3 sets of 10-12 reps per leg", defaultSets: 3, defaultReps: 11 },
      ],
    },
  ],
};
