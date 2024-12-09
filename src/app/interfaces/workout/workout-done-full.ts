import { ExercisePreview } from '../exercise-preview';
import { Set } from './set';

export interface WorkoutDoneFull {
    id: string;
    workoutTemplateId: string;
    name: string;
    duration: number;
    dateStart: number;
    volume: number;
    totalSets: number;
    setsDone: number;
    exercises: {
        exerciseId: string;
        staticData: ExercisePreview;
        superSetColor: string | null;
        sets: Set[];
    }[];
}
