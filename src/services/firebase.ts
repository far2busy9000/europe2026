import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { TripData, CollaborationNotification } from '../types';
import { getInitialTripData } from '../data/sampleTrip';

// Default config from Firebase provisioning
const firebaseConfig = {
  projectId: "studied-aviary-3c9s2",
  appId: "1:492454829996:web:9365cda9e59c87106ea409",
  apiKey: "AIzaSyBqup8z8WjgywCgqOdwyAxxroGGpKrBEas",
  authDomain: "studied-aviary-3c9s2.firebaseapp.com",
  storageBucket: "studied-aviary-3c9s2.firebasestorage.app",
  messagingSenderId: "492454829996",
};

const DATABASE_ID = "ai-studio-fazzalarifamilye-3089370a-1054-445e-9be5-d40104351ee8";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, DATABASE_ID);

const SHARED_TRIP_DOC_ID = 'europe-2026-family-master';

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
}

/**
 * Saves or pushes the trip data to the shared Firestore cloud document
 */
export async function pushTripToCloud(data: TripData, authorName?: string): Promise<boolean> {
  try {
    const tripRef = doc(db, 'trips', SHARED_TRIP_DOC_ID);
    const payload = {
      ...data,
      lastSyncedAt: new Date().toISOString(),
      lastModifiedBy: authorName || 'Family Member',
      updatedAtServer: serverTimestamp()
    };
    await setDoc(tripRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.warn('Firestore cloud push warning (will fall back to local):', err);
    return false;
  }
}

/**
 * Subscribes to real-time Firestore cloud changes
 */
export function subscribeToCloudTrip(
  onData: (data: TripData) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const tripRef = doc(db, 'trips', SHARED_TRIP_DOC_ID);
    
    const unsubscribe = onSnapshot(
      tripRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as TripData;
          if (cloudData && cloudData.days && cloudData.days.length >= 40) {
            onData(cloudData);
          }
        } else {
          // If first time, initialize the cloud master with our default trip itinerary!
          const initial = getInitialTripData();
          pushTripToCloud(initial, 'System Initialization');
        }
      },
      (error) => {
        console.warn('Firestore subscription notice (using local offline cache):', error);
        onError?.(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore subscription:', err);
    return () => {};
  }
}

/**
 * Push an activity notification to the live cloud feed
 */
export async function pushActivityNotification(notif: CollaborationNotification): Promise<void> {
  try {
    const feedRef = collection(db, 'activity_feed');
    await addDoc(feedRef, {
      ...notif,
      createdAtServer: serverTimestamp()
    });
  } catch (err) {
    console.warn('Could not push activity notification to cloud:', err);
  }
}

/**
 * Subscribe to cloud activity notifications
 */
export function subscribeToCloudActivity(
  onNotifications: (notifs: CollaborationNotification[]) => void
): () => void {
  try {
    const feedRef = collection(db, 'activity_feed');
    const feedQuery = query(feedRef, orderBy('createdAtServer', 'desc'), limit(25));
    
    const unsubscribe = onSnapshot(
      feedQuery,
      (snapshot) => {
        const list: CollaborationNotification[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as CollaborationNotification;
          list.push({
            ...item,
            id: docSnap.id
          });
        });
        if (list.length > 0) {
          onNotifications(list);
        }
      },
      (err) => {
        console.warn('Activity feed subscription notice:', err);
      }
    );

    return unsubscribe;
  } catch {
    return () => {};
  }
}
