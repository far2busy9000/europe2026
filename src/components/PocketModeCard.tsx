import React, { useState } from 'react';
import { 
  Navigation, ExternalLink, Copy, Check, Ticket, 
  MapPin, Sparkles, Clock, CheckCircle2, ChevronRight,
  Gift, Cake, Compass, PhoneCall, ArrowUpRight
} from 'lucide-react';
import { TripDay, ItineraryItem, TripData } from '../types';
import { TRIP_BIRTHDAYS } from '../data/tripLegs';
import { formatDayAndDateAU } from '../utils/date';

interface PocketModeCardProps {
  trip: TripData;
  selectedDayIndex: number;
  onToggleComplete: (itemId: string) => void;
  onOpenWallet: () => void;
  onOpenItemModal: (item: ItineraryItem) => void;
}

export const PocketModeCard: React.FC<PocketModeCardProps> = ({
  trip,
  selectedDayIndex,
  onToggleComplete,
  onOpenWallet,
  onOpenItemModal
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentDay = trip.days[selectedDayIndex] || trip.days[0];
  const dayItems = trip.items.filter(it => it.dayIndex === selectedDayIndex);

  // Find next uncompleted stop, or first stop
  const nextItem = dayItems.find(it => !it.completed) || dayItems[0];

  // Check for tickets on today
  const dayTickets = dayItems.flatMap(it => it.tickets || []);
  const standaloneTicketsForDay = (trip.allTickets || []).filter(t => t.validDate === currentDay.date);
  const allDayTickets = [...dayTickets, ...standaloneTicketsForDay];

  // Check if today is a birthday or near a birthday
  const birthdayToday = TRIP_BIRTHDAYS.find(b => b.dayNumber === currentDay.dayNumber);
  const upcomingBirthday = TRIP_BIRTHDAYS.find(
    b => b.dayNumber > currentDay.dayNumber && b.dayNumber <= currentDay.dayNumber + 3
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const openNavigation = (locationName: string, city: string) => {
    const query = encodeURIComponent(`${locationName}, ${city}`);
    // Check if iOS/Apple or Android/Web
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.open(`maps://?q=${query}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      {/* Special Birthday Banner */}
      {birthdayToday && (
        <div className="bg-gradient-to-r from-[#FF6B6B] via-[#FF8E53] to-[#FFE66D] rounded-2xl p-3.5 sm:p-4 text-white shadow-lg flex items-center justify-between gap-3 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{birthdayToday.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                  🎉 Special Celebration Today!
                </span>
                <span className="text-xs font-bold text-white/90">Day {birthdayToday.dayNumber}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-white mt-0.5">
                Happy {birthdayToday.age}th Birthday, {birthdayToday.name.split(' ')[0]}! 🎂
              </h3>
              <p className="text-xs text-white/95 font-medium line-clamp-1">
                {birthdayToday.theme}
              </p>
            </div>
          </div>
          <span className="text-2xl hidden sm:inline">🥳</span>
        </div>
      )}

      {/* Upcoming Birthday Countdown Preview */}
      {!birthdayToday && upcomingBirthday && (
        <div className="bg-[#FFE66D]/20 dark:bg-slate-800 border border-[#FFE66D] rounded-2xl px-3.5 py-2 flex items-center justify-between text-xs text-[#1A535C] dark:text-[#FFE66D]">
          <div className="flex items-center gap-2">
            <span>{upcomingBirthday.emoji}</span>
            <span className="font-bold">
              Birthday Countdown: <strong>{upcomingBirthday.name.split(' ')[0]}'s {upcomingBirthday.age}th Birthday</strong> is coming up on Day {upcomingBirthday.dayNumber} ({upcomingBirthday.location})!
            </span>
          </div>
        </div>
      )}

      {/* Pocket Mode / In-The-Moment Card */}
      <div className="bg-white/95 dark:bg-[#1A282F]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-[#4ECDC4]/50 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#4ECDC4]">
              Today at a Glance • Pocket Assistant
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-[#2D3436]/80 dark:text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-[#FFE66D]/40 dark:bg-slate-800 text-[#1A535C] dark:text-[#FFE66D] font-black">
              {formatDayAndDateAU(currentDay.dayOfWeek, currentDay.date, 'medium')}
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-500 dark:text-slate-400">Day {currentDay.dayNumber} ({currentDay.city})</span>
          </div>
        </div>

        {/* Content body */}
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          
          {/* Next Stop Highlight (Left) */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] border border-[#4ECDC4]/30">
                {nextItem ? (nextItem.completed ? 'Latest Stop' : 'Next Up') : 'No Stops Scheduled'}
              </span>
              {nextItem && (
                <span className="text-xs font-bold text-[#FF6B6B] dark:text-[#FFE66D] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {nextItem.time}
                </span>
              )}
            </div>

            {nextItem ? (
              <div>
                <h4 className="text-base sm:text-lg font-black font-display text-[#1A535C] dark:text-white leading-snug">
                  {nextItem.title}
                </h4>
                <p className="text-xs text-[#2D3436]/75 dark:text-slate-300 flex items-center gap-1.5 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B6B] flex-shrink-0" />
                  <span className="truncate">{nextItem.locationName}, {nextItem.destinationCity}</span>
                </p>
                {nextItem.mustTryTip && (
                  <p className="text-[11px] text-[#1A535C] dark:text-[#FFE66D] font-bold mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FFE66D]" /> {nextItem.mustTryTip}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Relaxation day with no fixed schedule.</p>
            )}
          </div>

          {/* Action Quick Buttons (Right) */}
          <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-2">
            {nextItem && (
              <button
                onClick={() => openNavigation(nextItem.locationName, nextItem.destinationCity || currentDay.city)}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#1A535C] to-[#2B6E7A] hover:from-[#144249] hover:to-[#225761] text-white text-xs font-black shadow-sm transition-all cursor-pointer"
                title="Open in Apple Maps or Google Maps"
              >
                <Navigation className="w-4 h-4 text-[#FFE66D]" />
                <span>1-Tap Map Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/70 ml-auto" />
              </button>
            )}

            {allDayTickets.length > 0 ? (
              <button
                onClick={onOpenWallet}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#FFE66D]/30 hover:bg-[#FFE66D]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A535C] dark:text-[#FFE66D] border border-[#FFE66D]/80 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#FF6B6B]" />
                  <span>Today's Passes ({allDayTickets.length})</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF6B6B] text-white">
                  View Pass
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenWallet}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-slate-400" />
                  <span>Trip Passes Wallet</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

        </div>

        {/* Quick Booking Code Strip (if available) */}
        {allDayTickets.length > 0 && allDayTickets[0].confirmationCode && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-[#FFF9F2] dark:bg-slate-900/60 p-2 rounded-xl text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] font-black uppercase text-[#FF6B6B] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#FF6B6B]/30 flex-shrink-0">
                {allDayTickets[0].type.toUpperCase()}
              </span>
              <span className="font-bold text-[#1A535C] dark:text-white truncate">
                {allDayTickets[0].title}
              </span>
              <span className="font-mono font-black text-[#FF6B6B] dark:text-[#FFE66D]">
                [{allDayTickets[0].confirmationCode}]
              </span>
            </div>

            <button
              onClick={() => handleCopyCode(allDayTickets[0].confirmationCode)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#1A535C] dark:text-slate-200 text-[11px] font-bold hover:bg-[#FFE66D]/20 cursor-pointer flex-shrink-0"
              title="Copy Confirmation / PNR Code"
            >
              {copiedCode === allDayTickets[0].confirmationCode ? (
                <>
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
