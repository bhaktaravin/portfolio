import { firebase, initializeApp } from "firebase/app";

    const firebaseConfig = {
        apiKey: "AIzaSyAyQM9NVtsd6rz7fGe-gPizRic8K4afTmI",
        authDomain: "trial-9e239.firebaseapp.com",
        databaseURL: "https://trial-9e239.firebaseio.com",
        projectId: "trial-9e239",
        storageBucket: "trial-9e239.appspot.com",
        messagingSenderId: "547486223867",
        appId: "1:547486223867:web:c3a41a7914ed057d33cf5e"
      };


      const app = initializeApp(firebaseConfig);



      export default app;