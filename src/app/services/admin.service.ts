import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    CollectionReference,
    deleteDoc,
    doc,
    Firestore,
    onSnapshot,
    query,
    updateDoc,
} from '@angular/fire/firestore';
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Step } from '../interfaces/step';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    firestore = inject(Firestore);
    storage = getStorage();

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

        const orderedMuscleGroupsQuery = query(muscleGroupsRef);

        // prettier-ignore
        return new Observable<{
            id: string;
            name: string;
            imagePreviewUrl: string;
            imageFilePath: string,
        }[]>((observer) => {
            const unsubscribe = onSnapshot(
                orderedMuscleGroupsQuery,
                (querySnapshot) => {
                    const muscleGroups = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                name: doc.data()['name'],
                                imagePreviewUrl: doc.data()['imagePreviewUrl'],
                                imageFilePath: doc.data()['imageFilePath'],
                            } as {
                                id: string;
                                name: string;
                                imagePreviewUrl: string;
                                imageFilePath: string,
                            })
                    );

                    observer.next(muscleGroups);
                },
                (error) => {
                    observer.error(error);
                }
            );

            return { unsubscribe };
        });
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

        const orderedEquipmentQuery = query(equipmentRef);

        // prettier-ignore
        return new Observable<{
            id: string;
            name: string;
            imagePreviewUrl: string;
            imageFilePath: string,
        }[]>((observer) => {
            const unsubscribe = onSnapshot(
                orderedEquipmentQuery,
                (querySnapshot) => {
                    const equipment = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                name: doc.data()['name'],
                                imagePreviewUrl: doc.data()['imagePreviewUrl'],
                                imageFilePath: doc.data()['imageFilePath'],
                            } as {
                                id: string;
                                name: string;
                                imagePreviewUrl: string;
                                imageFilePath: string,
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

        await addDoc(collection(this.firestore, 'exercises'), {
            name: name,
            imagePreviewUrl: imagePreviewUrl,
            imageFilePath: imageFilePath,
            mainMuscleGroupsIds: mainMuscleGroupsIds,
            secondaryMuscleGroupsIds: secondaryMuscleGroupsIds,
            equipmentId: equipmentId,
            instructionVideoPreviewUrl: videoPreviewUrl,
            instructionVideoFilePath: videoFilePath,
            instructionSteps: instructionSteps,
            variationsIds: variationsIds,
            alternativesIds: alternativesIds,
        });
    }
}
