import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipment';
import { Achievement } from '../interfaces/achievement';
import {
    collection,
    CollectionReference,
    doc,
    DocumentReference,
    Firestore,
    getDoc,
    getDocs,
    orderBy,
    query,
} from '@angular/fire/firestore';
import { MuscleGroup } from '../interfaces/muscle-group';
import { ExercisePreview } from '../interfaces/exercise-preview';
import { ExerciseDetails } from '../interfaces/exercise-details';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    firestore = inject(Firestore);

    getAchievementById$(id: string): Observable<Achievement> {
        const achievementDocRef: DocumentReference = doc(
            this.firestore,
            'achievements',
            id
        );

        return from(
            getDoc(achievementDocRef).then((achievementSnapshot) => {
                const achievement: Achievement =
                    achievementSnapshot.data() as Achievement;

                achievement.id = id;

                return achievement;
            })
        );
    }

    getAchievements$(): Observable<Achievement[]> {
        const achievementsCollectionRef: CollectionReference = collection(
            this.firestore,
            'achievements'
        );

        const q = query(achievementsCollectionRef, orderBy('name'));

        return from(
            getDocs(q).then((snapshot) =>
                snapshot.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        } as Achievement)
                )
            )
        );
    }

    getMuscleGroup$(id: string): Observable<MuscleGroup> {
        const muscleGroupDocRef: DocumentReference = doc(
            this.firestore,
            'muscleGroups',
            id
        );

        return from(
            getDoc(muscleGroupDocRef).then((muscleGroupSnapshot) => {
                const muscleGroup: MuscleGroup =
                    muscleGroupSnapshot.data() as MuscleGroup;

                muscleGroup.id = id;

                return muscleGroup;
            })
        );
    }

    getMuscleGroups$(): Observable<MuscleGroup[]> {
        const muscleGroupsCollectionRef: CollectionReference = collection(
            this.firestore,
            'muscleGroups'
        );

        const q = query(muscleGroupsCollectionRef, orderBy('name'));

        return from(
            getDocs(q).then((muscleGroupsSnapshot) => {
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

    getEquipmentById$(id: string): Observable<Equipment> {
        const equipmentDocRef: DocumentReference = doc(
            this.firestore,
            'equipment',
            id
        );

        return from(
            getDoc(equipmentDocRef).then((equipmentSnapshot) => {
                const equipment: Equipment =
                    equipmentSnapshot.data() as Equipment;

                equipment.id = id;

                return equipment;
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
