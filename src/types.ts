export type CategoryType = 
  | 'sightseeing'
  | 'food'
  | 'transport'
  | 'lodging'
  | 'activity'
  | 'relaxation'
  | 'shopping'
  | 'museum'
  | 'tour';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  amountAud?: number;
  paidBy: string; // Family member name/id
  splitBetween: string[]; // List of member names
  category: CategoryType | 'tickets' | 'other';
  notes?: string;
  receiptUrl?: string;
  isSettled?: boolean;
  date: string;
  liaPortionAud?: number;
  bookingRef?: string;
}

export interface HotelInfo {
  hotelName: string;
  address?: string;
  phone?: string;
  checkIn?: string;
  checkOut?: string;
  cityTaxNotes?: string;
  notes?: string;
}

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  bookingRef?: string;
  departureCity?: string;
  arrivalCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  seatsOrBags?: string;
  terminal?: string;
}

export interface TicketItem {
  id: string;
  title: string;
  type: 'train' | 'flight' | 'museum' | 'ferry' | 'hotel' | 'tour' | 'other';
  confirmationCode: string;
  bookingReference?: string;
  qrOrBarcodeData?: string; // string representation or QR code text
  validDate: string;
  validTime?: string;
  holderNames: string[];
  notes?: string;
  seatInfo?: string;
  fileAttachment?: string; // image or simulated pdf url
}

export interface WaypointPhoto {
  id: string;
  url: string;
  caption: string;
  takenAt: string;
  author: string;
  locationName: string;
  itemId?: string;
  dayIndex?: number;
}

export interface WeatherData {
  temp: number; // Celsius
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Clear Warm' | 'Breezy' | 'Thunderstorm';
  icon: string; // Lucide icon identifier
  uvIndex: number;
  rainChance: number; // Percentage 0-100
  windSpeed: string;
  packingTip: string;
}

export interface ItineraryItem {
  id: string;
  dayIndex: number; // 0-based
  time: string; // "09:30 AM" or "14:00"
  title: string;
  locationName: string;
  destinationCity: string;
  lat: number;
  lng: number;
  category: CategoryType;
  notes: string;
  completed: boolean;
  expenses: ExpenseItem[];
  tickets: TicketItem[];
  photos: WaypointPhoto[];
  suggestedDuration?: string; // e.g. "2 hours"
  mustTryTip?: string; // e.g. "Order Pistachio gelato at Gelateria del Teatro"
  assignedMembers?: string[];
  hotelInfo?: HotelInfo;
  flightInfo?: FlightInfo;
}

export interface TripDay {
  dayIndex: number;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  themeTitle: string; // e.g. "Arrival in Rome & Trastevere Sunset"
  city: string;
  country: string;
  weather: WeatherData;
  coverImage?: string;
  summaryNotes?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // "Dad", "Mom", "Teen", "Kid", "Friend"
  avatarColor: string;
  isOnline: boolean;
  avatarEmoji: string;
}

export interface CollaborationNotification {
  id: string;
  senderName: string;
  senderAvatar: string;
  actionText: string;
  timestamp: string;
  type: 'itinerary' | 'expense' | 'ticket' | 'photo' | 'comment';
  targetItemTitle?: string;
}

export interface TripData {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  totalBudget: number;
  members: FamilyMember[];
  days: TripDay[];
  items: ItineraryItem[];
  allExpenses: ExpenseItem[];
  allTickets: TicketItem[];
  allPhotos: WaypointPhoto[];
  roomCode: string;
  lastSyncedAt: string;
}
