import { RpeType } from '../../types/rpe-type';
import { SetType } from '../../types/set-type';
import { DropSet } from '../set-types/drop-set';
import { TempoSet } from '../set-types/tempo-set';

export interface Set {
    setNumber: number;
    setTypeName: SetType;
    weight: number;
    reps: number;
    rpe: RpeType;
    tempo?: TempoSet;
    dropsets?: DropSet[];
    clustersets?: DropSet[];
}
