import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideHttpClient } from '@angular/common/http';

import { provideAnimations } from '@angular/platform-browser/animations';

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
        provideHttpClient(),
        provideAnimations(),
        provideClientHydration(),
        provideEnvironmentNgxMask(),
        importProvidersFrom([
            provideFirebaseApp(() => initializeApp(firebaseConfig)),
            provideFirestore(() => getFirestore()),
            provideAuth(() => getAuth()),
        ]),
    ],
};
