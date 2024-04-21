import { inject, Injectable } from '@angular/core';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { User } from '../interfaces/user';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    firestore = inject(Firestore);
    authentication = inject(Auth);

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
        ).then(() => {
            this.loading.next(false);
            addDoc(this.users, user);
        });
    }
}
