import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MuscleGroup } from '../interfaces/muscle-group';
import { Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    getMuscleGroups(): Observable<MuscleGroup[]> {
        return this.http.get<MuscleGroup[]>('assets/data/muscle-groups.json');
    }

    getEquipment(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>('assets/data/equipment.json');
    }
}
