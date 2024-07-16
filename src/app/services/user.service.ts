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
    signOut,
} from '@angular/fire/auth';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    firestore = inject(Firestore);
    authentication = inject(Auth);
    router = inject(Router);

    private users = collection(this.firestore, 'users');

    loading = new BehaviorSubject<boolean>(false);
    error = new BehaviorSubject<boolean>(false);

    getLoadingState$(): Observable<boolean> {
        return this.loading.asObservable();
    }

    getErrorState$(): Observable<boolean> {
        return this.error.asObservable();
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

    loginUser(email: string, password: string) {
        this.loading.next(true);

        signInWithEmailAndPassword(this.authentication, email, password)
            .then((userCredentials) => {
                this.router.navigate([
                    `/user/${userCredentials.user.uid}/profile`,
                ]);

                this.error.next(false);
                this.loading.next(false);
            })
            .catch((error) => {
                this.error.next(true);
                this.loading.next(false);
                console.error(error);
            });
    }

    logoutUser() {
        this.loading.next(true);

        signOut(this.authentication)
            .then(() => {
                this.router.navigate(['/login']);
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

    addNewSplit(splitName: string) {}
}
