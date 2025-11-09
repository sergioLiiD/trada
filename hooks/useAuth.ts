import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth';

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
  const signup = (email: string, pass:string) => createUserWithEmailAndPassword(auth, email, pass);
  const logout = () => signOut(auth);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  return { user, login, signup, logout, loginWithGoogle, loading };
}
