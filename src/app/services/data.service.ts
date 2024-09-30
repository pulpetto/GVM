import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';
import { Achievement } from '../interfaces/achievement';
import { EquipmentName } from '../types/equipment-type';
import {
    collection,
    CollectionReference,
    Firestore,
    getDocs,
    onSnapshot,
    query,
} from '@angular/fire/firestore';
import { MuscleGroupName } from '../types/muscle-group-type';
import { MuscleGroup } from '../interfaces/muscle-group';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    firestore = inject(Firestore);

    constructor(private http: HttpClient) {}

    getExercises(): Observable<
        {
            id: number;
            name: string;
            imageUrl: string;
            muscleGroups: MuscleGroupName[];
            equipment: EquipmentName;
        }[]
    > {
        return this.http.get<
            {
                id: number;
                name: string;
                imageUrl: string;
                muscleGroups: MuscleGroupName[];
                equipment: EquipmentName;
            }[]
        >('assets/data/exercises.json');
    }

    getExerciseById(id: number): Observable<{
        id: number;
        name: string;
        imageUrl: string;
        muscleGroups: MuscleGroupName[];
        equipment: EquipmentName;
    } | null> {
        return this.getExercises().pipe(
            map(
                (
                    exercises: {
                        id: number;
                        name: string;
                        imageUrl: string;
                        muscleGroups: MuscleGroupName[];
                        equipment: EquipmentName;
                    }[]
                ) => {
                    const exercise = exercises.find(
                        (exercise) => exercise.id === id
                    );

                    return exercise ? exercise : null;
                }
            )
        );
    }

    getMuscleGroups(): Observable<
        {
            id: number;
            name: MuscleGroupName;
            imageUrl: string;
            focusOn: string;
        }[]
    > {
        return this.http.get<
            {
                id: number;
                name: MuscleGroupName;
                imageUrl: string;
                focusOn: string;
            }[]
        >('assets/data/muscle-groups.json');
    }

    getMuscleGroups2(): Observable<MuscleGroup[]> {
        const muscleGroupsRef: CollectionReference = collection(
            this.firestore,
            'muscleGroups'
        );

        const orderedMuscleGroupsQuery = query(muscleGroupsRef);

        // prettier-ignore
        return new Observable<{
            id: string;
            name: string;
            imageUrl: string;
        }[]>((observer) => {
            const unsubscribe = onSnapshot(
                orderedMuscleGroupsQuery,
                (querySnapshot) => {
                    const muscleGroup = querySnapshot.docs.map(
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

                    observer.next(muscleGroup);
                },
                (error) => {
                    observer.error(error);
                }
            );

            return { unsubscribe };
        });
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

    getMuscleGroups$(): Observable<MuscleGroup[]> {
        const muscleGroupsCollectionRef: CollectionReference = collection(
            this.firestore,
            'muscleGroups'
        );

        return from(
            getDocs(muscleGroupsCollectionRef).then((muscleGroupsSnapshot) => {
                const muscleGroups: MuscleGroup[] = [];

                muscleGroupsSnapshot.forEach((muscleGroupDoc) => {
                    const muscleGroup: MuscleGroup =
                        muscleGroupDoc.data() as MuscleGroup;

                    muscleGroup.id = muscleGroupDoc.id;

                    muscleGroups.push(muscleGroup);
                });

                return muscleGroups;
            })
        );
    }
}
