import { TripData, ItineraryItem } from '../types';

function formatICSDate(dateStr: string, timeStr: string, addHours = 2): { start: string; end: string } {
  // Try to parse YYYY-MM-DD
  const dateParts = dateStr.split('-');
  const year = parseInt(dateParts[0] || '2026', 10);
  const month = parseInt(dateParts[1] || '8', 10) - 1;
  const day = parseInt(dateParts[2] || '1', 10);

  // Parse time (e.g. "09:30 AM" or "14:00" or "09:30")
  let hours = 9;
  let minutes = 0;

  if (timeStr) {
    const isPM = /pm/i.test(timeStr);
    const isAM = /am/i.test(timeStr);
    const cleanTime = timeStr.replace(/[^0-9:]/g, '');
    const [hStr, mStr] = cleanTime.split(':');
    let parsedH = parseInt(hStr || '9', 10);
    if (isPM && parsedH < 12) parsedH += 12;
    if (isAM && parsedH === 12) parsedH = 0;
    hours = parsedH;
    minutes = parseInt(mStr || '0', 10);
  }

  const startDate = new Date(Date.UTC(year, month, day, hours, minutes));
  const endDate = new Date(startDate.getTime() + addHours * 60 * 60 * 1000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const toICSString = (d: Date) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };

  return {
    start: toICSString(startDate),
    end: toICSString(endDate)
  };
}

export function generateICS(trip: TripData, filterDayIndex?: number): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const nowICS = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;

  const itemsToExport = filterDayIndex !== undefined
    ? trip.items.filter(it => it.dayIndex === filterDayIndex)
    : trip.items;

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EuroSummer Family Trip Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${trip.title}`,
    `X-WR-TIMEZONE:Europe/Rome`,
  ];

  itemsToExport.forEach((item: ItineraryItem) => {
    const day = trip.days.find(d => d.dayIndex === item.dayIndex);
    const dateStr = day?.date || '2026-08-01';
    const { start, end } = formatICSDate(dateStr, item.time, 2);

    let desc = `${item.notes || ''}`;
    if (item.mustTryTip) {
      desc += `\\n\\n💡 Tip: ${item.mustTryTip}`;
    }
    if (item.tickets && item.tickets.length > 0) {
      desc += `\\n\\n🎟️ Confirmation: ${item.tickets.map(t => `${t.title} [Code: ${t.confirmationCode}]`).join(', ')}`;
    }
    if (item.expenses && item.expenses.length > 0) {
      desc += `\\n\\n💶 Expense: €${item.expenses.reduce((sum, e) => sum + e.amount, 0)} (${item.expenses[0].paidBy})`;
    }

    const cleanDesc = desc.replace(/\n/g, '\\n').replace(/,/g, '\\,');
    const cleanSummary = `[Day ${item.dayIndex + 1}] ${item.title}`.replace(/,/g, '\\,');
    const cleanLocation = `${item.locationName}, ${item.destinationCity}`.replace(/,/g, '\\,');

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${item.id}-${item.dayIndex}@eurosummer.family`,
      `DTSTAMP:${nowICS}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${cleanSummary}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLocation}`,
      item.lat && item.lng ? `GEO:${item.lat};${item.lng}` : '',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${cleanSummary}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  // Filter out any empty lines
  icsContent = icsContent.filter(line => line.length > 0);
  icsContent.push('END:VCALENDAR');

  return icsContent.join('\r\n');
}

export function downloadICSFile(trip: TripData, filterDayIndex?: number) {
  const icsData = generateICS(trip, filterDayIndex);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const filename = filterDayIndex !== undefined
    ? `${trip.title.replace(/\s+/g, '_')}_Day_${filterDayIndex + 1}.ics`
    : `${trip.title.replace(/\s+/g, '_')}_Full_Trip.ics`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
