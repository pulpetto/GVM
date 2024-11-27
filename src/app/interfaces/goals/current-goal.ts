import { ExercisePreview } from '../exercise-preview';

export interface CurrentGoal {
    id: string;
    current1rm: number;
    goal1rm: number;
    percentageProgress: number;
    exerciseData: ExercisePreview;
}
