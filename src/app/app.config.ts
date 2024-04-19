import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

const firebaseConfig = {
    apiKey: 'AIzaSyBp6UEpfH1dveqp_HplEfvwop_lWx4pdKU',

    authDomain: 'gvm-8920c.firebaseapp.com',

    projectId: 'gvm-8920c',

    storageBucket: 'gvm-8920c.appspot.com',

    messagingSenderId: '899246634827',

    appId: '1:899246634827:web:35a4d5454d3024739e9ace',

    measurementId: 'G-NJ0KDCBJEC',
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideClientHydration(),
        importProvidersFrom([
            provideFirebaseApp(() => initializeApp(firebaseConfig)),
            provideFirestore(() => getFirestore()),
        ]),
    ],
};
