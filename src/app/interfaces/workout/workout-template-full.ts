import { ExercisePreview } from '../exercise-preview';
import { Set } from './set';

export interface WorkoutTemplateFull {
    id: string;
    name: string;
    exercises: {
        id: string;
        staticData: ExercisePreview;
        superSetColor: string | null;
        sets: Set[];
    }[];
}
