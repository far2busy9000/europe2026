import { TripDay } from '../types';

export const FAZZALARI_DAYS: TripDay[] = [
  // Day 1: 17-Aug (Mon) - Adelaide to Dubai
  {
    dayIndex: 0,
    dayNumber: 1,
    date: '2026-08-17',
    dayOfWeek: 'Monday',
    themeTitle: 'Departure from Adelaide & Flight to Dubai',
    city: 'Adelaide to Dubai',
    country: 'Australia / UAE',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Depart Adelaide Airport on Emirates EK 0441 at 21:50. Overnight flight to Dubai.',
    weather: { temp: 16, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 4, rainChance: 10, windSpeed: '18 km/h', packingTip: 'Travel layers, neck pillow, eye masks & flight chargers.' }
  },
  // Day 2: 18-Aug (Tues) - Dubai to Naples
  {
    dayIndex: 1,
    dayNumber: 2,
    date: '2026-08-18',
    dayOfWeek: 'Tuesday',
    themeTitle: 'Transit Dubai & Arrival in Naples',
    city: 'Dubai to Naples',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Emirates EK 2391 departs Dubai at 07:40, lands Naples at 12:00. Check into Starhotels Termini, Piazza Garibaldi.',
    weather: { temp: 31, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Linen clothing, sunglasses & sunscreen for Southern Italy sun.' }
  },
  // Day 3: 19-Aug (Wed) - Naples
  {
    dayIndex: 2,
    dayNumber: 3,
    date: '2026-08-19',
    dayOfWeek: 'Wednesday',
    themeTitle: 'Historic Naples, Spaccanapoli & Authentic Pizza',
    city: 'Naples',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Explore Spaccanapoli alleyways, San Gregorio Armeno nativity artisans, and world-famous Neapolitan pizza.',
    weather: { temp: 32, condition: 'Sunny', icon: 'Sun', uvIndex: 9, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Comfortable walking sneakers for basalt cobblestones.' }
  },
  // Day 4: 20-Aug (Thurs) - Naples / Pompeii
  {
    dayIndex: 3,
    dayNumber: 4,
    date: '2026-08-20',
    dayOfWeek: 'Thursday',
    themeTitle: 'Pompeii Archaeological Tour (9:00 AM)',
    city: 'Naples & Pompeii',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Pompeii guided tour starting at 9:00 AM. Walk through preserved Roman streets, villas, and ancient forum.',
    weather: { temp: 33, condition: 'Sunny', icon: 'Sun', uvIndex: 9, rainChance: 0, windSpeed: '12 km/h', packingTip: 'Sunhat, umbrella/parasol and refillable chilled water bottle.' }
  },
  // Day 5: 21-Aug (Fri) - Naples to Roccella Ionica
  {
    dayIndex: 4,
    dayNumber: 5,
    date: '2026-08-21',
    dayOfWeek: 'Friday',
    themeTitle: 'Train to Reggio & Scenic Drive to Roccella Ionica',
    city: 'Naples to Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Train south to Reggio Calabria, drive to Roccella Ionica holiday apartment. Welcome to the Calabrian coast!',
    weather: { temp: 32, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 5, windSpeed: '14 km/h', packingTip: 'Swimwear, beach towels and flip-flops ready for the Ionian Sea.' }
  },
  // Day 6: 22-Aug (Sat) - Roccella Ionica
  {
    dayIndex: 5,
    dayNumber: 6,
    date: '2026-08-22',
    dayOfWeek: 'Saturday',
    themeTitle: 'Roccella Ionica Beach Relaxation',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Crystal turquoise Ionian waters, lido umbrellas, and evening lungomare stroll.',
    weather: { temp: 31, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '11 km/h', packingTip: 'Snorkel gear and beach tote.' }
  },
  // Day 7: 23-Aug (Sun) - Roccella Ionica
  {
    dayIndex: 6,
    dayNumber: 7,
    date: '2026-08-23',
    dayOfWeek: 'Sunday',
    themeTitle: "🎉 Zoe's 13th Birthday! Carafa Castle & Seaside Celebration",
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Happy 13th Birthday Zoe! Celebrate with a morning visit to the medieval Castello dei Principi Carafa, afternoon beach swim in the warm Ionian Sea, and a special family birthday dinner with artisan gelato in Piazza San Vittorio.',
    weather: { temp: 30, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '9 km/h', packingTip: 'Camera & festive summer outfit for Zoe’s 13th birthday celebration!' }
  },
  // Day 8: 24-Aug (Mon) - Roccella Ionica
  {
    dayIndex: 7,
    dayNumber: 8,
    date: '2026-08-24',
    dayOfWeek: 'Monday',
    themeTitle: 'Local Calabrian Markets & Fresh Seafood Feast',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Morning market stroll for sweet Tropea onions, fresh figs, and swordfish dinner at the apartment.',
    weather: { temp: 31, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Market canvas bags for fresh local fruit.' }
  },
  // Day 9: 25-Aug (Tues) - Roccella Ionica
  {
    dayIndex: 8,
    dayNumber: 9,
    date: '2026-08-25',
    dayOfWeek: 'Tuesday',
    themeTitle: 'Riviera dei Gelsomini Coastal Swim',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Warm morning sea swims, relaxing reading time on the balcony, seaside aperitivo.',
    weather: { temp: 30, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Sun protection and summer novels.' }
  },
  // Day 10: 26-Aug (Wed) - Roccella Ionica
  {
    dayIndex: 9,
    dayNumber: 10,
    date: '2026-08-26',
    dayOfWeek: 'Wednesday',
    themeTitle: 'Family Beach Day & Gelato Tasting',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Pristine beach waters, beach volleyball, Tartufo di Pizzo style gelato in the square.',
    weather: { temp: 29, condition: 'Sunny', icon: 'Sun', uvIndex: 7, rainChance: 0, windSpeed: '12 km/h', packingTip: 'Card games and beach paddle ball.' }
  },
  // Day 11: 27-Aug (Thurs) - Roccella Ionica
  {
    dayIndex: 10,
    dayNumber: 11,
    date: '2026-08-27',
    dayOfWeek: 'Thursday',
    themeTitle: 'Calabrian Sunshine & Village Exploration',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Stroll through historic alleyways, visit local bakery for fresh brioche & granita.',
    weather: { temp: 30, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Light evening shawl for ocean breeze.' }
  },
  // Day 12: 28-Aug (Fri) - Roccella Ionica
  {
    dayIndex: 11,
    dayNumber: 12,
    date: '2026-08-28',
    dayOfWeek: 'Friday',
    themeTitle: 'Ionian Coast Golden Hour & Pizza Night',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Late afternoon swim at the marina beach, wood-fired pizza dinner under the stars.',
    weather: { temp: 31, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '9 km/h', packingTip: 'Summer dinner casual wear.' }
  },
  // Day 13: 29-Aug (Sat) - Roccella Ionica
  {
    dayIndex: 12,
    dayNumber: 13,
    date: '2026-08-29',
    dayOfWeek: 'Saturday',
    themeTitle: 'Weekend Beach Festivities & Family Dinner',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Enjoying the lively Saturday atmosphere on the promenade with family.',
    weather: { temp: 30, condition: 'Sunny', icon: 'Sun', uvIndex: 8, rainChance: 0, windSpeed: '11 km/h', packingTip: 'Sunglasses and sunhat.' }
  },
  // Day 14: 30-Aug (Sun) - Roccella Ionica
  {
    dayIndex: 13,
    dayNumber: 14,
    date: '2026-08-30',
    dayOfWeek: 'Sunday',
    themeTitle: 'Farewell Calabria Sunset & Packing',
    city: 'Roccella Ionica',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Final sunset over the Ionian Sea, pack bags for morning train to Reggio Calabria & Naples.',
    weather: { temp: 29, condition: 'Clear Warm', icon: 'Sun', uvIndex: 7, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Organize train tickets and luggage tags.' }
  },
  // Day 15: 31-Aug (Mon) - Roccella -> Reggio -> Naples -> Montesarchio
  {
    dayIndex: 14,
    dayNumber: 15,
    date: '2026-08-31',
    dayOfWeek: 'Monday',
    themeTitle: 'Train North: Reggio to Naples & Bus to Montesarchio',
    city: 'Roccella to Montesarchio',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Trenitalia 5527 (08:32) to Reggio, Italo 8922 (11:18) to Napoli Centrale (arr 16:08). Bus to Montesarchio. Stay with Pat!',
    weather: { temp: 28, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 6, rainChance: 10, windSpeed: '12 km/h', packingTip: 'Keep train PNR codes handy on phone.' }
  },
  // Day 16: 1-Sep (Tues) - San Martino VC
  {
    dayIndex: 15,
    dayNumber: 16,
    date: '2026-09-01',
    dayOfWeek: 'Tuesday',
    themeTitle: 'Valle Caudina Family Day with Pat',
    city: 'San Martino Valle Caudina',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Relaxed morning in San Martino Valle Caudina, homemade lunch and exploring the surrounding green hills.',
    weather: { temp: 26, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Comfortable shoes for hill village strolls.' }
  },
  // Day 17: 2-Sep (Wed) - San Martino VC
  {
    dayIndex: 16,
    dayNumber: 17,
    date: '2026-09-02',
    dayOfWeek: 'Wednesday',
    themeTitle: 'Campania Countryside & Village Life',
    city: 'San Martino Valle Caudina',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Traditional espresso at the local bar, family storytelling and pasta cooking with Pat.',
    weather: { temp: 27, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '7 km/h', packingTip: 'Light cardigan for cool hill evenings.' }
  },
  // Day 18: 3-Sep (Thurs) - San Martino VC
  {
    dayIndex: 17,
    dayNumber: 18,
    date: '2026-09-03',
    dayOfWeek: 'Thursday',
    themeTitle: 'Valle Caudina Strolls & Preparing for Sperlonga',
    city: 'San Martino Valle Caudina',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Scenic mountain walk, afternoon gelato, and packing for the Sperlonga coast.',
    weather: { temp: 26, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 6, rainChance: 5, windSpeed: '9 km/h', packingTip: 'Swimwear ready for Sperlonga beaches.' }
  },
  // Day 19: 4-Sep (Fri) - San Martino VC to Sperlonga
  {
    dayIndex: 18,
    dayNumber: 19,
    date: '2026-09-04',
    dayOfWeek: 'Friday',
    themeTitle: 'Train to Sperlonga Coast & Apartment Check-In',
    city: 'Sperlonga',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Train to Sperlonga. Check into Sperlonga Center Home (Via Giuseppe Romita 189). Washing machine available!',
    weather: { temp: 29, condition: 'Sunny', icon: 'Sun', uvIndex: 7, rainChance: 0, windSpeed: '14 km/h', packingTip: 'Beach towel and flip-flops.' }
  },
  // Day 20: 5-Sep (Sat) - Sperlonga
  {
    dayIndex: 19,
    dayNumber: 20,
    date: '2026-09-05',
    dayOfWeek: 'Saturday',
    themeTitle: 'Sperlonga Whitewashed Alleys & Tiberius Grotto',
    city: 'Sperlonga',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Golden sands of Ponente Beach, archaeological grotto of Roman Emperor Tiberius, seafood dinner.',
    weather: { temp: 28, condition: 'Sunny', icon: 'Sun', uvIndex: 7, rainChance: 0, windSpeed: '12 km/h', packingTip: 'Camera for whitewashed stairs and azure sea.' }
  },
  // Day 21: 6-Sep (Sun) - Sperlonga to Rome
  {
    dayIndex: 20,
    dayNumber: 21,
    date: '2026-09-06',
    dayOfWeek: 'Sunday',
    themeTitle: 'Train to Rome & Golf Cart Tour (7:45 PM)',
    city: 'Sperlonga to Rome',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Train to Rome, check into iFlat Margutta Colors on Canvas (61 Via Margutta). 7:45 PM Golf Cart Tour at Piazza del Popolo!',
    weather: { temp: 28, condition: 'Clear Warm', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Comfortable clothes for open-air golf cart night tour.' }
  },
  // Day 22: 7-Sep (Mon) - Rome
  {
    dayIndex: 21,
    dayNumber: 22,
    date: '2026-09-07',
    dayOfWeek: 'Monday',
    themeTitle: 'Heart of Rome: Spanish Steps, Trevi & Pantheon',
    city: 'Rome',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Walk from Via Margutta to Spanish Steps, toss a coin in Trevi Fountain, marvel at the Pantheon oculus.',
    weather: { temp: 29, condition: 'Sunny', icon: 'Sun', uvIndex: 7, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Shoulder scarf for church dress codes.' }
  },
  // Day 23: 8-Sep (Tues) - Rome
  {
    dayIndex: 22,
    dayNumber: 23,
    date: '2026-09-08',
    dayOfWeek: 'Tuesday',
    themeTitle: 'St. Peter’s Basilica & DOME Climb (8:30 AM)',
    city: 'Rome (Vatican)',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Arrive 8:00 AM at St. Peter’s for 8:30 AM Dome climb (€86 booked). Afternoon: Castel Sant’Angelo & Villa Borghese.',
    weather: { temp: 28, condition: 'Sunny', icon: 'Sun', uvIndex: 7, rainChance: 0, windSpeed: '9 km/h', packingTip: 'Sturdy shoes for 551 dome steps and Vatican dress code.' }
  },
  // Day 24: 9-Sep (Wed) - Rome
  {
    dayIndex: 23,
    dayNumber: 24,
    date: '2026-09-09',
    dayOfWeek: 'Wednesday',
    themeTitle: 'Colosseum Guided Tour (12:00 PM)',
    city: 'Rome',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Colosseum 12:00 PM guided tour (arrive 11:30 AM, 5x tickets). Roman Forum & Palatine Hill imperial ruins.',
    weather: { temp: 28, condition: 'Sunny', icon: 'Sun', uvIndex: 7, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Passports / IDs required for Colosseum entry!' }
  },
  // Day 25: 10-Sep (Thurs) - Rome to Florence
  {
    dayIndex: 24,
    dayNumber: 25,
    date: '2026-09-10',
    dayOfWeek: 'Thursday',
    themeTitle: 'High-Speed Train to Florence & Accademia (David)',
    city: 'Rome to Florence',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Italo 9924 (10:40-12:17). Flat in Via Faenza 18. Medici Chapels @ 2:30 PM & Accademia (Michelangelo David) @ 4:30 PM.',
    weather: { temp: 27, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Museum tickets saved on WhatsApp / Apple Wallet.' }
  },
  // Day 26: 11-Sep (Fri) - Florence
  {
    dayIndex: 25,
    dayNumber: 26,
    date: '2026-09-11',
    dayOfWeek: 'Friday',
    themeTitle: 'Handmade Pasta Cooking Class (10:00 AM)',
    city: 'Florence',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Pasta class for 3 Adults + 3 Children at Viale Ludovico Ariosto 11b/r. Sunset at Piazzale Michelangelo.',
    weather: { temp: 27, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Comfortable cooking clothes and appetite for fresh pasta & tiramisu!' }
  },
  // Day 27: 12-Sep (Sat) - Florence & Pisa
  {
    dayIndex: 26,
    dayNumber: 27,
    date: '2026-09-12',
    dayOfWeek: 'Saturday',
    themeTitle: 'Pisa Day Trip & Leaning Tower Photos',
    city: 'Florence & Pisa',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Morning train to Pisa Piazza dei Miracoli. Afternoon stroll along Ponte Vecchio & artisan leather markets in Florence.',
    weather: { temp: 26, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 5, windSpeed: '11 km/h', packingTip: 'Classic Leaning Tower holding photo poses ready!' }
  },
  // Day 28: 13-Sep (Sun) - Florence to Modena
  {
    dayIndex: 27,
    dayNumber: 28,
    date: '2026-09-13',
    dayOfWeek: 'Sunday',
    themeTitle: 'Train to Modena & Pallamaglio Suites Check-In',
    city: 'Florence to Modena',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Trenitalia FR 8508 at 11:36 AM. Check in Pallamaglio Suites (Via Bonasi 13). Taste authentic tortellini & balsamic vinegar.',
    weather: { temp: 26, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '9 km/h', packingTip: 'Light evening layers for Emilia-Romagna piazza dining.' }
  },
  // Day 29: 14-Sep (Mon) - Modena & Maranello
  {
    dayIndex: 28,
    dayNumber: 29,
    date: '2026-09-14',
    dayOfWeek: 'Monday',
    themeTitle: 'Moscattini Balsamic Farm (8:30 AM) & Ferrari Maranello',
    city: 'Modena & Maranello',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Driver Agostino (€180). 8:30 AM Acetaia Moscattini tasting (€25 p/p) then Ferrari Factory & Museum in Maranello!',
    weather: { temp: 25, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Camera for Ferrari supercars and historic balsamic barrels.' }
  },
  // Day 30: 15-Sep (Tues) - Modena to Montebelluna
  {
    dayIndex: 29,
    dayNumber: 30,
    date: '2026-09-15',
    dayOfWeek: 'Tuesday',
    themeTitle: 'Train North with Padova Stop & Cervi Family Stay',
    city: 'Modena to Montebelluna',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Train north with 2-hour stop in Padova (Prato della Valle). Arrive Montebelluna to stay with the Cervi family!',
    weather: { temp: 24, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 5, rainChance: 10, windSpeed: '10 km/h', packingTip: 'Gifts and warm greetings for the Cervi family.' }
  },
  // Day 31: 16-Sep (Wed) - Montebelluna to Venice
  {
    dayIndex: 30,
    dayNumber: 31,
    date: '2026-09-16',
    dayOfWeek: 'Wednesday',
    themeTitle: 'Day Trip to Venice: St. Mark’s & Gondola Ride',
    city: 'Venice',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Train into Venezia Santa Lucia. Vaporetto down Grand Canal, St. Mark’s Square, Rialto Bridge & cicchetti wine bars.',
    weather: { temp: 24, condition: 'Sunny', icon: 'Sun', uvIndex: 5, rainChance: 0, windSpeed: '12 km/h', packingTip: 'Comfortable walking shoes for stone bridges and steps.' }
  },
  // Day 32: 17-Sep (Thurs) - Montebelluna to Verona
  {
    dayIndex: 31,
    dayNumber: 32,
    date: '2026-09-17',
    dayOfWeek: 'Thursday',
    themeTitle: 'Day Trip to Verona: Roman Arena & Juliet’s Balcony',
    city: 'Verona',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Roman Arena amphitheatre, Casa di Giulietta (Juliet’s balcony), Piazza delle Erbe market square.',
    weather: { temp: 24, condition: 'Sunny', icon: 'Sun', uvIndex: 5, rainChance: 0, windSpeed: '8 km/h', packingTip: 'Camera for historic Roman architecture.' }
  },
  // Day 33: 18-Sep (Fri) - Montebelluna
  {
    dayIndex: 32,
    dayNumber: 33,
    date: '2026-09-18',
    dayOfWeek: 'Friday',
    themeTitle: "🎉 Daniel's 11th Birthday! Valdobbiadene Prosecco Hills & Family Feast",
    city: 'Montebelluna',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Happy 11th Birthday Daniel! Tour the rolling Prosecco vineyards of Treviso foothills and enjoy a celebratory birthday feast at a local rustic trattoria with the Cervi family.',
    weather: { temp: 23, condition: 'Sunny', icon: 'Sun', uvIndex: 5, rainChance: 5, windSpeed: '9 km/h', packingTip: 'Smart casual wear for Daniel’s 11th birthday lunch in the hills.' }
  },
  // Day 34: 19-Sep (Sat) - Montebelluna
  {
    dayIndex: 33,
    dayNumber: 34,
    date: '2026-09-19',
    dayOfWeek: 'Saturday',
    themeTitle: 'Farewell Veneto Feast & Packing for London',
    city: 'Montebelluna',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Relaxed family gathering in Montebelluna, pack passports and UK travel cards for tomorrow morning’s flight.',
    weather: { temp: 22, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 5, rainChance: 10, windSpeed: '11 km/h', packingTip: 'Pack UK power plug adapters (Type G) and light jackets.' }
  },
  // Day 35: 20-Sep (Sun) - Montebelluna to London
  {
    dayIndex: 34,
    dayNumber: 35,
    date: '2026-09-20',
    dayOfWeek: 'Sunday',
    themeTitle: 'Flight to London & Park Avenue Bayswater Inn',
    city: 'Montebelluna to London',
    country: 'United Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'EasyJet EZY8294 VCE to LGW (09:40-10:55, Ref: KCRW4M7). Check into Park Avenue Bayswater Inn near Hyde Park.',
    weather: { temp: 19, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 4, rainChance: 20, windSpeed: '16 km/h', packingTip: 'Light autumn jacket, compact umbrella and Oyster / contactless cards.' }
  },
  // Day 36: 21-Sep (Mon) - London / Harry Potter
  {
    dayIndex: 35,
    dayNumber: 36,
    date: '2026-09-21',
    dayOfWeek: 'Monday',
    themeTitle: 'Harry Potter Studios Tour with Lisa & Gian (10:00 AM)',
    city: 'London (Leavesden)',
    country: 'United Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Meet at Victoria Station (Bulleid Way) at 10:00 AM. Magical Warner Bros Studio Tour with Lisa and Gian!',
    weather: { temp: 18, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 4, rainChance: 15, windSpeed: '14 km/h', packingTip: 'Hogwarts robes / Harry Potter merch and camera for Great Hall.' }
  },
  // Day 37: 22-Sep (Tues) - London
  {
    dayIndex: 36,
    dayNumber: 37,
    date: '2026-09-22',
    dayOfWeek: 'Tuesday',
    themeTitle: 'Tower of London, Tower Bridge & Buckingham Palace',
    city: 'London',
    country: 'United Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Crown Jewels at Tower of London, walk across iconic Tower Bridge, Borough Market food stalls, Hyde Park stroll.',
    weather: { temp: 19, condition: 'Clear Warm', icon: 'Sun', uvIndex: 4, rainChance: 10, windSpeed: '12 km/h', packingTip: 'Comfortable walking trainers for exploring Central London.' }
  },
  // Day 38: 23-Sep (Wed) - London
  {
    dayIndex: 37,
    dayNumber: 38,
    date: '2026-09-23',
    dayOfWeek: 'Wednesday',
    themeTitle: 'British Museum, Covent Garden & London Eye',
    city: 'London',
    country: 'United Kingdom',
    coverImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Rosetta Stone at British Museum, Covent Garden street performers, West End afternoon tea & London Eye sunset.',
    weather: { temp: 18, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 4, rainChance: 15, windSpeed: '15 km/h', packingTip: 'Camera for panoramic Thames views.' }
  },
  // Day 39: 24-Sep (Thurs) - London to Olbia (Sardinia)
  {
    dayIndex: 38,
    dayNumber: 39,
    date: '2026-09-24',
    dayOfWeek: 'Thursday',
    themeTitle: 'British Airways to Sardinia & Hotel Villa Margherita',
    city: 'London to Olbia (Sardinia)',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'BA 592 (07:55-11:25, Ref: XSD2LV). Transfer to Hotel Villa Margherita in Golfo Aranci. Emerald sea awaits!',
    weather: { temp: 26, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '12 km/h', packingTip: 'Snorkel mask and seaside linen clothes.' }
  },
  // Day 40: 25-Sep (Fri) - Olbia / Golfo Aranci
  {
    dayIndex: 39,
    dayNumber: 40,
    date: '2026-09-25',
    dayOfWeek: 'Friday',
    themeTitle: 'Sardinia Turquoise Waters: Spiaggia Bianca & Cala Moresca',
    city: 'Golfo Aranci & Olbia',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Pristine white sand beaches, crystalline turquoise swimming, and fresh seafood dinner in Golfo Aranci.',
    weather: { temp: 26, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Beach bag and reef-safe sunscreen.' }
  },
  // Day 41: 26-Sep (Sat) - Olbia / La Maddalena
  {
    dayIndex: 40,
    dayNumber: 41,
    date: '2026-09-26',
    dayOfWeek: 'Saturday',
    themeTitle: 'La Maddalena Archipelago Boat Tour',
    city: 'La Maddalena Archipelago',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Full-day boat charter across Isola Spargi, Budelli pink beach, and swimming in natural lagoons.',
    weather: { temp: 25, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '14 km/h', packingTip: 'Waterproof phone pouch and towel.' }
  },
  // Day 42: 27-Sep (Sun) - Olbia / Costa Smeralda
  {
    dayIndex: 41,
    dayNumber: 42,
    date: '2026-09-27',
    dayOfWeek: 'Sunday',
    themeTitle: 'Costa Smeralda & Sunset Aperitivo',
    city: 'Costa Smeralda',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Scenic drive to Porto Rotondo and Porto Cervo, sunset cocktails overlooking the marina.',
    weather: { temp: 25, condition: 'Sunny', icon: 'Sun', uvIndex: 6, rainChance: 0, windSpeed: '11 km/h', packingTip: 'Smart resort wear for evening aperitivo.' }
  },
  // Day 43: 28-Sep (Mon) - Olbia to Rome (Fiumicino)
  {
    dayIndex: 42,
    dayNumber: 43,
    date: '2026-09-28',
    dayOfWeek: 'Monday',
    themeTitle: 'Flight to Rome Fiumicino & Number 60 B&B',
    city: 'Olbia to Rome Fiumicino',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Aeroitalia XZ2612 (13:20-14:20, Ref: W9WBJW). Check into Number 60 B&B in Fiumicino near the coast.',
    weather: { temp: 24, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 5, rainChance: 5, windSpeed: '12 km/h', packingTip: 'Keep flight boarding passes organized.' }
  },
  // Day 44: 29-Sep (Tues) - Rome to Dubai
  {
    dayIndex: 43,
    dayNumber: 44,
    date: '2026-09-29',
    dayOfWeek: 'Tuesday',
    themeTitle: 'Emirates Flight Rome to Dubai (15:45 PM)',
    city: 'Rome to Dubai',
    country: 'Italy / UAE',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Emirates EK 0098 departs FCO at 15:45, lands Dubai at 23:30. Farewell Europe!',
    weather: { temp: 24, condition: 'Sunny', icon: 'Sun', uvIndex: 5, rainChance: 0, windSpeed: '10 km/h', packingTip: 'Passport, souvenir receipts for duty-free, travel clothes.' }
  },
  // Day 45: 30-Sep (Wed) - Dubai to Adelaide
  {
    dayIndex: 44,
    dayNumber: 45,
    date: '2026-09-30',
    dayOfWeek: 'Wednesday',
    themeTitle: 'Emirates Flight Dubai to Adelaide: Welcome Home!',
    city: 'Dubai to Adelaide',
    country: 'Australia',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summaryNotes: 'Emirates EK 0440 departs Dubai 02:05, lands Adelaide at 20:05. Journey complete with unforgettable memories!',
    weather: { temp: 18, condition: 'Partly Cloudy', icon: 'CloudSun', uvIndex: 5, rainChance: 10, windSpeed: '14 km/h', packingTip: 'Australian customs declaration and baggage tags.' }
  }
];
