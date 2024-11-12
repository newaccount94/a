import React, { useState, useEffect} from 'react';
// Components
import Button from './components/Button';
import Channel from './components/Channel';
// Firebase deps
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAIaYH9CPL_mwjG19kthW-1NWTaICmqOkM",
  authDomain: "react-firechat-db63e.firebaseapp.com",
  projectId: "react-firechat-db63e",
  storageBucket: "react-firechat-db63e.firebasestorage.app",
  messagingSenderId: "1005468367574",
  appId: "1:1005468367574:web:a9ea997b1e7a7f15b7a777"
});

const auth = firebase.auth();
const db = firebase.firestore();

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() =>  {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    //Cleanup subscription
    return unsubscribe;
  }, [initializing]);

  const signInWithGoogle = async () => {
    // Retrieve Google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    // Set language to the default browser preference
    auth.useDeviceLanguage();
    // Start sign in process
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (initializing) return 'Loading...';

  return (
    <div>
      {user ? (
        <>
          <Button onClick={signOut}>Sign Out</Button>
          <Channel user={user} db={db} />
        </>
      ) : (
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      )}
    </div>
  );
}

export default App;
