import { RpeType } from '../../types/rpe-type';

export interface DropSet {
    weight: number | null;
    reps: number | null;
    rpe: RpeType;
}
