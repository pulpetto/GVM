import { WorkoutExercise } from './workout-exercise';

export interface Workout {
    workoutName: string;
    exercises: WorkoutExercise[];
}
