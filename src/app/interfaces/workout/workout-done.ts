import { Set } from './set';

export interface WorkoutDone {
    name: string;
    duration: number;
    dateStart: number;
    volume: number;
    totalSets: number;
    doneSets: number;
    exercises: {
        exerciseId: string;
        superSetColor: string | null;
        sets: Set[];
    }[];
    exercisesIds: string[];
}
