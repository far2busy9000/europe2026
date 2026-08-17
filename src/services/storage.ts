import { TripData, CollaborationNotification, WaypointPhoto } from '../types';
import { getInitialTripData } from '../data/sampleTrip';
import { compressImageFile } from '../utils/imageCompressor';
import { pushTripToCloud, pushActivityNotification } from './firebase';

const STORAGE_KEY = 'eur26_trip_v8';
const NOTIFICATIONS_KEY = 'eur26_notifications_v8';

// BroadcastChannel for instant multi-tab sync across windows
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('eur26_collaboration_channel');
  }
} catch {
  // Channel unavailable
}

export function loadTripData(): TripData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.id === 'eur26-trip' && parsed.days && parsed.days.length >= 40) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load saved trip data:', err);
  }
  const initial = getInitialTripData();
  saveTripData(initial, false, false);
  return initial;
}

export function resetTripToDefault(): TripData {
  const initial = getInitialTripData();
  saveTripData(initial, true, true);
  return initial;
}

export function saveTripData(data: TripData, broadcast = true, syncCloud = true, authorName?: string): void {
  try {
    const updated = {
      ...data,
      lastSyncedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    if (broadcast && broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'TRIP_UPDATED',
        data: updated,
        timestamp: Date.now()
      });
    }

    if (syncCloud) {
      pushTripToCloud(updated, authorName);
    }
  } catch (err) {
    console.error('Failed to save trip data:', err);
  }
}

export function subscribeToTripSync(callback: (data: TripData) => void): () => void {
  if (!broadcastChannel) return () => {};

  const handler = (event: MessageEvent) => {
    if (event.data && event.data.type === 'TRIP_UPDATED' && event.data.data) {
      callback(event.data.data);
    }
  };

  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
}

export function loadNotifications(): CollaborationNotification[] {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return [
    {
      id: 'notif-1',
      senderName: 'Tai',
      senderAvatar: '👩‍🎨',
      actionText: 'booked St. Peter’s Basilica Dome Climb tickets (€86)',
      timestamp: '10 mins ago',
      type: 'ticket',
      targetItemTitle: 'St. Peter’s Basilica & DOME Climb'
    },
    {
      id: 'notif-2',
      senderName: 'Anth',
      senderAvatar: '👨‍✈️',
      actionText: 'confirmed Italo high-speed train tickets to Florence (K9BG5Y)',
      timestamp: '25 mins ago',
      type: 'expense',
      targetItemTitle: 'Italo Train 9924'
    },
    {
      id: 'notif-3',
      senderName: 'Lia',
      senderAvatar: '🌟',
      actionText: 'split settled: Harry Potter Warner Bros Studios Tour London ($645.39)',
      timestamp: '1 hour ago',
      type: 'expense',
      targetItemTitle: 'Harry Potter Warner Bros Studios'
    }
  ];
}

export function saveNotification(notif: CollaborationNotification, syncCloud = true): CollaborationNotification[] {
  try {
    const existing = loadNotifications();
    const updated = [notif, ...existing].slice(0, 30);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    if (syncCloud) {
      pushActivityNotification(notif);
    }
    return updated;
  } catch {
    return [];
  }
}

// Convert uploaded file to base64 with automatic lossless visual compression for offline local storage
export async function fileToBase64(file: File): Promise<string> {
  if (file.type.startsWith('image/')) {
    try {
      const result = await compressImageFile(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.78
      });
      return result.dataUrl;
    } catch {
      // fallback to uncompressed if canvas error
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
