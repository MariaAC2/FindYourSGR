// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    // add your Firebase config here
    databaseURL: "https://lab-isi-lasa-ma-default-rtdb.europe-west1.firebasedatabase.app/",
    apiKey: "AIzaSyDnR2JEzL4QuGVVJfhP5oQsKinDu-YUqQA",
    authDomain: "lab-isi-lasa-ma.firebaseapp.com",
    projectId: "lab-isi-lasa-ma",
    storageBucket: "lab-isi-lasa-ma.firebasestorage.app",
    messagingSenderId: "359420042783",
    appId: "1:359420042783:web:1286df0ae6530825bc3f2a",
    measurementId: "G-17VJJXQJ6P"
  },
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
