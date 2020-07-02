import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyAE3fHfuJoHbStfTHYNm2CZBv0lmQrNAAk",
    authDomain: "communicator-7ce4c.firebaseapp.com",
    databaseURL: "https://communicator-7ce4c.firebaseio.com",
    projectId: "communicator-7ce4c",
    storageBucket: "communicator-7ce4c.appspot.com",
    messagingSenderId: "546476062695",
    appId: "1:546476062695:web:51a6d001b5291897af2f42",
    measurementId: "G-EBX8PBF9PD"
};
firebase.initializeApp(firebaseConfig);

export default firebase;