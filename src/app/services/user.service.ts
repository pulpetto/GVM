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
    addDoc,
    writeBatch,
    orderBy,
    getCountFromServer,
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
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';

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
                    index: 0,
                    splitName: 'Uncategorized',
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

        const orderedWorkoutsSplitsQuery = query(
            workoutSplitsRef,
            orderBy('index')
        );

        return new Observable<WorkoutSplit[]>((observer) => {
            const unsubscribe = onSnapshot(
                orderedWorkoutsSplitsQuery,
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

    getSplitWorkouts(splitId: string): Observable<
        {
            workoutIndex: number;
            workoutId: string;
        }[]
    > {
        const splitWorkoutsRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsSplits',
            splitId,
            'workoutsIds'
        );

        const orderedSplitWorkoutsQuery = query(
            splitWorkoutsRef,
            orderBy('workoutIndex')
        );

        // prettier-ignore
        return new Observable<{
            workoutIndex: number;
            workoutId: string;
        }[]>((observer) => {
            const unsubscribe = onSnapshot(
                orderedSplitWorkoutsQuery,
                (querySnapshot) => {
                    const workouts = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                ...doc.data(),
                            } as {
                                workoutIndex: number;
                                workoutId: string;
                            })
                    );

                    observer.next(workouts);
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

        getCountFromServer(workoutSplitsRef).then((snapshot) => {
            setDoc(doc(workoutSplitsRef), {
                index: snapshot.data().count,
                splitName: splitName,
            });
        });
    }

    changeSplitName(splitDocId: string, newName: string) {
        const splitDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workoutsSplits',
            splitDocId
        );

        updateDoc(splitDocRef, { splitName: newName });
    }

    batchSplits(splits: WorkoutSplit[]) {
        const batch = writeBatch(this.firestore);

        splits.forEach((split, index) => {
            const splitRef = doc(this.userDocRef!, 'workoutsSplits', split.id);
            batch.update(splitRef, { index: index });
        });

        batch
            .commit()
            .then(() => {
                console.log('Batch update successful');
            })
            .catch((error) => {
                console.error('Batch update failed: ', error);
            });
    }

    removeWorkoutSplit(splitDocId: string) {
        const splitDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workoutsSplits',
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
            const workoutsInSplitRef: CollectionReference = collection(
                this.userDocRef!,
                'workoutsSplits',
                'uncategorized',
                'workoutsIds'
            );

            const workoutInSplitRef: DocumentReference = doc(
                workoutsInSplitRef,
                docRef.id
            );

            getCountFromServer(workoutsInSplitRef).then((snapshot) => {
                setDoc(workoutInSplitRef, {
                    workoutIndex: snapshot.data().count,
                    workoutId: docRef.id,
                });
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

    getWorkoutNameById(workoutId: string): Observable<string> {
        const workoutDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workouts',
            workoutId
        );

        return from(
            getDoc(workoutDocRef).then((workoutDoc) => {
                const data = workoutDoc.data() as Workout;

                return data.name;
            })
        );
    }

    drop(
        event: CdkDragDrop<
            {
                workoutIndex: number;
                workoutId: string;
                workoutName: string;
            }[]
        >,
        splitId: string
    ) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            const batch = writeBatch(this.firestore);

            event.container.data.forEach((dataObj, index) => {
                const workoutRef: DocumentReference = doc(
                    this.userDocRef!,
                    'workoutsSplits',
                    splitId,
                    'workoutsIds',
                    dataObj.workoutId
                );
                batch.update(workoutRef, { workoutIndex: index });
            });

            batch
                .commit()
                .then(() => {
                    console.log('Batch update successful');
                })
                .catch((error) => {
                    console.error('Batch update failed: ', error);
                });
        } else {
            console.log('nowa arraika');
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }

        // kiedy dodasz do splita usuwasz stamtąd i dodajesz do splita
    }
}
