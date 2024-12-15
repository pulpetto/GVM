import { WorkoutExercise } from './workout/workout-exercise';

export interface WorkoutTemplate {
    name: string;
    exercises: WorkoutExercise[];
}
