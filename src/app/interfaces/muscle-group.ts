import { MuscleGroupName } from '../types/muscle-group-type';

export interface MuscleGroup {
    id: number;
    name: MuscleGroupName;
    imageUrl: string;
    focusOn: string;
}
