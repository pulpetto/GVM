import { WorkoutTemplateFull } from './workout/workout-template-full';

export interface WorkoutSplitFull {
    id: string;
    name: string;
    workoutsTemplates: {
        index: number;
        template: WorkoutTemplateFull;
    }[];
}
