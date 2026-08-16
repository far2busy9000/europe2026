export interface TripLeg {
  id: string;
  legNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  emoji: string;
  color: string;
  startDayNumber: number;
  endDayNumber: number;
  startDate: string;
  endDate: string;
  cities: string[];
  highlight: string;
  coverImage: string;
}

export const TRIP_LEGS: TripLeg[] = [
  {
    id: 'leg-1',
    legNumber: 1,
    title: 'Calabria & Southern Heritage',
    shortTitle: 'Calabria Riviera',
    subtitle: 'Adelaide → Dubai → Naples → Roccella Ionica',
    emoji: '🌊',
    color: '#FF6B6B',
    startDayNumber: 1,
    endDayNumber: 17,
    startDate: '17-Aug',
    endDate: '02-Sep',
    cities: ['Adelaide', 'Dubai', 'Naples', 'Pompeii', 'Roccella Ionica', 'Gerace', 'Scilla', 'Mammola'],
    highlight: "Zoe's 13th Birthday (23-Aug), Family Beach Days, Ancient Byzantine Gerace, Swordfish in Scilla",
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'leg-2',
    legNumber: 2,
    title: 'Campania & Southern Hills',
    shortTitle: 'Campania & Hills',
    subtitle: 'Montesarchio & Sperlonga Coast',
    emoji: '🌄',
    color: '#FF8E53',
    startDayNumber: 18,
    endDayNumber: 20,
    startDate: '03-Sep',
    endDate: '05-Sep',
    cities: ['Montesarchio', 'Sperlonga'],
    highlight: 'Tower of Montesarchio, Authentic Samnite cuisine, Whitewashed cliffs & Sperlonga coastal sunset',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'leg-3',
    legNumber: 3,
    title: 'The Classics: Rome & Florence',
    shortTitle: 'Rome & Florence',
    subtitle: 'Eternal City & Renaissance Heart',
    emoji: '🏛️',
    color: '#1A535C',
    startDayNumber: 21,
    endDayNumber: 27,
    startDate: '06-Sep',
    endDate: '12-Sep',
    cities: ['Rome', 'Florence', 'Vatican City', 'Tuscany'],
    highlight: "Colosseum Arena Floor, St. Peter's Dome Climb, Michelangelo's David at Accademia, Uffizi & Chianti",
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'leg-4',
    legNumber: 4,
    title: 'Motor Valley & Venetian Canals',
    shortTitle: 'Venice & Modena',
    subtitle: 'Modena, Maranello & Venice',
    emoji: '🏎️',
    color: '#4ECDC4',
    startDayNumber: 28,
    endDayNumber: 32,
    startDate: '13-Sep',
    endDate: '17-Sep',
    cities: ['Modena', 'Maranello', 'Montebelluna', 'Venice'],
    highlight: 'Ferrari Museum at Maranello, Balsamic Acetaia tasting, Montebelluna, St. Mark’s Square & Gondola',
    coverImage: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'leg-5',
    legNumber: 5,
    title: 'London Adventure & Magic',
    shortTitle: 'London Adventure',
    subtitle: 'Kensington, West End & Hogwarts',
    emoji: '🇬🇧',
    color: '#3B82F6',
    startDayNumber: 33,
    endDayNumber: 38,
    startDate: '18-Sep',
    endDate: '23-Sep',
    cities: ['London', 'Watford', 'Kensington', 'Westminster'],
    highlight: "Daniel's 11th Birthday (18-Sep), Warner Bros Harry Potter Studio Tour, Tower of London, Lion King Musical",
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'leg-6',
    legNumber: 6,
    title: 'Sardinia Emerald Coast & Journey Home',
    shortTitle: 'Sardinia & Home',
    subtitle: 'Golfo Aranci → Rome → Dubai → Adelaide',
    emoji: '🏖️',
    color: '#10B981',
    startDayNumber: 39,
    endDayNumber: 45,
    startDate: '24-Sep',
    endDate: '30-Sep',
    cities: ['Golfo Aranci', 'Costa Smeralda', 'Rome', 'Dubai', 'Adelaide'],
    highlight: 'Crystal turquoise waters of Cala Moresca, Porto Cervo luxury marina, Gelato farewell & Emirates home flight',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80'
  }
];

export interface SpecialBirthday {
  dayNumber: number;
  date: string;
  name: string;
  age: number;
  location: string;
  emoji: string;
  theme: string;
}

export const TRIP_BIRTHDAYS: SpecialBirthday[] = [
  {
    dayNumber: 7,
    date: '2026-08-23',
    name: 'Zoe Fazzalari',
    age: 13,
    location: 'Roccella Ionica, Calabria',
    emoji: '🎂',
    theme: 'Officially a Teenager! Beachside celebration, pizza feast & Italian gelato cake.'
  },
  {
    dayNumber: 33,
    date: '2026-09-18',
    name: 'Daniel Fazzalari',
    age: 11,
    location: 'London, UK',
    emoji: '🎮',
    theme: '11th Birthday in London! EasyJet flight to London & West End dinner celebration.'
  }
];
