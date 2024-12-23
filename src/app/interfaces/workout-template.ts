import { WorkoutExercise } from './workout/workout-exercise';

export interface WorkoutTemplate {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
}
