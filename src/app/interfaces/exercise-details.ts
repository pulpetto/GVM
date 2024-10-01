import { Step } from './step';

export interface ExerciseDetails {
    imageFilePath: string;
    instructionVideoPreviewUrl: string;
    instructionVideoFilePath: string;
    instructionSteps: Step[];
    variationsIds: string[];
    alternativesIds: string[];
}
