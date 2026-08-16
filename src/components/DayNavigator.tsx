import React, { useRef, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Sun, CloudSun, CloudRain, 
  Wind, Sparkles, MapPin, Compass, ThermometerSun, Umbrella, Edit3,
  Cake, Gift, Eye
} from 'lucide-react';
import { TripDay, TripData } from '../types';
import { TRIP_BIRTHDAYS } from '../data/tripLegs';
import { CurrencyMode, formatCurrencyAmount, getExpenseAmountInCurrency } from '../utils/currency';
import { formatDateAU, formatDayAndDateAU } from '../utils/date';

interface DayNavigatorProps {
  trip: TripData;
  selectedDayIndex: number;
  currencyMode: CurrencyMode;
  onSelectDay: (index: number) => void;
  onEditDay?: () => void;
}

export const DayNavigator: React.FC<DayNavigatorProps> = ({
  trip,
  selectedDayIndex,
  currencyMode,
  onSelectDay,
  onEditDay
}) => {
  const currentDay = trip.days[selectedDayIndex] || trip.days[0];
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 60 && selectedDayIndex < trip.days.length - 1) {
      onSelectDay(selectedDayIndex + 1);
    }
    if (diff < -60 && selectedDayIndex > 0) {
      onSelectDay(selectedDayIndex - 1);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' && selectedDayIndex < trip.days.length - 1) {
        onSelectDay(selectedDayIndex + 1);
      } else if (e.key === 'ArrowLeft' && selectedDayIndex > 0) {
        onSelectDay(selectedDayIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDayIndex, trip.days.length, onSelectDay]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Rainy':
      case 'Thunderstorm':
        return <CloudRain className="w-5 h-5 text-[#4ECDC4]" />;
      case 'Partly Cloudy':
        return <CloudSun className="w-5 h-5 text-[#FFE66D]" />;
      case 'Breezy':
        return <Wind className="w-5 h-5 text-[#4ECDC4]" />;
      default:
        return <Sun className="w-5 h-5 text-[#FFE66D] animate-spin-slow" />;
    }
  };

  // Compute daily stats
  const dayItems = trip.items.filter(it => it.dayIndex === selectedDayIndex);
  const dayExpenses = dayItems.flatMap(it => it.expenses || []);
  const dayExpensesTotal = dayExpenses.reduce((sum, exp) => sum + getExpenseAmountInCurrency(exp, currencyMode), 0);
  const completedCount = dayItems.filter(it => it.completed).length;

  return (
    <div 
      className="space-y-3.5 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Horizontal Day Carousel Selector */}
      <div className="bg-white/95 dark:bg-[#1A282F]/95 backdrop-blur-md rounded-2xl p-3 border border-[#FFE66D]/60 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF6B6B] dark:text-[#FFE66D]">
              Day Selector
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => selectedDayIndex > 0 && onSelectDay(selectedDayIndex - 1)}
              disabled={selectedDayIndex === 0}
              className={`p-1.5 rounded-xl border text-xs transition-all ${
                selectedDayIndex === 0
                  ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'border-[#FFE66D] dark:border-slate-700 text-[#1A535C] dark:text-slate-200 hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => selectedDayIndex < trip.days.length - 1 && onSelectDay(selectedDayIndex + 1)}
              disabled={selectedDayIndex === trip.days.length - 1}
              className={`p-1.5 rounded-xl border text-xs transition-all ${
                selectedDayIndex === trip.days.length - 1
                  ? 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'border-[#FFE66D] dark:border-slate-700 text-[#1A535C] dark:text-slate-200 hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable date cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          {trip.days.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            const itemsInDay = trip.items.filter(it => it.dayIndex === idx);
            const isCompleted = itemsInDay.length > 0 && itemsInDay.every(it => it.completed);
            const isBirthday = TRIP_BIRTHDAYS.some(b => b.dayNumber === day.dayNumber);

            return (
              <button
                key={day.dayIndex}
                onClick={() => onSelectDay(idx)}
                className={`flex-shrink-0 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white shadow-md shadow-[#FF6B6B]/30 scale-[1.02]'
                    : 'bg-[#FFF9F2] hover:bg-[#FFE66D]/30 dark:bg-slate-800/90 dark:hover:bg-slate-800 text-[#2D3436] dark:text-slate-200 border border-[#FFE66D]/60 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-[#FFE66D]' : 'text-[#FF6B6B] dark:text-[#FFE66D]'}`}>
                    Day {day.dayNumber}
                  </span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-[#1A535C] dark:text-slate-300'}`}>
                    {day.weather.temp}°C
                  </span>
                </div>
                <div className={`text-xs font-black mt-1 truncate max-w-[115px] ${isSelected ? 'text-white' : 'text-[#1A535C] dark:text-white'}`}>
                  {day.city}
                </div>
                <div className={`text-[10px] mt-0.5 font-medium truncate ${isSelected ? 'text-white/90' : 'text-[#2D3436]/70 dark:text-slate-400'}`}>
                  {formatDayAndDateAU(day.dayOfWeek, day.date, 'short')}
                </div>

                {isBirthday && (
                  <span className="absolute -bottom-1 -right-1 text-xs bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-xs" title="Special Birthday Celebration!">
                    🎂
                  </span>
                )}

                {isCompleted && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#4ECDC4] text-[#1A535C] font-black flex items-center justify-center text-[10px] shadow-xs ring-2 ring-white dark:ring-slate-900">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Day Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A535C] via-[#204950] to-[#2D3436] text-white shadow-xl border border-[#4ECDC4]/30">
        {currentDay.coverImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url(${currentDay.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative p-5 sm:p-7 z-10 space-y-3.5">
          {/* Header Row: Date & Day of Week prominent on mobile and desktop */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FFE66D] text-[#1A535C] text-xs font-black uppercase tracking-wide shadow-sm">
                Day {currentDay.dayNumber} of {trip.days.length}
              </span>
              
              {/* Prominent Day of the Week and Actual Date Badge (Always visible on mobile & desktop in Australian DD MMM YYYY format) */}
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <span>🗓️</span>
                <strong className="text-[#FFE66D] font-black">{currentDay.dayOfWeek}</strong>
                <span>•</span>
                <span>{formatDateAU(currentDay.date, 'medium')}</span>
              </span>

              <span className="flex items-center gap-1.5 text-xs font-bold text-[#4ECDC4] bg-black/30 px-2.5 py-1 rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" />
                {currentDay.city}, {currentDay.country}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {onEditDay && (
                <button
                  onClick={onEditDay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-black transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                  title="Edit day title, summary, city, and advice"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FFE66D]" />
                  <span>Edit Day {currentDay.dayNumber}</span>
                </button>
              )}
            </div>
          </div>

          <div className="group cursor-pointer" onClick={onEditDay}>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-white leading-snug">
                {currentDay.themeTitle}
              </h2>
              {onEditDay && (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/20 px-2 py-0.5 rounded-md text-[#FFE66D] font-bold">
                  Click to edit
                </span>
              )}
            </div>
            {currentDay.summaryNotes && (
              <p className="text-xs sm:text-sm text-slate-200/95 mt-1.5 max-w-3xl leading-relaxed font-normal">
                {currentDay.summaryNotes}
              </p>
            )}
          </div>

          {/* Weather Widget & Day Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-white/15">
            {/* Live Weather Forecast */}
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#FFE66D]/20 flex items-center justify-center flex-shrink-0">
                {getWeatherIcon(currentDay.weather.condition)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white">{currentDay.weather.temp}°C</span>
                  <span className="text-[11px] text-[#FFE66D] font-bold">({currentDay.weather.condition})</span>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1 font-medium">
                  <Umbrella className="w-3 h-3 text-[#4ECDC4]" /> Rain: {currentDay.weather.rainChance}% • UV: {currentDay.weather.uvIndex}
                </div>
              </div>
            </div>

            {/* Packing & Day Advice */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 sm:col-span-2">
              <span className="text-[10px] uppercase font-black text-[#FFE66D] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B6B]" /> Family Day Advice:
              </span>
              <p className="text-xs text-slate-100 mt-0.5 line-clamp-2 font-medium">
                {currentDay.weather.packingTip}
              </p>
            </div>

            {/* Daily Spend & Waypoints */}
            <div className="flex items-center justify-between sm:justify-end gap-3 bg-black/40 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-300 block">Today's Spend</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[#4ECDC4]">
                    {formatCurrencyAmount(dayExpensesTotal, currencyMode, 0)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black text-slate-300 block">Waypoints</span>
                <span className="text-xs font-bold text-white">
                  {completedCount}/{dayItems.length} Done
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
