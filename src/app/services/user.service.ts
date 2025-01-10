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
    endBefore,
    arrayRemove,
    collectionData,
} from '@angular/fire/firestore';
import {
    Auth,
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    user,
} from '@angular/fire/auth';
import {
    BehaviorSubject,
    combineLatest,
    forkJoin,
    from,
    map,
    Observable,
    of,
    switchMap,
} from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkoutSplit } from '../interfaces/workout-split';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { WorkoutDone } from '../interfaces/workout/workout-done';
import { WorkoutDoneFull } from '../interfaces/workout/workout-done-full';
import { DataService } from './data.service';
import { WorkoutDoneWithId } from '../interfaces/workout/workout-done-with-id';
import { Step } from '../interfaces/step';
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from '@angular/fire/storage';
import { ExercisePreview } from '../interfaces/exercise-preview';
import { ExerciseDetails } from '../interfaces/exercise-details';
import { ToastService } from './toast.service';
import { Goal } from '../interfaces/goal';
import { WorkoutTemplate } from '../interfaces/workout-template';
import { WorkoutTemplateFull } from '../interfaces/workout/workout-template-full';
import { WorkoutSplitFull } from '../interfaces/workout-split-full';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    firestore = inject(Firestore);
    authentication = inject(Auth);
    router = inject(Router);
    destroyRef = inject(DestroyRef);
    dataService = inject(DataService);
    toastService = inject(ToastService);

    storage = getStorage();

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
                if (data) {
                    const userData = data as User;
                    userData.id = uid;

                    this.currentUser.set(userData);
                }
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
                    pfpUrl: null,
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
                    id: 'uncategorized',
                    index: 0,
                    name: 'Uncategorized',
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

    changeUsername(newUsername: string) {
        updateDoc(this.userDocRef!, { username: newUsername })
            .then(() => {
                this.toastService.show('Username updated successfully', false);
            })
            .catch((error) => {
                console.error(error);
                this.toastService.show('An error occured, try again', true);
            });
    }

    async changePassword(currentPassword: string, newPassword: string) {
        const user = this.authentication.currentUser;

        try {
            if (user) {
                const credential = EmailAuthProvider.credential(
                    user.email!,
                    currentPassword
                );

                await reauthenticateWithCredential(user, credential);

                await updatePassword(user, newPassword);

                this.toastService.show('Password updated successfully', false);
            }
        } catch (err) {
            this.toastService.show('An error occured, try again', true);
        }
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

    getSplits(): Observable<WorkoutSplitFull[]> {
        const q = query(
            collection(this.userDocRef!, 'workoutsSplits'),
            orderBy('index')
        );

        return collectionData(q).pipe(
            map((splits) =>
                (splits as WorkoutSplit[]).map((splitIdAndName) =>
                    this.getSplitWorkouts(splitIdAndName.id).pipe(
                        map(
                            (splitWorkouts) =>
                                ({
                                    id: splitIdAndName.id,
                                    name: splitIdAndName.name,
                                    workoutsTemplates:
                                        splitWorkouts.length > 0
                                            ? splitWorkouts
                                            : [],
                                } as unknown as WorkoutSplitFull)
                        )
                    )
                )
            ),
            switchMap((splitObservables) => combineLatest(splitObservables))
        );
    }

    getSplitWorkouts(splitId: string): Observable<
        {
            index: number;
            template: WorkoutTemplateFull;
        }[]
    > {
        const q = query(
            collection(
                this.userDocRef!,
                'workoutsSplits',
                splitId,
                'workoutsIds'
            ),
            orderBy('workoutIndex')
        );

        return collectionData(q).pipe(
            map((workouts) =>
                (
                    workouts as {
                        workoutIndex: number;
                        workoutId: string;
                    }[]
                ).map((workoutIdAndIndex) =>
                    this.getFullWorkoutTemplateById(
                        workoutIdAndIndex.workoutId
                    ).pipe(
                        map((workoutTemplate) => ({
                            index: workoutIdAndIndex.workoutIndex,
                            template: workoutTemplate,
                        }))
                    )
                )
            ),
            switchMap((workoutObservables) =>
                workoutObservables.length > 0
                    ? combineLatest(workoutObservables)
                    : of([])
            )
        );
    }

    async addNewSplit(splitName: string) {
        try {
            const workoutSplitsRef: CollectionReference = collection(
                this.userDocRef!,
                'workoutsSplits'
            );

            const snapshot = await getCountFromServer(workoutSplitsRef);

            const docRef = doc(workoutSplitsRef);

            await setDoc(docRef, {
                id: docRef.id,
                index: snapshot.data().count,
                name: splitName,
            });

            this.toastService.show('Split added successfully', false);
        } catch (error) {
            this.toastService.show('Upload error occured', true);
        }
    }

    async changeSplitName(splitDocId: string, newName: string) {
        try {
            const splitDocRef: DocumentReference = doc(
                this.userDocRef!,
                'workoutsSplits',
                splitDocId
            );

            await updateDoc(splitDocRef, { name: newName });

            this.toastService.show('Name changed successfully', false);
        } catch (error) {
            this.toastService.show('Name change error occured', true);
        }
    }

    changeSplitsOrder(splits: WorkoutSplitFull[]) {
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

    async removeWorkoutSplit(splitDocId: string) {
        try {
            const splitDocRef: DocumentReference = doc(
                this.userDocRef!,
                'workoutsSplits',
                splitDocId
            );

            await deleteDoc(splitDocRef);

            this.toastService.show('Split deleted successfully', false);
        } catch (error) {
            this.toastService.show('Deletion error occured', true);
        }
    }

    async saveWorkoutTemplate(workout: WorkoutTemplate) {
        try {
            const workoutsRef: CollectionReference = collection(
                this.userDocRef!,
                'workouts'
            );

            const docRef = await addDoc(workoutsRef, workout);

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

            const snapshot = await getCountFromServer(workoutsInSplitRef);

            await setDoc(workoutInSplitRef, {
                workoutIndex: snapshot.data().count,
                workoutId: docRef.id,
            });

            this.router.navigate([`/user/workout`]);
            this.toastService.show('Workout added successfully', false);
        } catch (error) {
            this.router.navigate([`/user/workout`]);
            this.toastService.show('Error occured, try again', true);
        }
    }

    async updateWorkoutTemplate(
        workoutTemplateId: string,
        workout: WorkoutTemplate
    ) {
        try {
            const workoutDocRef: DocumentReference = doc(
                this.userDocRef!,
                'workouts',
                workoutTemplateId
            );

            await updateDoc(workoutDocRef, {
                name: workout.name,
                exercises: workout.exercises,
            });

            this.router.navigate([`/user/workout`]);
            this.toastService.show('Workout updated successfully', false);
        } catch (error) {
            this.router.navigate([`/user/workout`]);
            this.toastService.show('Error occured, try again', true);
        }
    }

    async deleteWorkoutTemplate(splitId: string, workoutTemplateId: string) {
        try {
            await deleteDoc(
                doc(this.userDocRef!, 'workouts', workoutTemplateId)
            );

            await deleteDoc(
                doc(
                    this.userDocRef!,
                    'workoutsSplits',
                    splitId,
                    'workoutsIds',
                    workoutTemplateId
                )
            );

            this.router.navigate([`/user/workout`]);
            this.toastService.show('Workout deleted successfully', false);
        } catch (error) {
            this.router.navigate([`/user/workout`]);
            this.toastService.show('Error occured, try again', true);
        }
    }

    async deleteDoneWorkout(workoutTemplateId: string, workoutId: string) {
        try {
            const workoutTemplateRef: DocumentReference = doc(
                this.userDocRef!,
                'workouts',
                workoutTemplateId
            );

            await updateDoc(workoutTemplateRef, {
                doneWorkoutsIds: arrayRemove(workoutId),
            });

            await deleteDoc(doc(this.userDocRef!, 'workoutsDone', workoutId));

            await deleteDoc(
                doc(this.userDocRef!, 'workoutsUnixTimestamps', workoutId)
            );

            this.router.navigate([`/user/profile/history`]);
            this.toastService.show('Workout deleted successfully', false);
        } catch (error) {
            console.error(error);
            this.router.navigate([`/user/profile/history`]);
            this.toastService.show('Error occured, try again', true);
        }
    }

    getWorkoutTemplateById(workoutId: string): Observable<WorkoutTemplate> {
        const workoutDocRef: DocumentReference = doc(
            this.userDocRef!,
            'workouts',
            workoutId
        );

        return from(
            getDoc(workoutDocRef).then((workoutDoc) => {
                const workoutTemplate = workoutDoc.data() as WorkoutTemplate;

                workoutTemplate.id = workoutDoc.id;

                return workoutTemplate;
            })
        );
    }

    getFullWorkoutTemplateById(
        workoutId: string
    ): Observable<WorkoutTemplateFull> {
        return this.getWorkoutTemplateById(workoutId).pipe(
            switchMap((workoutTemplate) =>
                forkJoin(
                    workoutTemplate.exercises.map((exercise) =>
                        this.dataService
                            .getExercisePreview$(exercise.exerciseId)
                            .pipe(
                                map((staticData) => ({
                                    ...exercise,
                                    staticData,
                                }))
                            )
                    )
                ).pipe(
                    map(
                        (exercises) =>
                            ({
                                ...workoutTemplate,
                                exercises,
                            } as unknown as WorkoutTemplateFull)
                    )
                )
            )
        );
    }

    async finishWorkout(
        workoutTemplateId: string,
        workoutDoneBase: WorkoutDone,
        workoutDoneWithExercisesData: WorkoutDoneFull
    ) {
        try {
            const doneWorkoutSnapshot = await addDoc(
                collection(this.userDocRef!, 'workoutsDone'),
                workoutDoneBase
            );

            await updateDoc(
                doc(this.userDocRef!, 'workouts', workoutTemplateId),
                {
                    doneWorkoutsIds: arrayUnion(doneWorkoutSnapshot.id),
                    exercises: workoutDoneBase.exercises,
                }
            );

            await setDoc(
                doc(
                    this.userDocRef!,
                    'workoutsUnixTimestamps',
                    doneWorkoutSnapshot.id
                ),
                {
                    unixTimestamp: workoutDoneBase.dateStart,
                }
            );

            workoutDoneWithExercisesData.id = doneWorkoutSnapshot.id;

            this.router.navigate(
                [`/user/profile/history/${doneWorkoutSnapshot.id}/summary`],
                {
                    state: workoutDoneWithExercisesData,
                }
            );
        } catch (error) {
            console.error(error);
            this.router.navigate([`/user/workout`]);
            this.toastService.show('Error occured, try again', true);
        }
    }

    async updateDoneWorkout(
        doneWorkoutId: string,
        workoutDoneBase: WorkoutDone,
        workoutDoneWithExercisesData: WorkoutDoneFull
    ) {
        try {
            await setDoc(
                doc(this.userDocRef!, 'workoutsDone', doneWorkoutId),
                workoutDoneBase
            );

            await updateDoc(
                doc(
                    this.userDocRef!,
                    'workouts',
                    workoutDoneWithExercisesData.workoutTemplateId
                ),
                {
                    exercises: workoutDoneBase.exercises,
                }
            );

            await setDoc(
                doc(this.userDocRef!, 'workoutsUnixTimestamps', doneWorkoutId),
                {
                    unixTimestamp: workoutDoneBase.dateStart,
                }
            );

            this.router.navigate([`/user/profile/history/${doneWorkoutId}`], {
                state: workoutDoneWithExercisesData,
            });
            this.toastService.show('Workout updated successfully', false);
        } catch (error) {
            console.error(error);
            this.router.navigate([`/user/profile/history/${doneWorkoutId}`], {
                state: workoutDoneWithExercisesData,
            });
            this.toastService.show('Error occured, try again', true);
        }
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
                orderBy('dateStart', 'desc'),
                startAfter(lastDoc['dateStart']),
                limit(itemLimit)
            );
        } else {
            q = query(
                workoutsDoneRef,
                orderBy('dateStart', 'desc'),
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

    changeWorkoutsTemplatesOrder(
        event: CdkDragDrop<
            {
                index: number;
                template: WorkoutTemplateFull;
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
                    dataObj.template.id
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
            if (!event.container.data) event.container.data = [];

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            const droppedWorkoutId = event.item.data.template.id;

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
                    dataObj.template.id
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
                    dataObj.template.id
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

    getOldestDoneWorkoutsUnix(): Observable<number | null> {
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
            getDocs(q).then((querySnapshot) => {
                if (querySnapshot.docs[0]) {
                    return querySnapshot.docs[0].data()[
                        'unixTimestamp'
                    ] as number;
                } else {
                    return null;
                }
            })
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
        unixFrom: number | null,
        unixTo: number | null
    ): Observable<WorkoutDone[]> {
        const workoutsDoneRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsDone'
        );

        let q;

        if (unixFrom && unixTo) {
            q = query(
                workoutsDoneRef,
                orderBy('dateStart', 'asc'),
                startAfter(unixFrom),
                endBefore(unixTo)
            );
        } else if (unixFrom && !unixTo) {
            q = query(
                workoutsDoneRef,
                orderBy('dateStart', 'asc'),
                startAfter(unixFrom)
            );
        } else if (!unixFrom && unixTo) {
            q = query(
                workoutsDoneRef,
                orderBy('dateStart', 'asc'),
                endBefore(unixTo)
            );
        } else {
            q = query(workoutsDoneRef, orderBy('dateStart', 'asc'));
        }

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

    getAllDoneWorkouts(): Observable<WorkoutDone[]> {
        const workoutsDoneRef: CollectionReference = collection(
            this.userDocRef!,
            'workoutsDone'
        );

        const q = query(workoutsDoneRef, orderBy('dateStart', 'asc'));

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

    async addCustomExercise(
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
        const imageFilePath = `users/${
            this.currentUser()?.id
        }/customExercises/${Date.now()}_${name}`;
        const storageRef = ref(this.storage, imageFilePath);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const imagePreviewUrl = await getDownloadURL(snapshot.ref);

        // Video upload
        const videoFilePath = `users/${
            this.currentUser()?.id
        }/customExercises/${Date.now()}_${name}_video`;
        const videoStorageRef = ref(this.storage, videoFilePath);
        const videoSnapshot = await uploadBytes(
            videoStorageRef,
            instructionVideoFile
        );
        const videoPreviewUrl = await getDownloadURL(videoSnapshot.ref);

        const newExerciseId = doc(
            collection(this.userDocRef!, 'customExercisesPreviews')
        ).id;

        await setDoc(
            doc(this.userDocRef!, 'customExercisesPreviews', newExerciseId),
            {
                custom: true,
                name: name,
                imagePreviewUrl: imagePreviewUrl,
                mainMuscleGroupsIds: mainMuscleGroupsIds,
                secondaryMuscleGroupsIds: secondaryMuscleGroupsIds,
                equipmentId: equipmentId,
            }
        );

        await setDoc(
            doc(this.userDocRef!, 'customExercisesDetails', newExerciseId),
            {
                imageFilePath: imageFilePath,
                instructionVideoPreviewUrl: videoPreviewUrl,
                instructionVideoFilePath: videoFilePath,
                instructionSteps: instructionSteps,
                variationsIds: variationsIds,
                alternativesIds: alternativesIds,
            }
        );
    }

    async modifyCustomExercise(
        name: string,
        imageFile: File,
        mainMuscleGroupsIds: string[],
        secondaryMuscleGroupsIds: string[],
        equipmentId: string,
        instructionVideoFile: File,
        instructionSteps: Step[],
        oldExerciseDetails: ExerciseDetails,
        id: string
    ) {
        try {
            const exercisePreviewRef: DocumentReference = doc(
                this.userDocRef!,
                'customExercisesPreviews',
                id
            );

            const exerciseDetailsRef: DocumentReference = doc(
                this.userDocRef!,
                'customExercisesDetails',
                id
            );

            if (imageFile instanceof File) {
                // Old image delete
                const oldImageStorageRef = ref(
                    this.storage,
                    oldExerciseDetails.imageFilePath
                );
                await deleteObject(oldImageStorageRef);

                // Image upload
                const imageFilePath = `users/${
                    this.currentUser()?.id
                }/customExercises/${Date.now()}_${name}`;
                const storageRef = ref(this.storage, imageFilePath);
                const snapshot = await uploadBytes(storageRef, imageFile);
                const imagePreviewUrl = await getDownloadURL(snapshot.ref);

                await updateDoc(exercisePreviewRef, {
                    imagePreviewUrl: imagePreviewUrl,
                });

                await updateDoc(exerciseDetailsRef, {
                    imageFilePath: imageFilePath,
                });
            }

            if (instructionVideoFile instanceof File) {
                // Old video delete
                const oldVideoStorageRef = ref(
                    this.storage,
                    oldExerciseDetails.instructionVideoFilePath
                );
                await deleteObject(oldVideoStorageRef);

                // Video upload
                const videoFilePath = `users/${
                    this.currentUser()?.id
                }/customExercises/${Date.now()}_${name}_video`;
                const videoStorageRef = ref(this.storage, videoFilePath);
                const videoSnapshot = await uploadBytes(
                    videoStorageRef,
                    instructionVideoFile
                );
                const videoPreviewUrl = await getDownloadURL(videoSnapshot.ref);

                await setDoc(exerciseDetailsRef, {
                    instructionVideoPreviewUrl: videoPreviewUrl,
                    instructionVideoFilePath: videoFilePath,
                });
            }

            await updateDoc(exercisePreviewRef, {
                name: name,
                mainMuscleGroupsIds: mainMuscleGroupsIds,
                secondaryMuscleGroupsIds: secondaryMuscleGroupsIds,
                equipmentId: equipmentId,
            });

            await updateDoc(exerciseDetailsRef, {
                instructionSteps: instructionSteps,
            });

            this.router.navigate(['/user/profile/exercises']);
            this.toastService.show('Exercise modified successfully', false);
        } catch (error) {
            console.error(error);
            this.router.navigate(['/user/profile/exercises']);
            this.toastService.show('Error occured, try again', true);
        }
    }

    getCustomExercisesPreviews(): Observable<ExercisePreview[]> {
        const customExercisesRef: CollectionReference = collection(
            this.userDocRef!,
            'customExercisesPreviews'
        );

        return from(
            getDocs(customExercisesRef).then((qs) => {
                const arrayToReturn: ExercisePreview[] = [];

                qs.forEach((exercise) => {
                    const exerciseObj: ExercisePreview =
                        exercise.data() as ExercisePreview;

                    exerciseObj.id = exercise.id;

                    arrayToReturn.push(exerciseObj);
                });

                return arrayToReturn;
            })
        );
    }

    getCustomExercisePreviewById(id: string): Observable<ExercisePreview> {
        const customExerciseRef: DocumentReference = doc(
            this.userDocRef!,
            'customExercisesPreviews',
            id
        );

        return from(
            getDoc(customExerciseRef).then((exerciseDoc) => {
                const exercisePreview = exerciseDoc.data() as ExercisePreview;

                exercisePreview.id = exerciseDoc.id;

                return exercisePreview;
            })
        );
    }

    getCustomExerciseDetailsById(id: string): Observable<ExerciseDetails> {
        const customExerciseRef: DocumentReference = doc(
            this.userDocRef!,
            'customExercisesDetails',
            id
        );

        return from(
            getDoc(customExerciseRef).then(
                (exerciseDoc) => exerciseDoc.data() as ExerciseDetails
            )
        );
    }

    async updatePfp(imageFile: File) {
        const oldPfpUrl = (await getDoc(this.userDocRef!)).data()!['pfpUrl'];
        const imageFilePath = `users/${this.currentUser()?.id}/pfp`;
        const storageRef = ref(this.storage, imageFilePath);

        if (oldPfpUrl) {
            await deleteObject(storageRef);
        }

        const snapshot = await uploadBytes(storageRef, imageFile);
        const imagePreviewUrl = await getDownloadURL(snapshot.ref);

        updateDoc(this.userDocRef!, { pfpUrl: imagePreviewUrl });
    }

    async addGoal(goal: { targetWeight: number; exerciseId: string }) {
        try {
            const goalsRef: CollectionReference = collection(
                this.userDocRef!,
                'goals'
            );

            await addDoc(goalsRef, goal);

            this.toastService.show('Goal added successfully', false);
        } catch (error) {
            this.toastService.show('Error occured, try again', true);
        }
    }

    async deleteGoal(goalId: string) {
        try {
            const goalsRef: DocumentReference = doc(
                this.userDocRef!,
                'goals',
                goalId
            );

            await deleteDoc(goalsRef);

            this.toastService.show('Goal deleted successfully', false);
        } catch (error) {
            this.toastService.show('Error occured, try again', true);
        }
    }

    async updateGoalTargetWeight(goalId: string, newTargetWeight: number) {
        try {
            const goalsRef: DocumentReference = doc(
                this.userDocRef!,
                'goals',
                goalId
            );

            await updateDoc(goalsRef, { targetWeight: newTargetWeight });

            this.toastService.show('Target weight updated successfully', false);
        } catch (error) {
            this.toastService.show('Error occured, try again', true);
        }
    }

    getGoals(): Observable<Goal[]> {
        const goalsRef: CollectionReference = collection(
            this.userDocRef!,
            'goals'
        );

        return collectionData(goalsRef, { idField: 'id' }).pipe(
            map((goals) =>
                (goals as Goal[]).map((goalDoc) => ({
                    ...goalDoc,
                    id: goalDoc.id,
                }))
            )
        );
    }

    getGoalsForExercises(exercisesIds: string[]): Observable<Goal[]> {
        const goalsRef: CollectionReference = collection(
            this.userDocRef!,
            'goals'
        );

        const q = query(goalsRef, where('exerciseId', 'in', exercisesIds));

        return from(
            getDocs(q).then((querySnapshot) =>
                querySnapshot.docs.map((doc) => doc.data() as Goal)
            )
        );
    }
}
