import React, { useState, useEffect } from 'react';
import { 
  TripData, TripDay, ItineraryItem, ExpenseItem, TicketItem, 
  WaypointPhoto, FamilyMember, CollaborationNotification 
} from './types';
import { loadTripData, saveTripData, subscribeToTripSync, loadNotifications, saveNotification } from './services/storage';
import { 
  subscribeToCloudTrip, 
  subscribeToCloudActivity, 
  pushPhotoToCloud, 
  deletePhotoFromCloud, 
  subscribeToCloudPhotos 
} from './services/firebase';
import { Navbar } from './components/Navbar';
import { DayNavigator } from './components/DayNavigator';
import { DayTimelineView } from './components/DayTimelineView';
import { TripOverviewCalendar } from './components/TripOverviewCalendar';
import { ExpenseAndTicketHub } from './components/ExpenseAndTicketHub';
import { CsvImportExportModal } from './components/CsvImportExportModal';
import { CollaborationModal } from './components/CollaborationModal';
import { ItemEditModal } from './components/ItemEditModal';
import { DayEditModal } from './components/DayEditModal';
import { TicketWalletModal } from './components/TicketWalletModal';
import { EmergencyContactsModal } from './components/EmergencyContactsModal';
import { ExpenseEditModal } from './components/ExpenseEditModal';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { TravelJournalGallery } from './components/TravelJournalGallery';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { CurrencyMode } from './utils/currency';
import { getTripDayIndexForDate, getTodayDateString } from './utils/date';

