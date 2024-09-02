import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MuscleGroup } from '../interfaces/muscle-group';
import { map, Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';
import { Exercise } from '../interfaces/exercise';
import { Achievement } from '../interfaces/achievement';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor(private http: HttpClient) {}

    getExercises(): Observable<Exercise[]> {
        return this.http.get<Exercise[]>('assets/data/exercises.json');
    }

    getExerciseById(id: number): Observable<Exercise | null> {
        return this.getExercises().pipe(
            map((exercises: Exercise[]) => {
                const exercise = exercises.find(
                    (exercise) => exercise.id === id
                );

                return exercise ? exercise : null;
            })
        );
    }

    getMuscleGroups(): Observable<MuscleGroup[]> {
        return this.http.get<MuscleGroup[]>('assets/data/muscle-groups.json');
    }

    getEquipment(): Observable<Equipment[]> {
        return this.http.get<Equipment[]>('assets/data/equipment.json');
    }

    getAchievements(): Observable<Achievement[]> {
        return this.http.get<Achievement[]>('assets/data/achievements.json');
    }
}
