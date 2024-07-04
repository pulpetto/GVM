import { MuscleGroupName } from '../types/muscle-group-type';

export interface Exercise {
    id: number;
    name: string;
    imageUrl: string;
    muscleGroups: MuscleGroupName[];
}
