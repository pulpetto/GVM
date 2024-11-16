import { Equipment } from './equipment';
import { MuscleGroup } from './muscle-group';

export interface ExercisePreviewFull {
    custom: boolean;
    id: string;
    name: string;
    imagePreviewUrl: string;
    mainMuscleGroups: MuscleGroup[];
    secondaryMuscleGroups: MuscleGroup[];
    equipment: Equipment;
}
