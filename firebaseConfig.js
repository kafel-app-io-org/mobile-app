// // firebaseConfig.js
// import { initializeApp, getApp } from '@react-native-firebase/app';
// import { Platform } from 'react-native';

// const firebaseConfig = {
//   apiKey: "AIzaSyCuL7OwWxTLjOf57-EB2nT5xHlM7ITgTtU",
//   authDomain: "kafel-dev-1.firebaseapp.com",
//   databaseURL: "https://kafel-dev-1.firebaseio.com",
//   projectId: "kafel-dev-1",
//   storageBucket: "kafel-dev-1.appspot.com",
//   messagingSenderId: "1097669804574",
//   appId: "1:1097669804574:web:c288a4f86a9a9249b5240f",
//   measurementId: "G-QJQLLWWHJC",
// };

// try {
//   if (Platform.OS === "web") {
//     initializeApp(firebaseConfig); 
//   } else {
//     getApp(); 
//   }
// } catch (error) {
//   if (!/already exists/i.test(error.message)) {
//     console.log("Firebase initialization error", error.stack);
//   }
// }

// export { getApp };



// firebaseConfig.js
import { Platform } from 'react-native';

// Import both web and native SDKs
import { initializeApp as initializeAppWeb } from 'firebase/app';
import { getAuth as getAuthWeb } from 'firebase/auth';
import { getApp as getAppNative } from '@react-native-firebase/app';
import { getAuth as getAuthNative } from '@react-native-firebase/auth';

let auth;

if (Platform.OS === 'web') {
  const firebaseConfig = {
    apiKey: "AIzaSyCyBZap0qpOif3Igi3drWqXcepqxLVfeqA",
    authDomain: "kafel-app-io-35b84.firebaseapp.com",
    projectId: "kafel-app-io-35b84",
    storageBucket: "kafel-app-io-35b84.firebasestorage.app",
    messagingSenderId: "94631088411",
    appId: "1:94631088411:web:e874c9a1db196b4bf703be",
    measurementId: "G-92L813K9ZT"
  };

  const app = initializeAppWeb(firebaseConfig);
  auth = getAuthWeb(app);
} else {
  const app = getAppNative();
  auth = getAuthNative(app);
}

export { auth };