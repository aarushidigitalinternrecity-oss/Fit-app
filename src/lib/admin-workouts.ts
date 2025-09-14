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
      ],
    },
  ],
  Pull: [
    {
      title: "Warm-up",
      exercises: [
        { name: "Jumping Jacks", details: "3 rounds (1 min)", defaultSets: 3, defaultReps: 0 },
        { name: "Arm Circles", details: "2 sets of 15 reps", defaultSets: 2, defaultReps: 15 },
      ],
    },
    {
      title: "Back",
      exercises: [
        { name: "Pull-ups", details: "4 sets to failure", defaultSets: 4, defaultReps: 8 },
        { name: "Bent Over Barbell Row", details: "4 sets of 8-10 reps", defaultSets: 4, defaultReps: 9 },
        { name: "T-Bar Row", details: "3 sets of 10-12 reps", defaultSets: 3, defaultReps: 11 },
      ],
    },
    {
      title: "Biceps",
      exercises: [
        { name: "Barbell Curl", details: "3 sets of 8-12 reps", defaultSets: 3, defaultReps: 10 },
        { name: "Dumbbell Hammer Curl", details: "3 sets of 10-15 reps", defaultSets: 3, defaultReps: 12 },
        { name: "Concentration Curl", details: "3 sets of 12-15 reps", defaultSets: 3, defaultReps: 14 },
      ],
    },
  ],
  Legs: [
    {
      title: "Warm-up",
      exercises: [
        { name: "Bodyweight Squats", details: "3 sets of 20 reps", defaultSets: 3, defaultReps: 20 },
        { name: "Leg Swings", details: "2 sets of 15 reps per leg", defaultSets: 2, defaultReps: 15 },
      ],
    },
    {
      title: "Quads & Glutes",
      exercises: [
        { name: "Barbell Squat", details: "5 sets of 5 reps", defaultSets: 5, defaultReps: 5 },
        { name: "Leg Press", details: "4 sets of 10-12 reps", defaultSets: 4, defaultReps: 11 },
        { name: "Lunges", details: "3 sets of 10-12 reps per leg", defaultSets: 3, defaultReps: 11 },
      ],
    },
    {
      title: "Hamstrings & Calves",
      exercises: [
        { name: "Romanian Deadlift", details: "4 sets of 8-12 reps", defaultSets: 4, defaultReps: 10 },
        { name: "Seated Leg Curl", details: "3 sets of 12-15 reps", defaultSets: 3, defaultReps: 14 },
        { name: "Calf Raises", details: "5 sets of 15-20 reps", defaultSets: 5, defaultReps: 18 },
      ],
    },
  ],
};
