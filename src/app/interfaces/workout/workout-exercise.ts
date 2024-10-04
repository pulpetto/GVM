import { Set } from './set';

export interface WorkoutExercise {
    exerciseId: string;
    superSetColor: string | null;
    sets: Set[];
}
