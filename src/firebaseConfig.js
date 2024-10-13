// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebaseの構成情報を追加
const firebaseConfig = {
  apiKey: "AIzaSyAjxAoao0IyETTmv0dUQ8SZtYcKlF5Gz5k",
  authDomain: "lol-autoteam.firebaseapp.com",
  projectId: "lol-autoteam",
  storageBucket: "lol-autoteam.appspot.com",
  messagingSenderId: "1000533239916",
  appId: "1:1000533239916:web:f7240ce8a1c53520e29049"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
