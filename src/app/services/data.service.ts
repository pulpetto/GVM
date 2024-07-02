import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MuscleGroup } from '../interfaces/muscle-group';
import { Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';
import { Exercise } from '../interfaces/exercise';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    getExercises(): Observable<Exercise[]> {
        return this.http.get<Exercise[]>('assets/data/exercises.json');
    }

    getMuscleGroups(): Observable<MuscleGroup[]> {
        return this.http.get<MuscleGroup[]>('assets/data/muscle-groups.json');
    }

    getEquipment(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>('assets/data/equipment.json');
    }
}
