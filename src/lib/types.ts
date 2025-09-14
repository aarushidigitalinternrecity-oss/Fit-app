export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

export type Workout = {
  id:string;
  date: string; // ISO string
  exercises: Exercise[];
};

export type PersonalRecord = {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string; // ISO string
};

export type PersonalGoal = {
  id: string;
  exerciseName: string;
  targetWeight: number;
  targetReps: number;
  deadline?: string; // ISO string
};

export type CustomExercise = {
  id: string;
  name: string;
  muscleGroup: string;
}

export type AppData = {
  workouts: Workout[];
  user: {
    name: string;
    goals: {
      weeklyWorkoutTarget: number;
    };
  },
  customExercises: CustomExercise[];
  personalGoals: PersonalGoal[];
};
