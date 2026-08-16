import { TripData, FamilyMember, WaypointPhoto, ExpenseItem, TicketItem } from '../types';
import { FAZZALARI_DAYS } from './tripDays';
import { FAZZALARI_ITEMS } from './tripItems';
import { FAZZALARI_EXPENSES, FAZZALARI_TICKETS } from './tripExpensesAndTickets';

export const INITIAL_MEMBERS: FamilyMember[] = [
  { id: 'm-anth', name: 'Anthony (Anth) Fazzalari', relation: 'Dad & Husband', avatarColor: 'bg-[#1A535C]', isOnline: true, avatarEmoji: '👨‍✈️' },
  { id: 'm-tai', name: 'Tai Fazzalari', relation: 'Mom & Wife', avatarColor: 'bg-[#FF6B6B]', isOnline: true, avatarEmoji: '👩‍🎨' },
  { id: 'm-james', name: 'James Fazzalari', relation: 'Son (14)', avatarColor: 'bg-amber-500', isOnline: true, avatarEmoji: '🏄‍♂️' },
  { id: 'm-zoe', name: 'Zoe Fazzalari', relation: 'Daughter (turns 13 on 23-Aug)', avatarColor: 'bg-emerald-500', isOnline: true, avatarEmoji: '🍦' },
  { id: 'm-dan', name: 'Daniel Fazzalari', relation: 'Son (turns 11 on 18-Sep)', avatarColor: 'bg-indigo-500', isOnline: false, avatarEmoji: '⚽' },
  { id: 'm-lia', name: 'Lia Nigro', relation: "Tai's Sister", avatarColor: 'bg-[#4ECDC4]', isOnline: true, avatarEmoji: '🌟' },
  { id: 'm-josie', name: 'Josie Nigro (Nonna)', relation: "Tai & Lia's Mother", avatarColor: 'bg-[#FFE66D]', isOnline: false, avatarEmoji: '👵' }
];

export const INITIAL_PHOTOS: WaypointPhoto[] = [
  {
    id: 'p-1',
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sunset over Piazza del Popolo during our evening golf cart tour in Rome.',
    takenAt: '2026-09-06 20:15',
    author: 'Tai Fazzalari',
    locationName: 'Rome, Italy'
  },
  {
    id: 'p-2',
    url: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    caption: 'View of the Santa Maria del Fiore Duomo and Tuscan hills from Piazzale Michelangelo.',
    takenAt: '2026-09-11 18:45',
    author: 'Anthony (Anth)',
    locationName: 'Florence, Italy'
  },
  {
    id: 'p-3',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Crystal clear turquoise water at Spiaggia Bianca & Cala Moresca in Golfo Aranci.',
    takenAt: '2026-09-25 14:20',
    author: 'Lia Nigro',
    locationName: 'Golfo Aranci, Sardinia'
  },
  {
    id: 'p-4',
    url: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Magical day at Warner Bros Harry Potter Studio Tour London with Lisa and Gian!',
    takenAt: '2026-09-21 13:00',
    author: 'Tai Fazzalari',
    locationName: 'London, United Kingdom'
  }
];

export const getInitialTripData = (): TripData => {
  // Aggregate expenses and tickets from items plus global entries
  const allExpenses: ExpenseItem[] = [...FAZZALARI_EXPENSES];
  const allTickets: TicketItem[] = [...FAZZALARI_TICKETS];

  FAZZALARI_ITEMS.forEach(item => {
    if (item.expenses) {
      item.expenses.forEach(e => {
        if (!allExpenses.some(ex => ex.id === e.id)) {
          allExpenses.push(e);
        }
      });
    }
    if (item.tickets) {
      item.tickets.forEach(t => {
        if (!allTickets.some(tk => tk.id === t.id)) {
          allTickets.push(t);
        }
      });
    }
  });

  return {
    id: 'eur26-trip',
    title: 'EUR26',
    subtitle: 'Adelaide • Naples • Calabria • Rome • Florence • Modena • Venice • London • Sardinia',
    startDate: '2026-08-17',
    endDate: '2026-09-30',
    baseCurrency: 'AUD',
    totalBudget: 22500,
    members: INITIAL_MEMBERS,
    days: FAZZALARI_DAYS,
    items: FAZZALARI_ITEMS,
    allExpenses,
    allTickets,
    allPhotos: INITIAL_PHOTOS,
    roomCode: 'EUR26',
    lastSyncedAt: new Date().toISOString()
  };
};

export { FAZZALARI_DAYS, FAZZALARI_ITEMS, FAZZALARI_EXPENSES, FAZZALARI_TICKETS };
