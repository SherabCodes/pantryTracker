
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCKMW1CvCQZ-ZaCqvcewnPDy2a3XoAD9gQ",
  authDomain: "inventory-manage-67e31.firebaseapp.com",
  projectId: "inventory-manage-67e31",
  storageBucket: "inventory-manage-67e31.appspot.com",
  messagingSenderId: "413188269618",
  appId: "1:413188269618:web:505b1b214e31b9b5e77e2b",
  measurementId: "G-22P0ZJG56Z"
};


const app = initializeApp(firebaseConfig);


const firestore = getFirestore(app);

export { firestore };
