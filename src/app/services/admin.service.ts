import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    firestore = inject(Firestore);
    storage = getStorage();

    addNewMuscleGroup(name: string, imageFile: File) {
        const filePath = `admin/muscleGroups/${Date.now()}_${name}`;
        const storageRef = ref(this.storage, filePath);

        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    addDoc(collection(this.firestore, 'muscleGroups'), {
                        name: name,
                        imageUrl: downloadURL,
                    });
                });
            }
        );
    }
}
