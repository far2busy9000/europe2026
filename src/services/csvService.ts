import { ItineraryItem, TripDay, CategoryType, ExpenseItem, TicketItem, TripData } from '../types';

export function parseCSV(csvText: string): Partial<TripData> {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV file appears to be empty or missing header row.');
  }

  // Helper to parse CSV line respecting quotes
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        if (inQuotes && line[i + 1] === char) {
          cur += char;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if ((char === ',' || char === ';') && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headerRow = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Column index detector
  const findCol = (keywords: string[]): number => {
    return headerRow.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const colDay = findCol(['day', 'daynumber']);
  const colDate = findCol(['date', 'daydate']);
  const colTime = findCol(['time', 'hour', 'start']);
  const colTitle = findCol(['title', 'activity', 'item', 'name', 'event']);
  const colCity = findCol(['city', 'destination', 'place']);
  const colLocation = findCol(['location', 'address', 'venue']);
  const colCategory = findCol(['category', 'type']);
  const colNotes = findCol(['notes', 'note', 'description', 'details']);
  const colExpense = findCol(['expense', 'cost', 'amount', 'price', 'eur']);
  const colPaidBy = findCol(['paidby', 'payer', 'who']);
  const colTicket = findCol(['ticket', 'confirmation', 'booking', 'code']);
  const colLat = findCol(['lat', 'latitude']);
  const colLng = findCol(['lng', 'lon', 'longitude']);

  const parsedItems: ItineraryItem[] = [];
  const daysMap = new Map<number, { date?: string; city?: string; title?: string }>();
  const parsedExpenses: ExpenseItem[] = [];
  const parsedTickets: TicketItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length === 0 || !cols.some(c => c.length > 0)) continue;

    const rawDay = colDay !== -1 ? cols[colDay] : '1';
    let dayNum = parseInt(rawDay.replace(/[^0-9]/g, ''), 10);
    if (isNaN(dayNum) || dayNum < 1) dayNum = 1;
    const dayIndex = dayNum - 1;

    const rawDate = colDate !== -1 ? cols[colDate] : `2026-08-0${Math.min(dayNum, 9)}`;
    const time = colTime !== -1 && cols[colTime] ? cols[colTime] : '10:00 AM';
    const title = colTitle !== -1 && cols[colTitle] ? cols[colTitle] : `Activity on Day ${dayNum}`;
    const destinationCity = colCity !== -1 && cols[colCity] ? cols[colCity] : 'Destination';
    const locationName = colLocation !== -1 && cols[colLocation] ? cols[colLocation] : destinationCity;
    const notes = colNotes !== -1 && cols[colNotes] ? cols[colNotes] : '';

    let category: CategoryType = 'sightseeing';
    if (colCategory !== -1 && cols[colCategory]) {
      const cat = cols[colCategory].toLowerCase();
      if (cat.includes('food') || cat.includes('eat') || cat.includes('rest') || cat.includes('dinner') || cat.includes('lunch')) category = 'food';
      else if (cat.includes('trans') || cat.includes('train') || cat.includes('flight') || cat.includes('car') || cat.includes('ferry')) category = 'transport';
      else if (cat.includes('hotel') || cat.includes('lodg') || cat.includes('stay') || cat.includes('airbnb')) category = 'lodging';
      else if (cat.includes('act') || cat.includes('tour') || cat.includes('swim') || cat.includes('hike')) category = 'activity';
      else if (cat.includes('shop')) category = 'shopping';
      else if (cat.includes('relax') || cat.includes('beach')) category = 'relaxation';
    }

    let lat = 41.9028; // default Rome
    let lng = 12.4964;
    if (colLat !== -1 && cols[colLat] && !isNaN(parseFloat(cols[colLat]))) lat = parseFloat(cols[colLat]);
    if (colLng !== -1 && cols[colLng] && !isNaN(parseFloat(cols[colLng]))) lng = parseFloat(cols[colLng]);

    // Check for expenses in this row
    const itemExpenses: ExpenseItem[] = [];
    if (colExpense !== -1 && cols[colExpense]) {
      const amount = parseFloat(cols[colExpense].replace(/[^0-9.]/g, ''));
      if (!isNaN(amount) && amount > 0) {
        const paidBy = colPaidBy !== -1 && cols[colPaidBy] ? cols[colPaidBy] : 'Anthony & Tai Fazzalari';
        const expense: ExpenseItem = {
          id: `csv-exp-${Date.now()}-${i}`,
          title: `${title} Expense`,
          amount,
          currency: 'AUD',
          paidBy,
          splitBetween: ['Anthony & Tai Fazzalari', 'Lia Nigro', 'Josie Nigro (Nonna)', 'James Fazzalari', 'Zoe Fazzalari', 'Daniel Fazzalari'],
          category: category === 'transport' || category === 'lodging' || category === 'food' ? category : 'other',
          date: rawDate || '2026-08-17',
          notes: notes
        };
        itemExpenses.push(expense);
        parsedExpenses.push(expense);
      }
    }

    // Check for tickets in this row
    const itemTickets: TicketItem[] = [];
    if (colTicket !== -1 && cols[colTicket] && cols[colTicket].trim().length > 0) {
      const ticket: TicketItem = {
        id: `csv-tkt-${Date.now()}-${i}`,
        title: `${title} Pass`,
        type: category === 'transport' ? 'train' : 'museum',
        confirmationCode: cols[colTicket].trim(),
        validDate: rawDate || '2026-08-01',
        validTime: time,
        holderNames: ['Family Pass (4x)']
      };
      itemTickets.push(ticket);
      parsedTickets.push(ticket);
    }

    const item: ItineraryItem = {
      id: `csv-it-${Date.now()}-${i}`,
      dayIndex,
      time,
      title,
      destinationCity,
      locationName,
      lat,
      lng,
      category,
      notes,
      completed: false,
      expenses: itemExpenses,
      tickets: itemTickets,
      photos: []
    };

    parsedItems.push(item);

    if (!daysMap.has(dayIndex)) {
      daysMap.set(dayIndex, {
        date: rawDate,
        city: destinationCity,
        title: `${destinationCity} Exploration`
      });
    }
  }

  // Construct TripDay list
  const maxDay = Math.max(...Array.from(daysMap.keys()), 0);
  const parsedDays: TripDay[] = [];

  for (let d = 0; d <= maxDay; d++) {
    const dayInfo = daysMap.get(d) || {};
    const dayNumber = d + 1;
    const dateStr = dayInfo.date || `2026-08-${String(dayNumber).padStart(2, '0')}`;
    
    // Calculate Day of Week
    let dayOfWeek = 'Day ' + dayNumber;
    try {
      const dateObj = new Date(dateStr);
      if (!isNaN(dateObj.getTime())) {
        dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      }
    } catch {
      // fallback
    }

    parsedDays.push({
      dayIndex: d,
      dayNumber,
      date: dateStr,
      dayOfWeek,
      themeTitle: dayInfo.title || `Day ${dayNumber} - ${dayInfo.city || 'Destinations'}`,
      city: dayInfo.city || 'European City',
      country: 'Europe',
      weather: {
        temp: 29 + (d % 4),
        condition: 'Sunny',
        icon: 'Sun',
        uvIndex: 8,
        rainChance: 5,
        windSpeed: '12 km/h',
        packingTip: 'Light cotton/linen summer clothing, sunhat & sunglasses.'
      }
    });
  }

  return {
    days: parsedDays,
    items: parsedItems,
    allExpenses: parsedExpenses,
    allTickets: parsedTickets
  };
}

