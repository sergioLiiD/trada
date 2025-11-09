import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  writeBatch,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

// Hook for a collection (e.g., trades)
export function useFirestoreCollection<T extends {id: string}>(collectionName: string, userId: string | undefined) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const collectionRef = useMemo(() => {
    return userId ? collection(db, 'users', userId, collectionName) : null;
  }, [userId, collectionName]);

  useEffect(() => {
    if (!collectionRef) {
      setData([]);
      setLoading(false);
      return;
    }

    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(documents);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
      console.error(`Firestore error listening to ${collectionName}:`, err);
    });

    return () => unsubscribe();
  }, [collectionRef, collectionName]);

  const addDocument = useCallback(async (newData: Omit<T, 'id'>) => {
    if (!collectionRef) return;
    try {
      await addDoc(collectionRef, newData);
    } catch (err: any) {
      setError(err);
      console.error(`Firestore error adding to ${collectionName}:`, err);
    }
  }, [collectionRef, collectionName]);

  const clearCollection = useCallback(async () => {
    if (!collectionRef) return;
    try {
        const querySnapshot = await getDocs(collectionRef);
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    } catch (err: any) {
        setError(err);
        console.error(`Firestore error clearing ${collectionName}:`, err);
    }
  }, [collectionRef, collectionName]);

  const deleteDocument = useCallback(async (id: string) => {
    if (!collectionRef) return;
    try {
      const docRef = doc(collectionRef, id);
      await deleteDoc(docRef);
    } catch (err: any) {
      setError(err);
      console.error(`Firestore error deleting from ${collectionName}:`, err);
    }
  }, [collectionRef, collectionName]);

  return { data, loading, error, addDocument, clearCollection, deleteDocument };
}

// Hook for a single document (e.g., capital, notes) stored in its own subcollection.
export function useFirestoreDocument<T>(collectionName: string, userId: string | undefined, initialData: T) {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const docRef = useMemo(() => {
        return userId ? doc(db, 'users', userId, collectionName, 'data') : null;
    }, [userId, collectionName]);

    useEffect(() => {
        if (!docRef) {
            setData(initialData);
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setData(docSnap.data() as T);
            } else {
                // If doc doesn't exist, create it with initial data
                setDoc(docRef, initialData);
                setData(initialData);
            }
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
            console.error(`Firestore error listening to doc ${collectionName}/data:`, err);
        });
        
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docRef]);
    
    const updateDocument = useCallback(async (updatedData: Partial<T>) => {
        if (!docRef) return;
        try {
            // Use set with merge to create the document if it doesn't exist, or update it if it does.
            await setDoc(docRef, updatedData, { merge: true });
        } catch (err: any) {
             setError(err);
             console.error(`Firestore error updating doc ${collectionName}/data:`, err);
        }
    }, [docRef, collectionName]);
    
    return { data, loading, error, updateDocument };
}
