import { RpeType } from '../../types/rpe-type';

export interface ClusterSet {
    restTime: number | null;
    reps: number | null;
    rpe: RpeType;
}
