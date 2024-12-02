import { Tier } from './tier';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    imgPreviewUrl: string;
    imgPath: string;
    requiredNumber: number;
    type: string;
    tiers: Tier[];
}
