/**
 * Australian Date Formatting Utilities (Day, Month, Year)
 */

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Parses YYYY-MM-DD or standard date string safely into day, month, year
 */
export function parseDateParts(dateStr: string): { day: number; month: number; year: number } | null {
  if (!dateStr) return null;
  
  // Check if YYYY-MM-DD
  const ymdMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    return {
      year: parseInt(ymdMatch[1], 10),
      month: parseInt(ymdMatch[2], 10) - 1, // 0-indexed
      day: parseInt(ymdMatch[3], 10),
    };
  }

  // Check if DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    return {
      day: parseInt(dmyMatch[1], 10),
      month: parseInt(dmyMatch[2], 10) - 1,
      year: parseInt(dmyMatch[3], 10),
    };
  }

  // Fallback to JS Date
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return {
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
    };
  }

  return null;
}

/**
 * Standard Australian Date: e.g. "17 Aug 2026" or "17/08/2026"
 */
export function formatDateAU(dateStr: string, format: 'short' | 'medium' | 'long' | 'numeric' = 'medium'): string {
  const parts = parseDateParts(dateStr);
  if (!parts) return dateStr;

  const { day, month, year } = parts;
  const dayPadded = String(day).padStart(2, '0');
  const monthPadded = String(month + 1).padStart(2, '0');
  const monthShort = MONTHS_SHORT[month] || '';
  const monthFull = MONTHS_FULL[month] || '';

  switch (format) {
    case 'numeric':
      return `${dayPadded}/${monthPadded}/${year}`; // 17/08/2026
    case 'short':
      return `${day} ${monthShort}`; // 17 Aug
    case 'long':
      return `${day} ${monthFull} ${year}`; // 17 August 2026
    case 'medium':
    default:
      return `${day} ${monthShort} ${year}`; // 17 Aug 2026
  }
}

/**
 * Australian Date with Day of Week: e.g. "Monday, 17 Aug 2026" or "Mon, 17 Aug"
 */
export function formatDayAndDateAU(dayOfWeek: string, dateStr: string, format: 'short' | 'medium' | 'full' = 'full'): string {
  const parts = parseDateParts(dateStr);
  if (!parts) return `${dayOfWeek}, ${dateStr}`;

  const { day, month, year } = parts;
  const monthShort = MONTHS_SHORT[month] || '';
  const monthFull = MONTHS_FULL[month] || '';

  if (format === 'short') {
    const dowShort = dayOfWeek.slice(0, 3);
    return `${dowShort}, ${day} ${monthShort}`; // Mon, 17 Aug
  }

  if (format === 'medium') {
    return `${dayOfWeek}, ${day} ${monthShort} ${year}`; // Monday, 17 Aug 2026
  }

  return `${dayOfWeek}, ${day} ${monthFull} ${year}`; // Monday, 17 August 2026
}

/**
 * Australian Date Range: e.g. "17 Aug – 30 Sep 2026"
 */
export function formatDateRangeAU(startDateStr: string, endDateStr: string): string {
  const start = parseDateParts(startDateStr);
  const end = parseDateParts(endDateStr);

  if (!start || !end) return `${startDateStr} – ${endDateStr}`;

  const startMonth = MONTHS_SHORT[start.month];
  const endMonth = MONTHS_SHORT[end.month];

  if (start.year === end.year) {
    if (start.month === end.month) {
      return `${start.day} – ${end.day} ${endMonth} ${end.year}`;
    }
    return `${start.day} ${startMonth} – ${end.day} ${endMonth} ${end.year}`;
  }

  return `${start.day} ${startMonth} ${start.year} – ${end.day} ${endMonth} ${end.year}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the appropriate Trip Day index (0-based) for a given date.
 * - If the date falls within the 45 trip days, returns that day's exact index (e.g. 2026-08-30 -> 13 / Day 14).
 * - If the trip is exhausted (date > last trip day), returns 0 (Day 1) as requested.
 * - If before the trip starts, returns 0 (Day 1).
 */
export function getTripDayIndexForDate(days: { date: string; dayIndex: number }[], targetDateStr?: string): number {
  if (!days || days.length === 0) return 0;
  
  const todayStr = targetDateStr || getTodayDateString();
  
  // 1. Exact match within trip days
  const exactIndex = days.findIndex(d => d.date === todayStr);
  if (exactIndex !== -1) {
    return exactIndex;
  }

  const firstDay = days[0].date;
  const lastDay = days[days.length - 1].date;

  // 2. If before trip starts -> Day 1 (index 0)
  if (todayStr < firstDay) {
    return 0;
  }

  // 3. If after trip ends -> Reset to Day 1 (index 0) as requested
  if (todayStr > lastDay) {
    return 0;
  }

  // 4. Default safe fallback
  return 0;
}

/**
 * Checks if the current date is actively within the trip range
 */
export function isCurrentlyDuringTrip(days: { date: string }[], targetDateStr?: string): boolean {
  if (!days || days.length === 0) return false;
  const todayStr = targetDateStr || getTodayDateString();
  return days.some(d => d.date === todayStr);
}
