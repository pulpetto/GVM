import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    CollectionReference,
    Firestore,
    onSnapshot,
    query,
} from '@angular/fire/firestore';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
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
            focusOn: string;
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
            focusOn: string;
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
                                focusOn: doc.data()['focusOn'],
                            } as {
                                id: string;
                                name: string;
                                imageUrl: string;
                                focusOn: string;
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

    addNewMuscleGroup(
        name: string,
        imageFile: File
    ): Observable<number | null> {
        const filePath = `admin/muscleGroups/${Date.now()}_${name}`;
        const storageRef = ref(this.storage, filePath);

        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        return new Observable<number | null>((observer) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    observer.next(progress);
                },
                (error) => {
                    console.error('Upload failed:', error);
                    observer.next(null);
                    observer.complete();
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            addDoc(collection(this.firestore, 'muscleGroups'), {
                                name: name,
                                imageUrl: downloadURL,
                            });
                        }
                    );
                }
            );
        });
    }
}
