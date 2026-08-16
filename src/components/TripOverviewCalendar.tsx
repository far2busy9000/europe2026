import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, MapPin, Sun, CheckCircle2, 
  Euro, Ticket, ArrowRight, Download, Sparkles, Navigation, Edit3,
  Filter, Layers, Cake
} from 'lucide-react';
import { TripData, TripDay } from '../types';
import { downloadICSFile } from '../services/icsExport';
import { TRIP_LEGS, TRIP_BIRTHDAYS } from '../data/tripLegs';
import { CurrencyMode, formatCurrencyAmount, getExpenseAmountInCurrency } from '../utils/currency';
import { formatDateRangeAU, formatDayAndDateAU } from '../utils/date';

interface TripOverviewCalendarProps {
  trip: TripData;
  currencyMode: CurrencyMode;
  onSelectDay: (index: number) => void;
  onOpenMap: () => void;
  onEditDay?: (dayIndex: number) => void;
}

export const TripOverviewCalendar: React.FC<TripOverviewCalendarProps> = ({
  trip,
  currencyMode,
  onSelectDay,
  onOpenMap,
  onEditDay
}) => {
  const [selectedLegFilter, setSelectedLegFilter] = useState<string>('all');

  // Aggregate stats
  const totalStops = trip.items.length;
  const completedStops = trip.items.filter(it => it.completed).length;
  const totalExpensesInCurrency = trip.items.reduce((sum, it) => {
    return sum + (it.expenses?.reduce((eSum, e) => eSum + getExpenseAmountInCurrency(e, currencyMode), 0) || 0);
  }, 0);
  const totalTickets = trip.items.reduce((sum, it) => sum + (it.tickets?.length || 0), 0);
  const progressPercent = totalStops > 0 ? Math.round((completedStops / totalStops) * 100) : 0;

  // Filter days by leg if selected
  const activeLeg = TRIP_LEGS.find(l => l.id === selectedLegFilter);
  const displayedDays = activeLeg 
    ? trip.days.filter(d => d.dayNumber >= activeLeg.startDayNumber && d.dayNumber <= activeLeg.endDayNumber)
    : trip.days;

  return (
    <div className="space-y-6">
      
      {/* 1. Overview Header & Summary Dashboard */}
      <div className="bg-gradient-to-br from-[#1A535C] via-[#224A52] to-[#2D3436] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-[#4ECDC4]/30">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-[#FF6B6B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#FFE66D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-[#FFE66D] text-[#1A535C] text-xs font-black uppercase tracking-wider shadow-sm">
                {trip.days.length}-Day Grand European Journey Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display mt-2.5 tracking-tight text-white">
                {trip.subtitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadICSFile(trip)}
                className="px-3.5 py-2 rounded-xl bg-white text-[#1A535C] hover:bg-[#FFE66D]/30 text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FF6B6B]" />
                <span className="hidden sm:inline">Export Calendar (.ics)</span>
                <span className="sm:hidden">Export .ics</span>
              </button>
              <button
                onClick={onOpenMap}
                className="px-3.5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-extrabold shadow-sm shadow-[#FF6B6B]/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Interactive Map</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/15">
            <div className="bg-black/35 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] text-[#FFE66D] uppercase font-black block">Total Duration</span>
              <span className="text-xl font-black text-white">{trip.days.length} Days</span>
              <span className="text-[10px] text-white/80 block mt-0.5">{formatDateRangeAU(trip.startDate, trip.endDate)}</span>
            </div>

            <div className="bg-black/35 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] text-[#FFE66D] uppercase font-black block">Waypoints Visited</span>
              <span className="text-xl font-black text-[#4ECDC4]">{completedStops} / {totalStops}</span>
              <span className="text-[10px] text-white/80 block mt-0.5">{progressPercent}% completed</span>
            </div>

            <div className="bg-black/35 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] text-[#FFE66D] uppercase font-black block">Expenses Logged</span>
              <span className="text-xl font-black text-white">{formatCurrencyAmount(totalExpensesInCurrency, currencyMode, 0)}</span>
              <span className="text-[10px] text-white/80 block mt-0.5">Tracked in {currencyMode}</span>
            </div>

            <div className="bg-black/35 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
              <span className="text-[11px] text-[#FFE66D] uppercase font-black block">Confirmed Tickets</span>
              <span className="text-xl font-black text-[#4ECDC4]">{totalTickets} Passes</span>
              <span className="text-[10px] text-white/80 block mt-0.5">Flights, trains & museum</span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-200 font-bold">
              <span>Trip Waypoints Milestone Progress</span>
              <span className="text-[#FFE66D]">{completedStops} of {totalStops} stops ({progressPercent}%)</span>
            </div>
            <div className="h-3 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#FFE66D] rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Trip Leg Filter Bar */}
      <div className="bg-white/95 dark:bg-[#1A282F]/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#FFE66D]/70 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D]">
            <Layers className="w-4 h-4 text-[#FF6B6B]" />
            <span>Filter By Trip Leg ({displayedDays.length} Days)</span>
          </div>
          {selectedLegFilter !== 'all' && (
            <button
              onClick={() => setSelectedLegFilter('all')}
              className="text-xs font-bold text-[#FF6B6B] hover:underline cursor-pointer"
            >
              Show All 45 Days
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedLegFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
              selectedLegFilter === 'all'
                ? 'bg-[#1A535C] text-[#FFE66D] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🌍 All 45 Days
          </button>

          {TRIP_LEGS.map(leg => {
            const isSelected = selectedLegFilter === leg.id;
            return (
              <button
                key={leg.id}
                onClick={() => setSelectedLegFilter(leg.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF6B6B] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-[#1A535C] dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{leg.emoji}</span>
                <span>{leg.shortTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {leg.startDayNumber}–{leg.endDayNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Grid of Days */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-black font-display text-[#1A535C] dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#FF6B6B]" />
            <span>
              {activeLeg ? `${activeLeg.title} (Days ${activeLeg.startDayNumber}–${activeLeg.endDayNumber})` : 'Complete Day-by-Day Travel Schedule'}
            </span>
          </h3>
          <span className="text-xs text-[#2D3436]/60 dark:text-slate-400 font-medium hidden sm:inline">
            Click any card to jump to day
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {displayedDays.map((day: TripDay) => {
            const dayItems = trip.items.filter(it => it.dayIndex === day.dayIndex);
            const dayCostConverted = dayItems.reduce((sum, it) => {
              return sum + (it.expenses?.reduce((eSum, e) => eSum + getExpenseAmountInCurrency(e, currencyMode), 0) || 0);
            }, 0);
            const dayTickets = dayItems.reduce((sum, it) => sum + (it.tickets?.length || 0), 0);
            const isAllCompleted = dayItems.length > 0 && dayItems.every(it => it.completed);
            const birthday = TRIP_BIRTHDAYS.find(b => b.dayNumber === day.dayNumber);

            return (
              <div
                key={day.dayIndex}
                onClick={() => onSelectDay(day.dayIndex)}
                className="group relative bg-white dark:bg-[#1A282F] rounded-2xl p-4 sm:p-5 border border-[#FFE66D]/70 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#FF6B6B] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Day # & Date & Weather */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#FFE66D] dark:bg-[#FFE66D]/20 text-[#1A535C] dark:text-[#FFE66D] font-black text-xs">
                        DAY {day.dayNumber}
                      </span>
                      <span className="text-xs font-bold text-[#1A535C] dark:text-slate-200">
                        {formatDayAndDateAU(day.dayOfWeek, day.date, 'medium')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {birthday && (
                        <span className="flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                          🎂 {birthday.name.split(' ')[0]} ({birthday.age})
                        </span>
                      )}
                      {onEditDay && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditDay(day.dayIndex);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-[#FF6B6B] hover:bg-[#FFE66D]/30 transition-all cursor-pointer"
                          title={`Edit Day ${day.dayNumber} info`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="flex items-center gap-1 text-xs font-black text-[#1A535C] dark:text-slate-200 bg-[#FFE66D]/20 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-[#FFE66D]/40">
                        <Sun className="w-3.5 h-3.5 text-[#FF8E53]" />
                        <span>{day.weather.temp}°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & City */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-[#FF6B6B] dark:text-[#FF8E53] font-black uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{day.city}, {day.country}</span>
                      </div>
                    </div>
                    <h4 className="text-base font-black font-display text-[#1A535C] dark:text-white mt-1 group-hover:text-[#FF6B6B] transition-colors">
                      {day.themeTitle}
                    </h4>
                  </div>

                  {/* Mini itinerary preview items */}
                  <div className="mt-3 space-y-1.5">
                    {dayItems.slice(0, 3).map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between text-xs text-[#2D3436] dark:text-slate-300 bg-[#FFF9F2] dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-[#FFE66D]/30 dark:border-slate-700/50"
                      >
                        <span className="font-mono text-[11px] text-[#FF6B6B] font-bold">{item.time}</span>
                        <span className={`truncate flex-1 mx-2 font-medium ${item.completed ? 'line-through text-slate-400' : 'text-[#1A535C] dark:text-slate-200'}`}>
                          {item.title}
                        </span>
                        {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#4ECDC4] flex-shrink-0" />}
                      </div>
                    ))}

                    {dayItems.length > 3 && (
                      <div className="text-[11px] text-[#2D3436]/60 dark:text-slate-400 pl-2 font-semibold">
                        +{dayItems.length - 3} more activities...
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Metrics & Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-black text-[#1A535C] dark:text-[#4ECDC4]">
                      <Euro className="w-3.5 h-3.5 text-[#4ECDC4]" /> {formatCurrencyAmount(dayCostConverted, currencyMode, 0)}
                    </span>
                    {dayTickets > 0 && (
                      <span className="flex items-center gap-1 text-[#FF6B6B] dark:text-[#FFA8A8] font-bold">
                        <Ticket className="w-3.5 h-3.5 text-[#FF6B6B]" /> {dayTickets} {dayTickets === 1 ? 'ticket' : 'tickets'}
                      </span>
                    )}
                  </div>

                  <span className="font-extrabold text-[#FF6B6B] dark:text-[#FFE66D] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Day {day.dayNumber}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
