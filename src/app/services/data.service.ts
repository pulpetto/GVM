import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';
import { Achievement } from '../interfaces/achievement';
import { EquipmentName } from '../types/equipment-type';
import {
    collection,
    CollectionReference,
    doc,
    Firestore,
    getDoc,
    getDocs,
} from '@angular/fire/firestore';
import { MuscleGroupName } from '../types/muscle-group-type';
import { MuscleGroup } from '../interfaces/muscle-group';
import { ExercisePreview } from '../interfaces/exercise-preview';
import { ExerciseDetails } from '../interfaces/exercise-details';

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

    getEquipment$(): Observable<Equipment[]> {
        const equipmentCollectionRef: CollectionReference = collection(
            this.firestore,
            'equipment'
        );

        return from(
            getDocs(equipmentCollectionRef).then((equipmentSnapshot) => {
                const equipment: Equipment[] = [];

                equipmentSnapshot.forEach((equipmentDoc) => {
                    const equipmentItem: Equipment =
                        equipmentDoc.data() as Equipment;

                    equipmentItem.id = equipmentDoc.id;

                    equipment.push(equipmentItem);
                });

                return equipment;
            })
        );
    }

    getExercisePreview$(id: string): Observable<ExercisePreview> {
        const exerciseDocRef = doc(this.firestore, 'exercisePreviews', id);

        return from(
            getDoc(exerciseDocRef).then((exerciseDoc) => {
                const exercisePreview = exerciseDoc.data() as ExercisePreview;

                exercisePreview.id = exerciseDoc.id;

                return exercisePreview;
            })
        );
    }

    getExercisesPreviews$(): Observable<ExercisePreview[]> {
        const exerciseCollectionRef = collection(
            this.firestore,
            'exercisePreviews'
        );

        return from(
            getDocs(exerciseCollectionRef).then((exercisesSnapshot) => {
                const exercises: ExercisePreview[] = [];

                exercisesSnapshot.forEach((exerciseDoc) => {
                    const exercise: ExercisePreview =
                        exerciseDoc.data() as ExercisePreview;

                    exercise.id = exerciseDoc.id;

                    exercises.push(exercise);
                });

                return exercises;
            })
        );
    }

    getExerciseDetails$(id: string): Observable<ExerciseDetails> {
        const exerciseDocRef = doc(this.firestore, 'exerciseDetails', id);

        return from(
            getDoc(exerciseDocRef).then((exerciseDoc) => {
                const exerciseDetails = exerciseDoc.data() as ExerciseDetails;

                return exerciseDetails;
            })
        );
    }
}
