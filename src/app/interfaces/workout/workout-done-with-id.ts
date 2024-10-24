import { RpeType } from '../../types/rpe-type';
import { SetType } from '../../types/set-type';
import { ClusterSet } from '../set-types/cluster-set';
import { DropSet } from '../set-types/drop-set';
import { TempoSet } from '../set-types/tempo-set';

export interface WorkoutDoneWithId {
    id: string;
    name: string;
    duration: number;
    dateStart: number;
    dateFinish: number;
    volume: number;
    totalSets: number;
    doneSets: number;
    exercises: {
        exerciseId: string;
        superSetColor: string | null;
        sets: {
            isDone: boolean;
            setNumber: number;
            setTypeName: SetType;
            weight: number;
            reps: number;
            rpe: RpeType;
            tempo?: TempoSet;
            dropsets?: DropSet[];
            clustersets?: ClusterSet[];
        }[];
    }[];
}
