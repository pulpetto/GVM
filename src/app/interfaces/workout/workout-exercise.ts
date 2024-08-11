import { Set } from './set';

export interface WorkoutExercise {
    exerciseId: number;
    superSetColor: string | null;
    sets: Set[];
}
