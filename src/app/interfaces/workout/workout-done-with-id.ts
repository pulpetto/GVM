import { Set } from './set';

export interface WorkoutDoneWithId {
    id: string;
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
}
