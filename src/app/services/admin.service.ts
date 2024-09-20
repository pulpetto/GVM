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

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    firestore = inject(Firestore);
    storage = getStorage();

    getMuscleGroups(): Observable<
        {
            id: string;
            name: string;
            imageUrl: string;
            filePath: string;
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
            imageUrl: string;
            filePath: string,
        }[]>((observer) => {
            const unsubscribe = onSnapshot(
                orderedMuscleGroupsQuery,
                (querySnapshot) => {
                    const muscleGroups = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                name: doc.data()['name'],
                                imageUrl: doc.data()['imageUrl'],
                                filePath: doc.data()['filePath'],
                            } as {
                                id: string;
                                name: string;
                                imageUrl: string;
                                filePath: string,
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
        const filePath = `admin/muscleGroups/${Date.now()}_${name}`;
        const storageRef = ref(this.storage, filePath);

        const snapshot = await uploadBytes(storageRef, imageFile);

        const downloadURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(this.firestore, 'muscleGroups'), {
            name: name,
            imageUrl: downloadURL,
            filePath: filePath,
        });
    }

    async modifyMuscleGroup(
        id: string,
        oldImagePath: string,
        newName: string,
        newImageFile: File | null
    ) {
        if (newImageFile) {
            // Delete old image
            const oldImageStorageRef = ref(this.storage, oldImagePath);
            await deleteObject(oldImageStorageRef);

            // Add new image
            const newImagePath = `admin/muscleGroups/${Date.now()}_${newName}`;
            const newImageStorageRef = ref(this.storage, newImagePath);
            const snapshot = await uploadBytes(
                newImageStorageRef,
                newImageFile
            );

            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update document
            await updateDoc(doc(this.firestore, 'muscleGroups', id), {
                name: newName,
                imageUrl: downloadURL,
                filePath: newImagePath,
            });
        } else {
            // Update document
            await updateDoc(doc(this.firestore, 'muscleGroups', id), {
                name: newName,
            });
        }
    }

    async deleteMuscleGroup(id: string, imagePath: string) {
        const storageRef = ref(this.storage, imagePath);

        await deleteObject(storageRef);

        await deleteDoc(doc(this.firestore, 'muscleGroups', id));
    }
}
