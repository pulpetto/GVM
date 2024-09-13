import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
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