export function generateCSVTemplate(): string {
  return `Day,Date,Time,Destination,Activity,Location,Category,Notes,Expense,PaidBy,TicketCode,Lat,Lng
1,2026-08-17,09:50 PM,Dubai,Emirates Flight EK 0441,Adelaide Airport ADL,Transport,Flight departs ADL at 21:50. Arrives Dubai 05:30 (+1),,Anthony & Tai Fazzalari,FEQ2ND,-34.9462,138.5332
2,2026-08-18,07:40 AM,Naples,Emirates Flight EK 2391,Dubai DXB to Naples NAP,Transport,Connect to Naples flight. Check-in Starhotels Terminus,,Anthony & Tai Fazzalari,EK2391-NAP,40.8518,14.2681
21,2026-09-06,07:45 PM,Rome,Twilight Rome Golf Cart Tour,Piazza del Popolo,Tour,GetYourGuide booked evening tour across historic Rome,,Anthony & Tai Fazzalari,GYG-ROM-GC789,41.9107,12.4764
25,2026-09-10,10:40 AM,Florence,Italo Train 9924 Roma to Firenze,Roma Termini to Firenze SMN,Transport,High-speed rail 1hr 37min into Florence,224,Anthony & Tai Fazzalari,K9BG5Y,43.7765,11.2479
36,2026-09-21,10:00 AM,London,Harry Potter Warner Bros Studios Tour,Leaves Victoria Station,Tour,Full day Warner Bros Studio tour with coach,925.06,Anthony & Tai Fazzalari,GYG-HP-VIC1000,51.6904,-0.4182
39,2026-09-24,07:55 AM,Sardinia,British Airways Flight BA 592,Heathrow LHR to Olbia OLB,Transport,Flight to Sardinia and check-in Hotel Villa Margherita,1600,Anthony & Tai Fazzalari,XSD2LV,40.9167,9.5167`;
}

export function exportTripToCSV(trip: TripData): string {
  const headers = ['Day', 'Date', 'Time', 'Destination', 'Activity', 'Location', 'Category', 'Notes', 'Expense', 'PaidBy', 'TicketCode', 'Lat', 'Lng'];
  const rows: string[] = [headers.join(',')];

  trip.items.forEach(item => {
    const day = trip.days.find(d => d.dayIndex === item.dayIndex);
    const date = day?.date || '';
    const expense = item.expenses?.[0]?.amount?.toString() || '';
    const paidBy = item.expenses?.[0]?.paidBy || '';
    const ticketCode = item.tickets?.[0]?.confirmationCode || '';

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    rows.push([
      (item.dayIndex + 1).toString(),
      escapeCsv(date),
      escapeCsv(item.time),
      escapeCsv(item.destinationCity),
      escapeCsv(item.title),
      escapeCsv(item.locationName),
      escapeCsv(item.category),
      escapeCsv(item.notes),
      escapeCsv(expense),
      escapeCsv(paidBy),
      escapeCsv(ticketCode),
      item.lat?.toString() || '',
      item.lng?.toString() || ''
    ].join(','));
  });

  return rows.join('\n');
}
