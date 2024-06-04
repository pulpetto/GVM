import { inject, Injectable } from '@angular/core';
import {
    setDoc,
    doc,
    Firestore,
    getDocs,
    query,
    where,
} from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { User } from '../interfaces/user';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { Router } from 'express';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    firestore = inject(Firestore);
    authentication = inject(Auth);
    router = inject(Router);

    private users = collection(this.firestore, 'users');

    loading = new BehaviorSubject<boolean>(false);

    getLoadingState$(): Observable<boolean> {
        return this.loading.asObservable();
    }

    signupUser(user: User) {
        this.loading.next(true);

        createUserWithEmailAndPassword(
            this.authentication,
            user.email,
            user.password
        )
            .then((userCredentials) => {
                const userObj = {
                    username: user.username,
                    email: user.email,
                };

                setDoc(
                    doc(this.firestore, 'users', userCredentials.user.uid),
                    userObj
                );

                this.router.navigate([
                    `/user/${userCredentials.user.uid}/profile`,
                ]);

                this.loading.next(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    checkIfUserExists(username: string): Observable<boolean> {
        const q = query(this.users, where('username', '==', username));
        return from(getDocs(q)).pipe(map((data) => !data.empty));
    }

    checkIfEmailIsRegistered(email: string): Observable<boolean> {
        const q = query(this.users, where('email', '==', email));
        return from(getDocs(q)).pipe(map((data) => !data.empty));
    }
}
