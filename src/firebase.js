import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "test",
  authDomain: "test",
  projectId: "test", 
  storageBucket: "test",
  messagingSenderId: "test",
  appId: "test"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);