export default function App() {
  const [trip, setTrip] = useState<TripData>(loadTripData);
  
  // Initialize to current trip day (e.g. Day 14 on 30-Aug) or user's active session day
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const tripData = loadTripData();
    const todayIndex = getTripDayIndexForDate(tripData.days);
    
    if (typeof window !== 'undefined') {
      try {
        const savedSession = sessionStorage.getItem('eur26_selected_day_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          const currentToday = getTodayDateString();
          // If the user actively picked a specific day in this session today, preserve it
          if (
            parsed.sessionDate === currentToday && 
            typeof parsed.dayIndex === 'number' && 
            parsed.dayIndex >= 0 && 
            parsed.dayIndex < tripData.days.length
          ) {
            return parsed.dayIndex;
          }
        }
      } catch (e) {
        // fallback to todayIndex
      }
    }
    
    return todayIndex;
  });

  const [activeTab, setActiveTab] = useState<'day' | 'overview' | 'expenses' | 'journal'>('day');
  
  // Safe day selector that stores user session and prevents accidental resets
  const handleSelectDay = (index: number) => {
    const validIndex = Math.max(0, Math.min(index, trip.days.length - 1));
    setSelectedDayIndex(validIndex);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('eur26_selected_day_session', JSON.stringify({
          dayIndex: validIndex,
          sessionDate: getTodayDateString()
        }));
      } catch (e) {
        // ignore
      }
    }
  };

  // Universal currency mode
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eur26_currency_mode');
      if (saved === 'AUD' || saved === 'EUR') return saved;
    }
    return 'AUD';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('eurosummer_dark_mode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [notifications, setNotifications] = useState<CollaborationNotification[]>(loadNotifications);
  
  // When app regains focus or visibility (e.g. user opens the app on a new day during the holiday),
  // automatically advance to the new current day of the trip
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        const currentTodayStr = getTodayDateString();
        try {
          const savedSession = sessionStorage.getItem('eur26_selected_day_session');
          if (savedSession) {
            const parsed = JSON.parse(savedSession);
            // If the session was from a previous date, advance to the new current day
            if (parsed.sessionDate !== currentTodayStr) {
              const newDayIndex = getTripDayIndexForDate(trip.days, currentTodayStr);
              handleSelectDay(newDayIndex);
            }
          } else {
            const newDayIndex = getTripDayIndexForDate(trip.days, currentTodayStr);
            handleSelectDay(newDayIndex);
          }
        } catch (e) {
          const newDayIndex = getTripDayIndexForDate(trip.days, currentTodayStr);
          handleSelectDay(newDayIndex);
        }
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [trip.days]);

  // Ensure selectedDayIndex is always within bounds
  useEffect(() => {
    if (trip.days.length > 0 && selectedDayIndex >= trip.days.length) {
      handleSelectDay(trip.days.length - 1);
    }
  }, [trip.days.length, selectedDayIndex]);
  
  // Modals state
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [isDayEditModalOpen, setIsDayEditModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<TripDay | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [expenseTargetItemId, setExpenseTargetItemId] = useState<string | undefined>(undefined);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTargetItemId, setPhotoTargetItemId] = useState<string | undefined>(undefined);
  const [isPwaGuideOpen, setIsPwaGuideOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eurosummer_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eurosummer_dark_mode', 'false');
    }
  }, [darkMode]);

  // Persist currency mode
  useEffect(() => {
    localStorage.setItem('eur26_currency_mode', currencyMode);
  }, [currencyMode]);

  // Subscribe to real-time BroadcastChannel sync across tabs/windows, Cloud Firestore trip sync & dedicated Photos sync
  useEffect(() => {
    const unsubLocal = subscribeToTripSync((syncedData) => {
      setTrip(syncedData);
    });

    const unsubCloud = subscribeToCloudTrip((cloudTripData) => {
      setTrip(prevTrip => {
        // Retain any locally uploaded photos that may be newer
        const currentPhotos = prevTrip.allPhotos || [];
        const cloudPhotos = cloudTripData.allPhotos || [];
        const mergedPhotosMap = new Map<string, WaypointPhoto>();
        cloudPhotos.forEach(p => mergedPhotosMap.set(p.id, p));
        currentPhotos.forEach(p => mergedPhotosMap.set(p.id, p));
        
        return {
          ...cloudTripData,
          allPhotos: Array.from(mergedPhotosMap.values())
        };
      });
    });

    const unsubPhotos = subscribeToCloudPhotos((cloudPhotos) => {
      if (!cloudPhotos || cloudPhotos.length === 0) return;
      setTrip(prevTrip => {
        const photosMap = new Map<string, WaypointPhoto>();
        (prevTrip.allPhotos || []).forEach(p => photosMap.set(p.id, p));
        cloudPhotos.forEach(p => photosMap.set(p.id, p));
        const mergedPhotos = Array.from(photosMap.values());

        // Also ensure item-level photos are synchronized
        const updatedItems = prevTrip.items.map(it => {
          const itemPhotos = mergedPhotos.filter(p => p.itemId === it.id);
          if (itemPhotos.length > 0) {
            const itemPhotoMap = new Map<string, WaypointPhoto>();
            (it.photos || []).forEach(p => itemPhotoMap.set(p.id, p));
            itemPhotos.forEach(p => itemPhotoMap.set(p.id, p));
            return { ...it, photos: Array.from(itemPhotoMap.values()) };
          }
          return it;
        });

        const newTrip = {
          ...prevTrip,
          allPhotos: mergedPhotos,
          items: updatedItems
        };
        saveTripData(newTrip, false, false);
        return newTrip;
      });
    });

    const unsubActivity = subscribeToCloudActivity((cloudNotifs) => {
      setNotifications(cloudNotifs);
    });

    return () => {
      unsubLocal();
      unsubCloud();
      unsubPhotos();
      unsubActivity();
    };
  }, []);

  // Update Trip helper
  const updateTrip = (newTrip: TripData, notifyAction?: { sender: string; avatar: string; action: string; target?: string }) => {
    setTrip(newTrip);
    saveTripData(newTrip);

    if (notifyAction) {
      const newNotif: CollaborationNotification = {
        id: `notif-${Date.now()}`,
        senderName: notifyAction.sender,
        senderAvatar: notifyAction.avatar,
        actionText: notifyAction.action,
        timestamp: 'Just now',
        type: 'itinerary',
        targetItemTitle: notifyAction.target
      };
      const updatedNotifs = saveNotification(newNotif);
      setNotifications(updatedNotifs);
    }
  };

  // Toggle item completion
  const handleToggleComplete = (itemId: string) => {
    const updatedItems = trip.items.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    const targetItem = trip.items.find(i => i.id === itemId);
    const updatedTrip = { ...trip, items: updatedItems };
    
    updateTrip(updatedTrip, {
      sender: 'Anthony (Dad)',
      avatar: '👨‍✈️',
      action: targetItem?.completed ? 'marked stop as unvisited' : 'marked stop as visited! ✅',
      target: targetItem?.title
    });
  };

  // Save Item (Create or Update)
  const handleSaveItem = (itemToSave: ItineraryItem) => {
    const exists = trip.items.some(it => it.id === itemToSave.id);
    let updatedItems: ItineraryItem[];

    if (exists) {
      updatedItems = trip.items.map(it => it.id === itemToSave.id ? itemToSave : it);
    } else {
      updatedItems = [...trip.items, itemToSave];
    }

    const updatedTrip = { ...trip, items: updatedItems };
    updateTrip(updatedTrip, {
      sender: 'Tai (Mom)',
      avatar: '👩‍🎨',
      action: exists ? 'updated waypoint schedule' : 'added a new itinerary stop',
      target: itemToSave.title
    });
  };

  // Delete Item
  const handleDeleteItem = (itemId: string) => {
    if (!confirm('Are you sure you want to remove this stop from your itinerary?')) return;
    const targetItem = trip.items.find(i => i.id === itemId);
    const updatedItems = trip.items.filter(it => it.id !== itemId);
    const updatedTrip = { ...trip, items: updatedItems };
    updateTrip(updatedTrip, {
      sender: 'Anthony (Dad)',
      avatar: '👨‍✈️',
      action: 'removed a stop from the schedule',
      target: targetItem?.title
    });
  };

  // Attach photo to specific item using modal
  const handleOpenAddPhoto = (targetItemId?: string) => {
    setPhotoTargetItemId(targetItemId);
    setIsPhotoModalOpen(true);
  };

  const handleSavePhotoModal = (newPhoto: WaypointPhoto, targetItemId?: string) => {
    const photoWithMeta: WaypointPhoto = {
      ...newPhoto,
      itemId: targetItemId
    };

    // Save directly to dedicated Firestore collection for immediate sync to all iPads & family devices
    pushPhotoToCloud(photoWithMeta);

    let updatedItems = trip.items;
    let targetTitle = 'Visual Journal';

    if (targetItemId) {
      const targetItem = trip.items.find(i => i.id === targetItemId);
      if (targetItem) {
        targetTitle = targetItem.title;
        updatedItems = trip.items.map(it => {
          if (it.id === targetItemId) {
            return { ...it, photos: [...(it.photos || []).filter(p => p.id !== photoWithMeta.id), photoWithMeta] };
          }
          return it;
        });
      }
    }

    const updatedTrip = {
      ...trip,
      items: updatedItems,
      allPhotos: [photoWithMeta, ...(trip.allPhotos || []).filter(p => p.id !== photoWithMeta.id)]
    };

    updateTrip(updatedTrip, {
      sender: newPhoto.author.split(' ')[0] || 'Family',
      avatar: '📷',
      action: 'pinned a photo memory',
      target: targetTitle
    });
  };

  // Delete Photo
  const handleDeletePhoto = (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo memory?')) return;
    deletePhotoFromCloud(photoId);
    const updatedTrip = {
      ...trip,
      allPhotos: (trip.allPhotos || []).filter(p => p.id !== photoId),
      items: trip.items.map(it => ({
        ...it,
        photos: (it.photos || []).filter(p => p.id !== photoId)
      }))
    };
    updateTrip(updatedTrip, {
      sender: 'Anthony (Dad)',
      avatar: '👨‍✈️',
      action: 'removed a photo memory'
    });
  };

  // Open Expense Modal (Add Mode)
  const handleOpenAddExpense = (targetItemId?: string) => {
    setEditingExpense(null);
    setExpenseTargetItemId(targetItemId);
    setIsExpenseModalOpen(true);
  };

  // Open Expense Modal (Edit Mode)
  const handleOpenEditExpense = (expense: ExpenseItem, targetItemId?: string) => {
    setEditingExpense(expense);
    setExpenseTargetItemId(targetItemId);
    setIsExpenseModalOpen(true);
  };

  // Save Expense (Create or Update with full editing capabilities)
  const handleSaveExpense = (expenseToSave: ExpenseItem, targetItemId?: string) => {
    const isExisting = trip.allExpenses?.some(e => e.id === expenseToSave.id) || 
                       trip.items.some(it => it.expenses && it.expenses.some(e => e.id === expenseToSave.id));

    // 1. Update/Add in trip.allExpenses
    let updatedAllExpenses: ExpenseItem[] = [...(trip.allExpenses || [])];
    const allExpIndex = updatedAllExpenses.findIndex(e => e.id === expenseToSave.id);
    if (allExpIndex >= 0) {
      updatedAllExpenses[allExpIndex] = expenseToSave;
    } else {
      updatedAllExpenses = [expenseToSave, ...updatedAllExpenses];
    }

    // 2. Update/Add/Move in trip.items
    const updatedItems = trip.items.map(it => {
      let itemExpenses = it.expenses ? [...it.expenses] : [];
      const expIdx = itemExpenses.findIndex(e => e.id === expenseToSave.id);

      if (targetItemId === it.id) {
        if (expIdx >= 0) {
          itemExpenses[expIdx] = expenseToSave;
        } else {
          itemExpenses.push(expenseToSave);
        }
      } else if (targetItemId && expIdx >= 0) {
        // Reassigned to another item
        itemExpenses = itemExpenses.filter(e => e.id !== expenseToSave.id);
      } else if (!targetItemId && expIdx >= 0) {
        // Updated in-place on this item
        itemExpenses[expIdx] = expenseToSave;
      }

      return { ...it, expenses: itemExpenses };
    });

    const updatedTrip = {
      ...trip,
      allExpenses: updatedAllExpenses,
      items: updatedItems
    };

    const currencySymbol = expenseToSave.currency === 'AUD' ? '$' : expenseToSave.currency === 'GBP' ? '£' : '€';

    updateTrip(updatedTrip, {
      sender: 'Anthony (Dad)',
      avatar: '👨‍✈️',
      action: isExisting 
        ? `updated expense details for "${expenseToSave.title}"`
        : `logged ${currencySymbol}${expenseToSave.amount} for "${expenseToSave.title}"`,
      target: expenseToSave.title
    });
  };

  // Add Standalone Ticket
  const handleAddStandaloneTicket = () => {
    const title = prompt('Pass or Ticket title:', 'Capri Ferry Fast-Pass');
    if (!title) return;
    const code = prompt('Confirmation / PNR Code:', 'PNR-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    if (!code) return;

    const newTkt: TicketItem = {
      id: `tkt-stand-${Date.now()}`,
      title,
      type: 'ferry',
      confirmationCode: code,
      validDate: trip.days[selectedDayIndex]?.date || '2026-08-17',
      holderNames: trip.members.map(m => m.name)
    };

    const updatedTrip = {
      ...trip,
      allTickets: [newTkt, ...(trip.allTickets || [])]
    };

    updateTrip(updatedTrip, {
      sender: 'James',
      avatar: '🏄‍♂️',
      action: `added ticket confirmation "${title}" [${code}]`
    });
  };

  // Delete Expense
  const handleDeleteExpense = (expId: string) => {
    const targetExp = (trip.allExpenses || []).find(e => e.id === expId) || 
                      trip.items.flatMap(it => it.expenses || []).find(e => e.id === expId);
    const expTitle = targetExp?.title ? `"${targetExp.title}"` : 'this expense';
    if (!confirm(`Are you sure you want to delete ${expTitle}?`)) return;
    const updatedTrip = {
      ...trip,
      allExpenses: (trip.allExpenses || []).filter(e => e.id !== expId),
      items: trip.items.map(it => ({
        ...it,
        expenses: (it.expenses || []).filter(e => e.id !== expId)
      }))
    };
    updateTrip(updatedTrip, {
      sender: 'Anthony (Dad)',
      avatar: '👨‍✈️',
      action: `deleted expense ${expTitle}`
    });
  };

  // Delete Ticket
  const handleDeleteTicket = (tktId: string) => {
    const targetTkt = (trip.allTickets || []).find(t => t.id === tktId) || 
                      trip.items.flatMap(it => it.tickets || []).find(t => t.id === tktId);
    const tktTitle = targetTkt?.title ? `"${targetTkt.title}"` : 'this ticket/pass';
    if (!confirm(`Are you sure you want to delete ${tktTitle}?`)) return;
    const updatedTrip = {
      ...trip,
      allTickets: (trip.allTickets || []).filter(t => t.id !== tktId),
      items: trip.items.map(it => ({
        ...it,
        tickets: (it.tickets || []).filter(t => t.id !== tktId)
      }))
    };
    updateTrip(updatedTrip, {
      sender: 'Anthony (Dad)',
      avatar: '👨‍✈️',
      action: `deleted ticket ${tktTitle}`
    });
  };

  // Add Family Member
  const handleAddMember = (member: FamilyMember) => {
    const updatedTrip = {
      ...trip,
      members: [...trip.members, member]
    };
    updateTrip(updatedTrip, {
      sender: member.name,
      avatar: member.avatarEmoji,
      action: 'joined the family trip collaboration group!'
    });
  };

  // Simulate Peer Edit Push
  const handleSimulatePeerEdit = () => {
    const simulatedActions = [
      {
        sender: 'James Fazzalari',
        avatar: '🏄‍♂️',
        action: 'added Ferrari Museum visit in Maranello to Day 29!',
        itemTitle: 'Ferrari Museum Maranello'
      },
      {
        sender: 'Zoe Fazzalari',
        avatar: '🍦',
        action: 'voted for Birthday Dinner & Gelato in Calabria!',
        itemTitle: 'Zoe 13th Birthday Celebration'
      },
      {
        sender: 'Daniel Fazzalari',
        avatar: '🎮',
        action: 'picked Harry Potter Warner Bros Studios Tour in London!',
        itemTitle: 'Harry Potter Warner Bros Studios Tour'
      },
      {
        sender: 'Lia Nigro',
        avatar: '🌟',
        action: 'confirmed Capri Private Boat Tour reservation with Blue Grotto!',
        itemTitle: 'Capri & Blue Grotto Boat Charter'
      },
      {
        sender: 'Josie Nigro (Nonna)',
        avatar: '👵',
        action: 'added authentic Cannoli & Pastry stop in Naples!',
        itemTitle: 'Pastry & Espresso Stop in Naples'
      },
      {
        sender: 'Tai (Mom)',
        avatar: '👩‍🎨',
        action: 'confirmed St. Peter’s Basilica & Dome climb booking!',
        itemTitle: 'St. Peter’s Basilica Dome Climb'
      }
    ];

    const randomAction = simulatedActions[Math.floor(Math.random() * simulatedActions.length)];
    
    const newNotif: CollaborationNotification = {
      id: `sim-notif-${Date.now()}`,
      senderName: randomAction.sender,
      senderAvatar: randomAction.avatar,
      actionText: randomAction.action,
      timestamp: 'Just now',
      type: 'itinerary',
      targetItemTitle: randomAction.itemTitle
    };

    const updatedNotifs = saveNotification(newNotif);
    setNotifications(updatedNotifs);
    alert(`🔔 Push Notification received from ${randomAction.sender}: "${randomAction.action}"`);
  };

  // Save Day (Theme title, city, summary notes, weather, cover image)
  const handleSaveDay = (updatedDay: TripDay) => {
    const updatedDays = trip.days.map(d => d.dayIndex === updatedDay.dayIndex ? updatedDay : d);
    const updatedTrip: TripData = {
      ...trip,
      days: updatedDays
    };
    updateTrip(updatedTrip, {
      sender: 'Family Planner',
      avatar: '✏️',
      action: `updated Day ${updatedDay.dayNumber} details: "${updatedDay.themeTitle}"`,
      target: updatedDay.themeTitle
    });
  };

  // Import CSV data (replace or append)
  const handleImportTripData = (importedData: Partial<TripData>, mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      const newTrip: TripData = {
        ...trip,
        days: importedData.days && importedData.days.length > 0 ? importedData.days : trip.days,
        items: importedData.items || [],
        allExpenses: importedData.allExpenses || [],
        allTickets: importedData.allTickets || []
      };
      updateTrip(newTrip, {
        sender: 'Anthony (Dad)',
        avatar: '👨‍✈️',
        action: `imported CSV itinerary (${importedData.items?.length || 0} stops)`
      });
    } else {
      const newItems = [...trip.items, ...(importedData.items || [])];
      const newTrip: TripData = {
        ...trip,
        items: newItems
      };
      updateTrip(newTrip, {
        sender: 'Tai (Mom)',
        avatar: '👩‍🎨',
        action: `appended ${importedData.items?.length || 0} stops from CSV`
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] dark:bg-[#121B20] text-[#2D3436] dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Sticky Navbar with Responsive Symmetric Header */}
      <Navbar
        trip={trip}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDayIndex={selectedDayIndex}
        currencyMode={currencyMode}
        setCurrencyMode={setCurrencyMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenWallet={() => setIsWalletModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenCollabModal={() => setIsCollabModalOpen(true)}
        onOpenAddItemModal={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        onOpenInstallModal={() => setIsPwaGuideOpen(true)}
        notifications={notifications}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        
        {/* TAB 1: Day Timeline View (Includes Pocket Assistant, Waypoints, Map & Photos) */}
        {activeTab === 'day' && (
          <div className="space-y-6 animate-fadeIn">
            <DayNavigator
              trip={trip}
              selectedDayIndex={selectedDayIndex}
              currencyMode={currencyMode}
              onSelectDay={handleSelectDay}
              onEditDay={() => {
                setEditingDay(trip.days[selectedDayIndex]);
                setIsDayEditModalOpen(true);
              }}
            />

            <DayTimelineView
              trip={trip}
              selectedDayIndex={selectedDayIndex}
              currencyMode={currencyMode}
              onToggleComplete={handleToggleComplete}
              onEditItem={(item) => {
                setEditingItem(item);
                setIsItemModalOpen(true);
              }}
              onDeleteItem={handleDeleteItem}
              onAddItem={() => {
                setEditingItem(null);
                setIsItemModalOpen(true);
              }}
              onAddPhotoToItem={(itemId) => handleOpenAddPhoto(itemId)}
              onAddExpenseToItem={(itemId) => handleOpenAddExpense(itemId)}
              onEditExpense={(exp, itemId) => handleOpenEditExpense(exp, itemId)}
              onOpenWallet={() => setIsWalletModalOpen(true)}
              onEditDay={() => {
                setEditingDay(trip.days[selectedDayIndex]);
                setIsDayEditModalOpen(true);
              }}
              onSelectDay={handleSelectDay}
              onDeletePhoto={handleDeletePhoto}
            />
          </div>
        )}

        {/* TAB 2: Full Trip Calendar Overview (With 6 Trip Leg Chapters) */}
        {activeTab === 'overview' && (
          <div className="animate-fadeIn">
            <TripOverviewCalendar
              trip={trip}
              currencyMode={currencyMode}
              onSelectDay={(idx) => {
                handleSelectDay(idx);
                setActiveTab('day');
              }}
              onOpenMap={() => {
                setActiveTab('day');
              }}
              onEditDay={(idx) => {
                setEditingDay(trip.days[idx]);
                setIsDayEditModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 3: Expenses & Ticket Splits */}
        {activeTab === 'expenses' && (
          <div className="animate-fadeIn">
            <ExpenseAndTicketHub
              trip={trip}
              currencyMode={currencyMode}
              setCurrencyMode={setCurrencyMode}
              onAddExpense={() => handleOpenAddExpense()}
              onEditExpense={(exp) => handleOpenEditExpense(exp)}
              onAddTicket={handleAddStandaloneTicket}
              onDeleteExpense={handleDeleteExpense}
              onDeleteTicket={handleDeleteTicket}
            />
          </div>
        )}

        {/* TAB 4: Family Visual Travel Journal & Polaroid Album */}
        {activeTab === 'journal' && (
          <div className="animate-fadeIn">
            <TravelJournalGallery
              trip={trip}
              onAddPhoto={(photo) => handleSavePhotoModal(photo)}
              onDeletePhoto={handleDeletePhoto}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          setPhotoTargetItemId(undefined);
        }}
        trip={trip}
        targetItemId={photoTargetItemId}
        onSavePhoto={handleSavePhotoModal}
      />

      <ExpenseEditModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
          setExpenseTargetItemId(undefined);
        }}
        trip={trip}
        selectedDayIndex={selectedDayIndex}
        editingExpense={editingExpense}
        targetItemId={expenseTargetItemId}
        onSaveExpense={handleSaveExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      <TicketWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        trip={trip}
        onSelectDay={(dayIdx) => {
          setSelectedDayIndex(dayIdx);
          setActiveTab('day');
        }}
      />

      <EmergencyContactsModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <DayEditModal
        isOpen={isDayEditModalOpen}
        onClose={() => setIsDayEditModalOpen(false)}
        day={editingDay}
        onSaveDay={handleSaveDay}
      />

      <CsvImportExportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        trip={trip}
        onImportTripData={handleImportTripData}
      />

      <CollaborationModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        trip={trip}
        onAddMember={handleAddMember}
        onSimulatePeerEdit={handleSimulatePeerEdit}
      />

      <ItemEditModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        trip={trip}
        selectedDayIndex={selectedDayIndex}
        editingItem={editingItem}
        onSaveItem={handleSaveItem}
      />

      {/* PWA Home Screen Install Banner & Guide */}
      <PWAInstallPrompt
        isForceOpenModal={isPwaGuideOpen}
        onCloseModal={() => setIsPwaGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#FFE66D]/70 dark:border-slate-800/80 py-6 text-center text-xs text-[#2D3436]/70 dark:text-slate-400 bg-white/70 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            ☀️ <strong className="text-[#1A535C] dark:text-[#FFE66D]">EUROPE TRIP 2026</strong> • Fazzalari Family Grand European Itinerary
          </p>
          <div className="flex items-center gap-3 font-semibold text-[#1A535C] dark:text-[#4ECDC4]">
            <span>17 Aug – 30 Sep 2026 • 45 Days</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
