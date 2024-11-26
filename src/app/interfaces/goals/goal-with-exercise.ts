import { ExercisePreview } from '../exercise-preview';

export interface GoalWithExercise {
    id: string;
    targetWeight: number;
    currentWeight: number;
    exerciseData: ExercisePreview;
}
