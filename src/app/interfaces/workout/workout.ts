import { WorkoutExercise } from './workout-exercise';

export interface Workout {
    name: string;
    exercises: WorkoutExercise[];
}
