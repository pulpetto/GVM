import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MuscleGroup } from '../interfaces/muscle-group';
import { map, Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';
import { Exercise } from '../interfaces/exercise';
import { Achievement } from '../interfaces/achievement';
import { EquipmentName } from '../types/equipment-type';
import {
    collection,
    CollectionReference,
    Firestore,
    onSnapshot,
    query,
} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    firestore = inject(Firestore);

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

    getEquipment(): Observable<
        {
            id: number;
            name: EquipmentName;
            imageUrl: string;
        }[]
    > {
        return this.http.get<
            {
                id: number;
                name: EquipmentName;
                imageUrl: string;
            }[]
        >('assets/data/equipment.json');
    }

    getEquipment2(): Observable<Equipment[]> {
        const equipmentRef: CollectionReference = collection(
            this.firestore,
            'equipment'
        );

        const orderedEquipmentQuery = query(equipmentRef);

        // prettier-ignore
        return new Observable<{
            id: string;
            name: string;
            imageUrl: string;
        }[]>((observer) => {
            const unsubscribe = onSnapshot(
                orderedEquipmentQuery,
                (querySnapshot) => {
                    const equipment = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                name: doc.data()['name'],
                                imageUrl: doc.data()['imagePreviewUrl'],
                            } as {
                                id: string;
                                name: string;
                                imageUrl: string;
                            })
                    );

                    observer.next(equipment);
                },
                (error) => {
                    observer.error(error);
                }
            );

            return { unsubscribe };
        });
    }

    getAchievements(): Observable<Achievement[]> {
        return this.http.get<Achievement[]>('assets/data/achievements.json');
    }
}
