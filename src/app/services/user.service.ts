import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
    setDoc,
    doc,
    Firestore,
    getDocs,
    query,
    where,
    DocumentReference,
    CollectionReference,
    deleteDoc,
    getDoc,
    onSnapshot,
    updateDoc,
    arrayUnion,
    addDoc,
} from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    user,
} from '@angular/fire/auth';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkoutSplit } from '../interfaces/workout-split';
import { Workout } from '../interfaces/workout/workout';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    firestore = inject(Firestore);
    authentication = inject(Auth);
    router = inject(Router);
    destroyRef = inject(DestroyRef);

    user$ = user(this.authentication);
    currentUser = signal<User | null | undefined>(undefined);

    private users = collection(this.firestore, 'users');

    loading = new BehaviorSubject<boolean>(false);
    error = new BehaviorSubject<boolean>(false);

    userDocRef!: DocumentReference | null;

    getLoadingState$(): Observable<boolean> {
        return this.loading.asObservable();
    }

    getErrorState$(): Observable<boolean> {
        return this.error.asObservable();
    }

    initializeUserAndProperties(uid: string) {
        this.userDocRef = doc(this.firestore, 'users', uid);

        from(getDoc(this.userDocRef))
            .pipe(
                map((querySnapshot) => querySnapshot.data()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((data) => {
                if (data) this.currentUser.set(data as User);
            });
    }

    signupUser(user: { username: string; email: string; password: string }) {
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

                this.userDocRef = doc(
                    this.firestore,
                    'users',
                    userCredentials.user.uid
                );

                const workoutSplitsRef: CollectionReference = collection(
                    this.userDocRef!,
                    'workoutsSplits'
                );

                setDoc(doc(workoutSplitsRef, 'uncategorized'), {
                    splitName: 'Uncategorized',
                    workoutsIds: [],
                });

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
                this.userDocRef = doc(
                    this.firestore,
                    'users',
                    userCredentials.user.uid
                );

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

    getWorkoutsSplits(): Observable<WorkoutSplit[]> {
        const workoutSplitsRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsSplits'
        );

        return new Observable<WorkoutSplit[]>((observer) => {
            const unsubscribe = onSnapshot(
                workoutSplitsRef,
                (querySnapshot) => {
                    const splits = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                ...doc.data(),
                            } as WorkoutSplit)
                    );
                    observer.next(splits);
                },
                (error) => {
                    observer.error(error);
                }
            );

            return { unsubscribe };
        });
    }

    addNewSplit(splitName: string) {
        const workoutSplitsRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsSplits'
        );

        setDoc(doc(workoutSplitsRef), {
            splitName: splitName,
            workoutsIds: [],
        });
    }

    removeWorkoutSplit(splitDocId: string) {
        const workoutSplitsRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsSplits'
        );

        const splitDocRef: DocumentReference = doc(
            workoutSplitsRef,
            splitDocId
        );

        deleteDoc(splitDocRef);
    }

    saveWorkout(workoutObj: Workout) {
        const workoutsRef: CollectionReference = collection(
            this.userDocRef!,
            'workouts'
        );

        addDoc(workoutsRef, workoutObj).then((docRef) => {
            const splitDocRef = doc(
                this.userDocRef!,
                'workoutsSplits',
                'uncategorized'
            );

            updateDoc(splitDocRef, {
                workoutsIds: arrayUnion(docRef.id),
            });
        });
    }

    getWorkoutById(workoutId: string): Observable<Workout> {
        const workoutDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workouts',
            workoutId
        );

        return from(
            getDoc(workoutDocRef).then((workoutDoc) => {
                return workoutDoc.data() as Workout;
            })
        );
    }
}
