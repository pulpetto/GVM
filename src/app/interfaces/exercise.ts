import { EquipmentType } from '../types/equipment-type';
import { MuscleGroupName } from '../types/muscle-group-type';

export interface Exercise {
    id: number;
    name: string;
    imageUrl: string;
    muscleGroups: MuscleGroupName[];
    equipment: EquipmentType;
}
