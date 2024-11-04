import { DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
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
    collection,
    arrayUnion,
    DocumentData,
    limit,
    startAfter,
} from '@angular/fire/firestore';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    user,
} from '@angular/fire/auth';
import {
    BehaviorSubject,
    forkJoin,
    from,
    map,
    Observable,
    switchMap,
} from 'rxjs';
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
import { WorkoutDone } from '../interfaces/workout/workout-done';
import { WorkoutDoneFull } from '../interfaces/workout/workout-done-full';
import { DataService } from './data.service';
import { WorkoutDoneWithId } from '../interfaces/workout/workout-done-with-id';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    firestore = inject(Firestore);
    authentication = inject(Auth);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    dataService = inject(DataService);

    user$ = user(this.authentication);
    private currentUser = signal<User | null | undefined>(undefined);

    setUserValue(userVal: User | null | undefined) {
        this.currentUser.set(userVal);
    }

    get getUser(): Signal<User | null | undefined> {
        return this.currentUser;
    }

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
                    role: 'user',
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

                this.router.navigate([`/user/profile`]);

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

                this.router.navigate([`/user/profile`]);

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

    updateWorkout(workoutId: string, workoutObj: Workout) {
        const workoutDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workouts',
            workoutId
        );

        updateDoc(workoutDocRef, {
            name: workoutObj.name,
            exercises: workoutObj.exercises,
        });
    }

    deleteWorkout(splitId: string, workoutId: string) {
        deleteDoc(doc(this.userDocRef!, 'workouts', workoutId));

        deleteDoc(
            doc(
                this.userDocRef!,
                'workoutsSplits',
                splitId,
                'workoutsIds',
                workoutId
            )
        );

        this.router.navigate([`/user/workout`]);
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

    finishWorkout(
        workoutTemplateId: string,
        workoutDoneObj: WorkoutDone,
        workoutValues: Workout
    ) {
        const workoutsDoneRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsDone'
        );

        addDoc(workoutsDoneRef, workoutDoneObj).then((docRef) => {
            const workoutTemplateRef: DocumentReference = doc(
                this.userDocRef!,
                'workouts',
                workoutTemplateId
            );

            updateDoc(workoutTemplateRef, {
                doneWorkoutsIds: arrayUnion(docRef.id),
                exercises: workoutValues.exercises,
            });

            const workoutsUnixTimestampRef: DocumentReference = doc(
                this.userDocRef!,
                'workoutsUnixTimestamps',
                docRef.id
            );

            setDoc(workoutsUnixTimestampRef, {
                unixTimestamp: workoutDoneObj.dateStart,
            });

            this.router.navigate([
                `/user/profile/history/${docRef.id}/summary`,
            ]);
        });
    }

    getDoneWorkouts(
        itemLimit: number,
        lastDoc?: DocumentData
    ): Observable<WorkoutDoneFull[]> {
        const workoutsDoneRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsDone'
        );

        let q;

        if (lastDoc) {
            q = query(
                workoutsDoneRef,
                orderBy('dateFinish', 'desc'),
                startAfter(lastDoc['dateFinish']),
                limit(itemLimit)
            );
        } else {
            q = query(
                workoutsDoneRef,
                orderBy('dateFinish', 'desc'),
                limit(itemLimit)
            );
        }

        return new Observable((observer) => {
            getDocs(q)
                .then((querySnapshot) => {
                    const arrayToReturn: WorkoutDoneFull[] = [];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const exerciseRequests: Observable<any>[] = [];

                    querySnapshot.docs.forEach((doc) => {
                        const workoutObj = doc.data() as WorkoutDoneFull;
                        workoutObj.id = doc.id;

                        workoutObj.exercises.forEach((exercise) => {
                            const exercise$ = this.dataService
                                .getExercisePreview$(exercise.exerciseId)
                                .pipe(
                                    map((exerciseData) => {
                                        exercise.staticData = exerciseData!;
                                    })
                                );
                            exerciseRequests.push(exercise$);
                        });

                        arrayToReturn.push(workoutObj);
                    });

                    forkJoin(exerciseRequests).subscribe({
                        next: () => {
                            observer.next(arrayToReturn);
                            observer.complete();
                        },
                        error: (err) => {
                            observer.error(err);
                        },
                    });
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }

    getDoneWorkoutsCount(): Observable<number> {
        const workoutsDoneRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsDone'
        );

        return from(
            getCountFromServer(workoutsDoneRef).then((snapshot) => {
                return snapshot.data().count;
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
        droppedToSplitId: string
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
                    droppedToSplitId,
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
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            const droppedWorkoutId = event.item.data.workoutId;
            const sourceSplitId =
                event.previousContainer.element.nativeElement.getAttribute(
                    'splitId'
                );

            deleteDoc(
                doc(
                    this.userDocRef!,
                    'workoutsSplits',
                    sourceSplitId!,
                    'workoutsIds',
                    droppedWorkoutId
                )
            );

            const batch = writeBatch(this.firestore);

            event.previousContainer.data.forEach((dataObj, index) => {
                const workoutRef: DocumentReference = doc(
                    this.userDocRef!,
                    'workoutsSplits',
                    sourceSplitId!,
                    'workoutsIds',
                    dataObj.workoutId
                );
                batch.update(workoutRef, { workoutIndex: index });
            });

            const workoutToAddRef: DocumentReference = doc(
                this.userDocRef!,
                'workoutsSplits',
                droppedToSplitId,
                'workoutsIds',
                droppedWorkoutId
            );

            setDoc(workoutToAddRef, {
                workoutIndex: 0,
                workoutId: droppedWorkoutId,
            });

            event.container.data.forEach((dataObj, index) => {
                const workoutRef: DocumentReference = doc(
                    this.userDocRef!,
                    'workoutsSplits',
                    droppedToSplitId!,
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
        }
    }

    getWorkoutsByUnixRange(
        unixFrom: number,
        unixTo: number
    ): Observable<
        {
            unixTimestamp: number;
            workoutId: string;
        }[]
    > {
        const workoutsUnixTimestampsRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsUnixTimestamps'
        );

        const q = query(
            workoutsUnixTimestampsRef,
            where('unixTimestamp', '>=', unixFrom),
            where('unixTimestamp', '<=', unixTo)
        );

        return from(
            getDocs(q).then((querySnapshot) => {
                const workoutIds: {
                    unixTimestamp: number;
                    workoutId: string;
                }[] = [];

                querySnapshot.docs.forEach((doc) => {
                    const timestamp = doc.data()['unixTimestamp'] as number;

                    workoutIds.push({
                        unixTimestamp: timestamp,
                        workoutId: doc.id,
                    });
                });

                return workoutIds;
            })
        );
    }

    getOldestDoneWorkoutsUnix(): Observable<number> {
        const workoutsUnixTimestampsRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsUnixTimestamps'
        );

        const q = query(
            workoutsUnixTimestampsRef,
            orderBy('unixTimestamp', 'asc'),
            limit(1)
        );

        return from(
            getDocs(q).then(
                (querySnapshot) =>
                    querySnapshot.docs[0].data()['unixTimestamp'] as number
            )
        );
    }

    getDoneWorkoutById(workoutId: string): Observable<WorkoutDone> {
        const workoutDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workoutsDone',
            workoutId
        );

        return from(
            getDoc(workoutDocRef).then((workoutDoc) => {
                return workoutDoc.data() as WorkoutDone;
            })
        );
    }

    getDoneWorkoutByIdWithExercises(
        workoutId: string
    ): Observable<WorkoutDoneFull> {
        const workoutDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workoutsDone',
            workoutId
        );

        return from(getDoc(workoutDocRef)).pipe(
            switchMap((workoutDoc) => {
                const workout = workoutDoc.data() as WorkoutDoneFull;

                workout.id = workoutDoc.id;

                const exerciseObservables = workout.exercises.map((exercise) =>
                    this.dataService
                        .getExercisePreview$(exercise.exerciseId)
                        .pipe(
                            map((exerciseData) => {
                                exercise.staticData = exerciseData;
                                return exercise;
                            })
                        )
                );

                return forkJoin(exerciseObservables).pipe(map(() => workout));
            })
        );
    }

    getDoneWorkoutsByExerciseId(
        exerciseId: string
    ): Observable<WorkoutDoneWithId[]> {
        const workoutsDoneRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsDone'
        );

        const q = query(
            workoutsDoneRef,
            where('exercisesIds', 'array-contains', exerciseId),
            orderBy('dateStart', 'asc')
        );

        return from(
            getDocs(q).then((querySnapshot) => {
                const arrToReturn: WorkoutDoneWithId[] = [];

                querySnapshot.forEach((el) => {
                    const workoutObj = el.data() as WorkoutDoneWithId;
                    workoutObj.id = el.id;

                    return arrToReturn.push(workoutObj);
                });

                return arrToReturn;
            })
        );
    }

    getDoneWorkoutsStartingFromUnix(
        unixFrom: number
    ): Observable<WorkoutDone[]> {
        const workoutsDoneRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsDone'
        );

        const q = query(
            workoutsDoneRef,
            orderBy('dateStart', 'asc'),
            startAfter(unixFrom)
        );

        return from(
            getDocs(q).then((querySnapshot) => {
                const workouts: WorkoutDone[] = [];

                querySnapshot.docs.forEach((doc) =>
                    workouts.push(doc.data() as WorkoutDone)
                );

                return workouts;
            })
        );
    }
}
