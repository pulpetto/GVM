import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    collectionData,
    CollectionReference,
    deleteDoc,
    doc,
    Firestore,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from '@angular/fire/firestore';
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from '@angular/fire/storage';
import { from, map, Observable } from 'rxjs';
import { Step } from '../interfaces/step';
import { User } from '../interfaces/user';
import { ExercisePreview } from '../interfaces/exercise-preview';
import { Achievement } from '../interfaces/achievement';
import { Tier } from '../interfaces/tier';
import { ExerciseDetails } from '../interfaces/exercise-details';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    firestore = inject(Firestore);
    storage = getStorage();
    location = inject(Location);
    router = inject(Router);
    toastService = inject(ToastService);

    // ---------- Users ----------

    getUsers$(): Observable<User[]> {
        const usersCollectionRef: CollectionReference = collection(
            this.firestore,
            'users'
        );

        return from(
            getDocs(usersCollectionRef).then((usersSnapshot) => {
                const users: User[] = [];

                usersSnapshot.forEach((user) => {
                    users.push(user.data() as User);
                });

                return users;
            })
        );
    }

    // ---------- Muscle Groups ----------
    getMuscleGroups(): Observable<
        {
            id: string;
            name: string;
            imagePreviewUrl: string;
            imageFilePath: string;
        }[]
    > {
        const muscleGroupsRef: CollectionReference = collection(
            this.firestore,
            'muscleGroups'
        );

        const q = query(muscleGroupsRef, orderBy('name'));

        return collectionData(q, { idField: 'id' }).pipe(
            map((muscleGroups) =>
                (
                    muscleGroups as {
                        id: string;
                        name: string;
                        imagePreviewUrl: string;
                        imageFilePath: string;
                    }[]
                ).map((muscleGroup) => ({
                    ...muscleGroup,
                    id: muscleGroup.id,
                }))
            )
        );
    }

    async addNewMuscleGroup(name: string, imageFile: File): Promise<void> {
        const imageFilePath = `admin/muscleGroups/${Date.now()}_${name}`;
        const storageRef = ref(this.storage, imageFilePath);

        const snapshot = await uploadBytes(storageRef, imageFile);

        const imagePreviewUrl = await getDownloadURL(snapshot.ref);

        await addDoc(collection(this.firestore, 'muscleGroups'), {
            name: name,
            imagePreviewUrl: imagePreviewUrl,
            imageFilePath: imageFilePath,
        });
    }

    async modifyMuscleGroup(
        id: string,
        oldImageFilePath: string,
        newName: string,
        newImageFile: File | null
    ) {
        if (newImageFile) {
            // Delete old image
            const oldImageStorageRef = ref(this.storage, oldImageFilePath);
            await deleteObject(oldImageStorageRef);

            // Add new image
            const newImageFilePath = `admin/muscleGroups/${Date.now()}_${newName}`;
            const newImageStorageRef = ref(this.storage, newImageFilePath);
            const snapshot = await uploadBytes(
                newImageStorageRef,
                newImageFile
            );

            const imagePreviewUrl = await getDownloadURL(snapshot.ref);

            // Update document
            await updateDoc(doc(this.firestore, 'muscleGroups', id), {
                name: newName,
                imagePreviewUrl: imagePreviewUrl,
                imageFilePath: newImageFilePath,
            });
        } else {
            // Update document
            await updateDoc(doc(this.firestore, 'muscleGroups', id), {
                name: newName,
            });
        }
    }

    async deleteMuscleGroup(id: string, imageFilePath: string) {
        const storageRef = ref(this.storage, imageFilePath);

        await deleteObject(storageRef);

        await deleteDoc(doc(this.firestore, 'muscleGroups', id));
    }

    // ---------- Equipment ----------
    getEquipment(): Observable<
        {
            id: string;
            name: string;
            imagePreviewUrl: string;
            imageFilePath: string;
        }[]
    > {
        const equipmentRef: CollectionReference = collection(
            this.firestore,
            'equipment'
        );

        const q = query(equipmentRef, orderBy('name'));

        return collectionData(q, { idField: 'id' }).pipe(
            map((equipmentArr) =>
                (
                    equipmentArr as {
                        id: string;
                        name: string;
                        imagePreviewUrl: string;
                        imageFilePath: string;
                    }[]
                ).map((equipment) => ({
                    ...equipment,
                    id: equipment.id,
                }))
            )
        );
    }

    async addEquipment(name: string, imageFile: File) {
        const imageFilePath = `admin/equipment/${Date.now()}_${name}`;
        const storageRef = ref(this.storage, imageFilePath);

        const snapshot = await uploadBytes(storageRef, imageFile);

        const imagePreviewUrl = await getDownloadURL(snapshot.ref);

        await addDoc(collection(this.firestore, 'equipment'), {
            name: name,
            imagePreviewUrl: imagePreviewUrl,
            imageFilePath: imageFilePath,
        });
    }

    async modifyEquipment(
        id: string,
        oldImageFilePath: string,
        newName: string,
        newImageFile: File | null
    ) {
        if (newImageFile) {
            // Delete old image
            const oldImageStorageRef = ref(this.storage, oldImageFilePath);
            await deleteObject(oldImageStorageRef);

            // Add new image
            const newImageFilePath = `admin/equipment/${Date.now()}_${newName}`;
            const newImageStorageRef = ref(this.storage, newImageFilePath);
            const snapshot = await uploadBytes(
                newImageStorageRef,
                newImageFile
            );

            const imagePreviewUrl = await getDownloadURL(snapshot.ref);

            // Update document
            await updateDoc(doc(this.firestore, 'equipment', id), {
                name: newName,
                imagePreviewUrl: imagePreviewUrl,
                imageFilePath: newImageFilePath,
            });
        } else {
            // Update document
            await updateDoc(doc(this.firestore, 'equipment', id), {
                name: newName,
            });
        }
    }

    async deleteEquipment(id: string, imageFilePath: string) {
        const storageRef = ref(this.storage, imageFilePath);

        await deleteObject(storageRef);

        await deleteDoc(doc(this.firestore, 'equipment', id));
    }

    // ---------- Exercises ----------

    async addExercise(
        name: string,
        imageFile: File,
        mainMuscleGroupsIds: string[],
        secondaryMuscleGroupsIds: string[],
        equipmentId: string,
        instructionVideoFile: File,
        instructionSteps: Step[],
        variationsIds: string[],
        alternativesIds: string[]
    ) {
        try {
            // Image upload
            const imageFilePath = `admin/exercises/${Date.now()}_${name}`;
            const storageRef = ref(this.storage, imageFilePath);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const imagePreviewUrl = await getDownloadURL(snapshot.ref);

            // Video upload
            const videoFilePath = `admin/exercises/${Date.now()}_${name}_video`;
            const videoStorageRef = ref(this.storage, videoFilePath);
            const videoSnapshot = await uploadBytes(
                videoStorageRef,
                instructionVideoFile
            );
            const videoPreviewUrl = await getDownloadURL(videoSnapshot.ref);

            const newExerciseId = doc(
                collection(this.firestore, 'exercisePreviews')
            ).id;

            await setDoc(
                doc(this.firestore, 'exercisePreviews', newExerciseId),
                {
                    custom: false,
                    name: name,
                    imagePreviewUrl: imagePreviewUrl,
                    mainMuscleGroupsIds: mainMuscleGroupsIds,
                    secondaryMuscleGroupsIds: secondaryMuscleGroupsIds,
                    equipmentId: equipmentId,
                }
            );

            await setDoc(
                doc(this.firestore, 'exerciseDetails', newExerciseId),
                {
                    imageFilePath: imageFilePath,
                    instructionVideoPreviewUrl: videoPreviewUrl,
                    instructionVideoFilePath: videoFilePath,
                    instructionSteps: instructionSteps,
                    variationsIds: variationsIds,
                    alternativesIds: alternativesIds,
                }
            );

            this.toastService.show('Exercise added successfully!', false);

            if (window.history.length > 1) {
                this.location.back();
            } else {
                this.router.navigate(['user/admin/exercises']);
            }
        } catch (error) {
            console.error(error);
            this.toastService.show('Error occured, try again', true);

            if (window.history.length > 1) {
                this.location.back();
            } else {
                this.router.navigate(['user/admin/exercises']);
            }
        }
    }

    async updateExercise(
        name: string,
        imageFile: File,
        mainMuscleGroupsIds: string[],
        secondaryMuscleGroupsIds: string[],
        equipmentId: string,
        instructionVideoFile: File,
        instructionSteps: Step[],
        variationsIds: string[],
        alternativesIds: string[],
        oldExerciseDetails: ExerciseDetails,
        id: string
    ) {
        try {
            if (imageFile instanceof File) {
                // Old image delete
                const oldImageStorageRef = ref(
                    this.storage,
                    oldExerciseDetails.imageFilePath
                );
                await deleteObject(oldImageStorageRef);

                // Image upload
                const imageFilePath = `admin/exercises/${Date.now()}_${name}`;
                const storageRef = ref(this.storage, imageFilePath);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const imagePreviewUrl = await getDownloadURL(snapshot.ref);

                await updateDoc(doc(this.firestore, 'exercisePreviews', id), {
                    imagePreviewUrl: imagePreviewUrl,
                });

                await updateDoc(doc(this.firestore, 'exerciseDetails', id), {
                    imageFilePath: imageFilePath,
                });
            }

            if (instructionVideoFile instanceof File) {
                // Old video delete
                const oldVideoStorageRef = ref(
                    this.storage,
                    oldExerciseDetails.instructionVideoFilePath
                );
                await deleteObject(oldVideoStorageRef);

                // Video upload
                const videoFilePath = `admin/exercises/${Date.now()}_${name}_video`;
                const videoStorageRef = ref(this.storage, videoFilePath);
                const videoSnapshot = await uploadBytes(
                    videoStorageRef,
                    instructionVideoFile
                );
                const videoPreviewUrl = await getDownloadURL(videoSnapshot.ref);

                await setDoc(doc(this.firestore, 'exerciseDetails', id), {
                    instructionVideoPreviewUrl: videoPreviewUrl,
                    instructionVideoFilePath: videoFilePath,
                });
            }

            await updateDoc(doc(this.firestore, 'exercisePreviews', id), {
                name: name,
                mainMuscleGroupsIds: mainMuscleGroupsIds,
                secondaryMuscleGroupsIds: secondaryMuscleGroupsIds,
                equipmentId: equipmentId,
            });

            await updateDoc(doc(this.firestore, 'exerciseDetails', id), {
                instructionSteps: instructionSteps,
                variationsIds: variationsIds,
                alternativesIds: alternativesIds,
            });

            this.toastService.show('Exercise updated successfully!', false);

            if (window.history.length > 1) {
                this.location.back();
            } else {
                this.router.navigate(['user/admin/exercises']);
            }
        } catch (error) {
            console.error(error);
            this.toastService.show('Error occured, try again', true);

            if (window.history.length > 1) {
                this.location.back();
            } else {
                this.router.navigate(['user/admin/exercises']);
            }
        }
    }

    getExercisesPreviews$(): Observable<ExercisePreview[]> {
        const exercisesRef: CollectionReference = collection(
            this.firestore,
            'exercisePreviews'
        );

        const q = query(exercisesRef, orderBy('name'));

        return collectionData(q, { idField: 'id' }).pipe(
            map((exercises) =>
                (exercises as ExercisePreview[]).map((exercise) => ({
                    ...exercise,
                    id: exercise.id,
                }))
            )
        );
    }

    // ---------- Achievements ----------

    async addAchievement(
        thumbnailFile: File,
        name: string,
        type: string,
        description: string,
        tiers: Tier[]
    ) {
        const imageFilePath = `admin/achievements/${Date.now()}_${name}`;
        const storageRef = ref(this.storage, imageFilePath);

        const snapshot = await uploadBytes(storageRef, thumbnailFile);

        const imagePreviewUrl = await getDownloadURL(snapshot.ref);

        await addDoc(collection(this.firestore, 'achievements'), {
            name: name,
            description: description,
            type: type,
            imgPreviewUrl: imagePreviewUrl,
            imgPath: imageFilePath,
            tiers: tiers,
        });
    }

    async modifyAchievement(
        thumbnailFile: File | string,
        name: string,
        type: string,
        description: string,
        tiers: Tier[],
        oldAchievementObj: Achievement
    ) {
        if (thumbnailFile instanceof File) {
            const oldImageStorageRef = ref(
                this.storage,
                oldAchievementObj.imgPath
            );
            await deleteObject(oldImageStorageRef);

            const imageFilePath = `admin/achievements/${Date.now()}_${name}`;
            const storageRef = ref(this.storage, imageFilePath);

            const snapshot = await uploadBytes(storageRef, thumbnailFile);

            const imagePreviewUrl = await getDownloadURL(snapshot.ref);

            await updateDoc(
                doc(this.firestore, 'achievements', oldAchievementObj.id),
                {
                    name: name,
                    description: description,
                    type: type,
                    imgPreviewUrl: imagePreviewUrl,
                    imgPath: imageFilePath,
                    tiers: tiers,
                }
            );
        } else {
            await updateDoc(
                doc(this.firestore, 'achievements', oldAchievementObj.id),
                {
                    name: name,
                    description: description,
                    type: type,
                    tiers: tiers,
                }
            );
        }
    }

    getAchievements$(): Observable<Achievement[]> {
        const achievementsCollectionRef: CollectionReference = collection(
            this.firestore,
            'achievements'
        );

        const q = query(achievementsCollectionRef, orderBy('name'));

        return collectionData(q, { idField: 'id' }).pipe(
            map((achievements) =>
                (achievements as Achievement[]).map((achievement) => ({
                    ...achievement,
                    id: achievement.id,
                }))
            )
        );
    }
}
