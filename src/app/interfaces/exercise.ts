import { Step } from './step';

export interface Exercise {
    id: string;
    name: string;
    imagePreviewUrl: string;
    mainMuscleGroupsIds: string[];
    secondaryMuscleGroupsIds: string[];
    equipmentId: string[];
    instructionVideoUrl: string;
    instructionSteps: Step[];
    variationsIds: string[];
    alternativesIds: string[];
}
