import React, { useState } from 'react';
import { 
  Clock, MapPin, CheckCircle, Circle, Ticket, Euro, 
  Camera, Plus, Edit3, Trash2, ExternalLink, Lightbulb, 
  Navigation, Share2, Copy, Check, QrCode, Tag, Users,
  Map as MapIcon, List, Image as ImageIcon, Filter, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ItineraryItem, TripData, CategoryType, WaypointPhoto, ExpenseItem } from '../types';
import { PocketModeCard } from './PocketModeCard';
import { InteractiveMap } from './InteractiveMap';
import { CurrencyMode, formatCurrencyAmount, getExpenseAmountInCurrency, EUR_TO_AUD_RATE, AUD_TO_EUR_RATE } from '../utils/currency';
import { PolaroidLightboxModal } from './PolaroidLightboxModal';

interface DayTimelineViewProps {
  trip: TripData;
  selectedDayIndex: number;
  currencyMode: CurrencyMode;
  onToggleComplete: (itemId: string) => void;
  onEditItem: (item: ItineraryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItem: () => void;
  onAddPhotoToItem: (itemId: string) => void;
  onAddExpenseToItem: (itemId: string) => void;
  onEditExpense?: (expense: ExpenseItem, itemId?: string) => void;
  onOpenWallet: () => void;
  onEditDay?: () => void;
  onSelectDay?: (index: number) => void;
  onAddPhotoDirect?: (photo: WaypointPhoto) => void;
}

export const DayTimelineView: React.FC<DayTimelineViewProps> = ({
  trip,
  selectedDayIndex,
  currencyMode,
  onToggleComplete,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onAddPhotoToItem,
  onAddExpenseToItem,
  onEditExpense,
  onOpenWallet,
  onEditDay,
  onSelectDay,
  onAddPhotoDirect
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [daySubView, setDaySubView] = useState<'timeline' | 'map' | 'photos'>('timeline');
  const [selectedViewingPhoto, setSelectedViewingPhoto] = useState<WaypointPhoto | null>(null);

  const currentDay = trip.days[selectedDayIndex] || trip.days[0];
  const allDayItems = trip.items.filter(it => it.dayIndex === selectedDayIndex);

  // Filter items if specific member selected
  const items = allDayItems.filter(it => {
    if (selectedMemberFilter === 'all') return true;
    
    // Check assigned members
    if (it.assignedMembers && it.assignedMembers.includes(selectedMemberFilter)) return true;
    
    // Check text references
    const text = `${it.title} ${it.notes} ${it.mustTryTip || ''}`.toLowerCase();
    const query = selectedMemberFilter.toLowerCase();
    return text.includes(query);
  });

  // Photos for this day
  const dayPhotos = allDayItems.flatMap(it => it.photos || []);

  const handleComplete = (item: ItineraryItem) => {
    onToggleComplete(item.id);
    if (!item.completed) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#1A535C']
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const openNavigation = (locationName: string, city: string) => {
    const query = encodeURIComponent(`${locationName}, ${city}`);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      window.open(`maps://?q=${query}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const getCategoryStyles = (category: CategoryType) => {
    switch (category) {
      case 'food':
        return {
          bg: 'bg-[#FF6B6B]/15 dark:bg-[#FF6B6B]/20 text-[#FF6B6B] dark:text-[#FFA8A8] border-[#FF6B6B]/40 dark:border-[#FF6B6B]/50 font-bold',
          dot: 'bg-[#FF6B6B]',
          emoji: '🍝'
        };
      case 'transport':
        return {
          bg: 'bg-[#4ECDC4]/15 dark:bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] border-[#4ECDC4]/40 dark:border-[#4ECDC4]/50 font-bold',
          dot: 'bg-[#4ECDC4]',
          emoji: '🚆'
        };
      case 'lodging':
        return {
          bg: 'bg-[#1A535C]/15 dark:bg-[#1A535C]/30 text-[#1A535C] dark:text-[#4ECDC4] border-[#1A535C]/30 dark:border-[#1A535C]/60 font-bold',
          dot: 'bg-[#1A535C]',
          emoji: '🏨'
        };
      case 'activity':
        return {
          bg: 'bg-[#FFE66D]/30 dark:bg-[#FFE66D]/20 text-[#1A535C] dark:text-[#FFE66D] border-[#FFE66D]/70 dark:border-[#FFE66D]/50 font-bold',
          dot: 'bg-[#FFE66D]',
          emoji: '⛵'
        };
      case 'shopping':
        return {
          bg: 'bg-[#FF8E53]/15 dark:bg-[#FF8E53]/20 text-[#E85A5A] dark:text-[#FF8E53] border-[#FF8E53]/40 dark:border-[#FF8E53]/50 font-bold',
          dot: 'bg-[#FF8E53]',
          emoji: '🛍️'
        };
      default:
        return {
          bg: 'bg-[#4ECDC4]/15 dark:bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] border-[#4ECDC4]/40 dark:border-[#4ECDC4]/50 font-bold',
          dot: 'bg-[#4ECDC4]',
          emoji: '🏛️'
        };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Today's Pocket Assistant Card */}
      <PocketModeCard
        trip={trip}
        selectedDayIndex={selectedDayIndex}
        onToggleComplete={onToggleComplete}
        onOpenWallet={onOpenWallet}
        onOpenItemModal={onEditItem}
      />

      {/* 2. Sub-View & Family Member Filter Bar */}
      <div className="bg-white/95 dark:bg-[#1A282F]/95 backdrop-blur-md rounded-2xl p-3 border border-[#FFE66D]/60 dark:border-slate-800 shadow-xs space-y-2.5">
        
        {/* Top line: Sub-view mode toggles + Add Stop */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Sub-view switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDaySubView('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                daySubView === 'timeline'
                  ? 'bg-white dark:bg-slate-900 text-[#1A535C] dark:text-[#FFE66D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Waypoints ({allDayItems.length})</span>
            </button>

            <button
              onClick={() => setDaySubView('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                daySubView === 'map'
                  ? 'bg-white dark:bg-slate-900 text-[#1A535C] dark:text-[#FFE66D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-[#4ECDC4]" />
              <span>Day Map</span>
            </button>

            <button
              onClick={() => setDaySubView('photos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                daySubView === 'photos'
                  ? 'bg-white dark:bg-slate-900 text-[#1A535C] dark:text-[#FFE66D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#FF6B6B]" />
              <span>Photos ({dayPhotos.length})</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {onEditDay && (
              <button
                onClick={onEditDay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE66D]/30 hover:bg-[#FFE66D]/60 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A535C] dark:text-[#FFE66D] border border-[#FFE66D]/70 dark:border-slate-700 text-xs font-black transition-all cursor-pointer"
                title="Edit today's details & weather"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span className="hidden sm:inline">Edit Day</span>
              </button>
            )}
            <button
              onClick={onAddItem}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-extrabold shadow-sm shadow-[#FF6B6B]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stop</span>
            </button>
          </div>
        </div>

        {/* Bottom line: Family Member Highlights */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 flex-shrink-0 mr-1">
            <Users className="w-3 h-3 text-[#FF6B6B]" /> Highlight:
          </span>

          <button
            onClick={() => setSelectedMemberFilter('all')}
            className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedMemberFilter === 'all'
                ? 'bg-[#1A535C] text-[#FFE66D]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Family
          </button>

          {trip.members.map(member => {
            const isSelected = selectedMemberFilter === member.name;
            return (
              <button
                key={member.id}
                onClick={() => setSelectedMemberFilter(isSelected ? 'all' : member.name)}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF6B6B] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{member.avatarEmoji}</span>
                <span>{member.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. Sub-View Content: MAP VIEW */}
      {daySubView === 'map' && (
        <div className="animate-fadeIn">
          <InteractiveMap
            trip={trip}
            selectedDayIndex={selectedDayIndex}
            onSelectDay={onSelectDay || (() => {})}
          />
        </div>
      )}

      {/* 4. Sub-View Content: PHOTOS VIEW */}
      {daySubView === 'photos' && (
        <div className="bg-white dark:bg-[#1A282F] rounded-2xl p-5 border border-[#FFE66D]/60 dark:border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-[#1A535C] dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#FF6B6B]" />
              Day {currentDay.dayNumber} Photo Album ({dayPhotos.length} Photos)
            </h4>
            <button
              onClick={() => {
                if (allDayItems.length > 0) {
                  onAddPhotoToItem(allDayItems[0].id);
                } else {
                  alert('Add a stop first to attach photos to today.');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Attach Photo</span>
            </button>
          </div>

          {dayPhotos.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
              <span className="text-3xl">📷</span>
              <p className="text-xs text-slate-400 mt-2">No photos pinned for this day yet. Snap and attach your memories!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-2">
              {dayPhotos.map((photo, idx) => {
                const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-0'];
                const rot = rotations[idx % rotations.length];
                return (
                  <div 
                    key={photo.id} 
                    onClick={() => setSelectedViewingPhoto(photo)}
                    className={`bg-[#FFFDF9] dark:bg-[#1E293B] rounded-2xl p-3 pb-4 shadow-md hover:shadow-xl border-4 border-white dark:border-slate-800 transition-all hover:scale-105 hover:z-10 group cursor-pointer ${rot}`}
                  >
                    {/* Tape Header */}
                    <div className="flex justify-center -mt-5 mb-1.5">
                      <div className="w-16 h-4 bg-[#FFE66D]/80 rounded-xs shadow-xs border border-amber-300/60" />
                    </div>

                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="p-2 rounded-full bg-white/95 text-[#1A535C] shadow-md font-bold text-xs flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF6B6B]" />
                          <span>View Full Size</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 px-1 space-y-1">
                      <p 
                        className="text-base text-[#1A535C] dark:text-[#FFE66D] font-bold leading-tight line-clamp-1"
                        style={{ fontFamily: "'Caveat', cursive, 'Brush Script MT', sans-serif" }}
                      >
                        "{photo.caption}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>📍 {photo.locationName}</span>
                        <span>by {photo.author}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Sub-View Content: TIMELINE VIEW */}
      {daySubView === 'timeline' && (
        <>
          {items.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white/80 dark:bg-[#1A282F]/80 border border-dashed border-[#FFE66D] dark:border-slate-800">
              <span className="text-4xl">🏝️</span>
              <h4 className="text-base font-black text-[#1A535C] dark:text-white mt-2">
                {selectedMemberFilter !== 'all' 
                  ? `No specific stops tagged for ${selectedMemberFilter} on Day ${currentDay.dayNumber}`
                  : 'No stops scheduled yet for this day'}
              </h4>
              <p className="text-xs text-[#2D3436]/70 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {selectedMemberFilter !== 'all' 
                  ? 'Switch to "All Family" to see all scheduled stops for today.'
                  : 'Add a museum tour, beach stop, train reservation, or family dinner to build out today\'s adventure.'}
              </p>
              {selectedMemberFilter !== 'all' ? (
                <button
                  onClick={() => setSelectedMemberFilter('all')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#1A535C] text-[#FFE66D] text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  View All Stops ({allDayItems.length})
                </button>
              ) : (
                <button
                  onClick={onAddItem}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#FF6B6B] text-white text-xs font-bold hover:bg-[#E85A5A] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Stop</span>
                </button>
              )}
            </div>
          ) : (
            <div className="relative border-l-2 border-[#FFE66D] dark:border-slate-800 ml-4 sm:ml-6 space-y-5 pb-4">
              {items.map((item, idx) => {
                const catStyle = getCategoryStyles(item.category);
                const rawExpenses = item.expenses || [];
                const totalItemExpenseConverted = rawExpenses.reduce((sum, exp) => sum + getExpenseAmountInCurrency(exp, currencyMode), 0);

                return (
                  <div key={item.id} className="relative pl-6 sm:pl-8 group">
                    {/* Timeline node icon */}
                    <div 
                      onClick={() => handleComplete(item)}
                      className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all border-2 ${
                        item.completed
                          ? 'bg-[#4ECDC4] border-[#1A535C] text-[#1A535C] ring-4 ring-[#4ECDC4]/20'
                          : 'bg-white dark:bg-[#1A282F] border-[#FF6B6B] text-[#1A535C] dark:text-white hover:scale-110 shadow-xs'
                      }`}
                      title={item.completed ? "Mark as planned" : "Mark as visited/completed"}
                    >
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-[#1A535C]" />
                      ) : (
                        <span className="text-xs">{catStyle.emoji}</span>
                      )}
                    </div>

                    {/* Card */}
                    <div className={`rounded-2xl p-4 sm:p-5 transition-all border ${
                      item.completed
                        ? 'bg-[#4ECDC4]/5 dark:bg-[#1A282F]/40 border-[#4ECDC4]/30 dark:border-slate-800 opacity-90'
                        : 'bg-white dark:bg-[#1A282F] border-[#FFE66D]/70 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#FF6B6B]/60'
                    }`}>
                      
                      {/* Header: Time, Category, Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#1A535C] dark:text-slate-200">
                            <Clock className="w-3.5 h-3.5 text-[#FF6B6B]" />
                            {item.time}
                          </span>
                          
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${catStyle.bg}`}>
                            <span>{catStyle.emoji}</span>
                            <span className="capitalize">{item.category}</span>
                          </span>

                          {item.suggestedDuration && (
                            <span className="text-[11px] text-[#2D3436]/60 dark:text-slate-400 font-semibold">
                              ({item.suggestedDuration})
                            </span>
                          )}
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-1">
                          {/* 1-Tap Directions */}
                          <button
                            onClick={() => openNavigation(item.locationName, item.destinationCity || currentDay.city)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1A535C] hover:bg-[#4ECDC4]/20 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="Open directions in Apple Maps or Google Maps"
                          >
                            <Navigation className="w-4 h-4 text-[#1A535C] dark:text-[#4ECDC4]" />
                          </button>

                          {/* Edit item */}
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF6B6B] hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="Edit Stop Details"
                          >
                            <Edit3 className="w-4 h-4 text-[#FF6B6B]" />
                          </button>

                          {/* Delete item */}
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF6B6B] hover:bg-rose-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            title="Remove Stop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Location */}
                      <div className="mt-2.5">
                        <h4 className={`text-base sm:text-lg font-black ${
                          item.completed 
                            ? 'line-through text-slate-400 dark:text-slate-500 font-display' 
                            : 'text-[#1A535C] dark:text-white font-display'
                        }`}>
                          {item.title}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-[#FF6B6B] dark:text-[#FFE66D] font-bold mt-0.5">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.locationName} • {item.destinationCity}</span>
                        </div>
                      </div>

                      {/* Notes & Tips */}
                      {item.notes && (
                        <p className="text-xs sm:text-sm text-[#2D3436] dark:text-slate-300 mt-2 leading-relaxed bg-[#FFF9F2] dark:bg-slate-800/40 p-2.5 rounded-xl border border-[#FFE66D]/40 dark:border-slate-800">
                          {item.notes}
                        </p>
                      )}

                      {/* Flight Specific Card */}
                      {item.flightInfo && (
                        <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-[#1A535C]/10 via-[#4ECDC4]/10 to-transparent border border-[#4ECDC4]/40 dark:border-slate-700 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#1A535C] dark:text-[#4ECDC4] flex items-center gap-1.5">
                              ✈️ {item.flightInfo.airline} ({item.flightInfo.flightNumber})
                            </span>
                            {item.flightInfo.bookingRef && (
                              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-[#4ECDC4]/40 text-[#FF6B6B] dark:text-[#FFE66D]">
                                Ref: {item.flightInfo.bookingRef}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-[#2D3436] dark:text-slate-300">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Departure</span>
                              <strong>{item.flightInfo.departureCity}</strong> @ {item.flightInfo.departureTime}
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">Arrival</span>
                              <strong>{item.flightInfo.arrivalCity}</strong> @ {item.flightInfo.arrivalTime}
                            </div>
                          </div>
                          {item.flightInfo.terminal && (
                            <span className="text-[11px] text-[#1A535C] dark:text-slate-300 font-semibold block">
                              📍 {item.flightInfo.terminal} {item.flightInfo.seatsOrBags ? `• ${item.flightInfo.seatsOrBags}` : ''}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Hotel Specific Card */}
                      {item.hotelInfo && (
                        <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-[#FFE66D]/20 via-[#FF8E53]/10 to-transparent border border-[#FFE66D] dark:border-slate-700 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#1A535C] dark:text-[#FFE66D] flex items-center gap-1.5">
                              🏨 {item.hotelInfo.hotelName}
                            </span>
                            {item.hotelInfo.phone && (
                              <a 
                                href={`tel:${item.hotelInfo.phone}`}
                                className="text-xs font-bold text-[#FF6B6B] dark:text-[#4ECDC4] hover:underline"
                              >
                                📞 {item.hotelInfo.phone}
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-[#2D3436] dark:text-slate-300 font-medium">
                            📍 {item.hotelInfo.address}
                          </p>
                          {(item.hotelInfo.checkIn || item.hotelInfo.checkOut) && (
                            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                              {item.hotelInfo.checkIn && <span>Check-in: {item.hotelInfo.checkIn}</span>}
                              {item.hotelInfo.checkOut && <span>Check-out: {item.hotelInfo.checkOut}</span>}
                            </div>
                          )}
                          {item.hotelInfo.cityTaxNotes && (
                            <span className="text-[10px] text-[#FF6B6B] dark:text-[#FFE66D] font-bold block">
                              ℹ️ {item.hotelInfo.cityTaxNotes}
                            </span>
                          )}
                        </div>
                      )}

                      {item.mustTryTip && (
                        <div className="flex items-start gap-2 bg-gradient-to-r from-[#FFE66D]/30 to-[#FFE66D]/10 dark:from-slate-800/80 dark:to-slate-800/40 p-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 mt-2.5 text-xs text-[#1A535C] dark:text-[#FFE66D] font-semibold">
                          <Lightbulb className="w-4 h-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                          <span><strong>Family Tip:</strong> {item.mustTryTip}</span>
                        </div>
                      )}

                      {/* Linked Tickets & Fast Passes */}
                      {item.tickets && item.tickets.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-[#1A535C] dark:text-slate-400 flex items-center gap-1">
                            <Ticket className="w-3.5 h-3.5 text-[#4ECDC4]" /> Linked Passes ({item.tickets.length})
                          </span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {item.tickets.map(tkt => (
                              <div 
                                key={tkt.id} 
                                className="bg-[#4ECDC4]/10 dark:bg-slate-800 border border-[#4ECDC4]/30 dark:border-slate-700 rounded-xl p-2.5 text-xs text-[#1A535C] dark:text-slate-200 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between font-black text-[#1A535C] dark:text-white">
                                    <span>{tkt.title}</span>
                                    <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-[#4ECDC4] text-[#1A535C] font-black">
                                      {tkt.type}
                                    </span>
                                  </div>
                                  {tkt.seatInfo && (
                                    <p className="text-[11px] text-[#1A535C]/80 dark:text-slate-300 mt-0.5 font-medium">
                                      🪑 {tkt.seatInfo}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-2 pt-2 border-t border-[#4ECDC4]/20 dark:border-slate-700 flex items-center justify-between">
                                  <span className="font-mono text-xs font-black text-[#1A535C] dark:text-[#4ECDC4] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-[#4ECDC4]/30">
                                    {tkt.confirmationCode}
                                  </span>
                                  <button
                                    onClick={() => handleCopyCode(tkt.confirmationCode)}
                                    className="flex items-center gap-1 text-[10px] font-bold text-[#1A535C] dark:text-[#4ECDC4] hover:underline cursor-pointer"
                                  >
                                    {copiedCode === tkt.confirmationCode ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600" /> Copied!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" /> Copy Code
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Linked Expenses Breakdown with dual currency & individual expense items */}
                      {item.expenses && item.expenses.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#2D3436] dark:text-slate-300 flex items-center gap-1">
                                <Euro className="w-3.5 h-3.5 text-[#4ECDC4]" /> Total Cost:
                              </span>
                              <span className="font-black text-[#1A535C] dark:text-[#4ECDC4] text-sm">
                                {formatCurrencyAmount(totalItemExpenseConverted, currencyMode, 0)}
                              </span>
                              <span className="text-[11px] font-bold text-[#FF6B6B] dark:text-[#FFE66D]">
                                {currencyMode === 'AUD' 
                                  ? `(≈ €${(totalItemExpenseConverted * AUD_TO_EUR_RATE).toFixed(0)})` 
                                  : `(≈ $${(totalItemExpenseConverted * EUR_TO_AUD_RATE).toFixed(0)} AUD)`}
                              </span>
                            </div>

                            <button
                              onClick={() => onAddExpenseToItem(item.id)}
                              className="text-[11px] font-bold text-[#4ECDC4] hover:text-[#1A535C] dark:hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add Expense
                            </button>
                          </div>

                          {/* Individual Expense Pills/Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {item.expenses.map((exp) => {
                              const expAud = getExpenseAmountInCurrency(exp, 'AUD');
                              const expEur = getExpenseAmountInCurrency(exp, 'EUR');
                              return (
                                <div
                                  key={exp.id}
                                  onClick={() => onEditExpense ? onEditExpense(exp, item.id) : onAddExpenseToItem(item.id)}
                                  className="p-2 rounded-xl bg-slate-50 hover:bg-[#FFE66D]/20 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 cursor-pointer transition-colors group"
                                  title="Click to edit this expense"
                                >
                                  <div className="min-w-0">
                                    <span className="font-bold text-[#1A535C] dark:text-slate-200 text-xs block truncate">
                                      {exp.title}
                                    </span>
                                    <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400 block truncate">
                                      Paid by {exp.paidBy.split(' ')[0]} {exp.category ? `• ${exp.category}` : ''}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <div className="text-right">
                                      <span className="font-black text-xs text-[#1A535C] dark:text-[#4ECDC4] block">
                                        {currencyMode === 'AUD' ? `$${expAud.toFixed(0)} AUD` : `€${expEur.toFixed(0)}`}
                                      </span>
                                    </div>
                                    <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF6B6B] transition-colors" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Photos attached to this stop */}
                      {item.photos && item.photos.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#1A535C] dark:text-slate-400 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-[#FF6B6B]" /> Attached Memories ({item.photos.length})
                            </span>
                            <button
                              onClick={() => onAddPhotoToItem(item.id)}
                              className="text-[11px] font-bold text-[#FF6B6B] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add Photo
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {item.photos.map(ph => (
                              <div 
                                key={ph.id} 
                                onClick={() => setSelectedViewingPhoto(ph)}
                                className="relative group/photo rounded-xl overflow-hidden shadow-xs border border-[#FFE66D]/60 dark:border-slate-700 aspect-video cursor-pointer"
                                title="Click to view full size Polaroid"
                              >
                                <img 
                                  src={ph.url} 
                                  alt={ph.caption} 
                                  className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="p-1.5 rounded-full bg-white/90 text-[#1A535C] shadow-md text-[10px] font-bold">
                                    🔍 Zoom
                                  </span>
                                </div>
                                {ph.caption && (
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-[10px] text-white truncate">
                                    {ph.caption}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Quick Attach Buttons if empty */}
                      {(!item.expenses?.length || !item.photos?.length) && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-[11px]">
                          {!item.expenses?.length && (
                            <button
                              onClick={() => onAddExpenseToItem(item.id)}
                              className="text-[#2D3436]/70 hover:text-[#4ECDC4] flex items-center gap-1 cursor-pointer font-semibold"
                            >
                              <Euro className="w-3 h-3 text-[#4ECDC4]" /> Log Expense
                            </button>
                          )}
                          {!item.photos?.length && (
                            <button
                              onClick={() => onAddPhotoToItem(item.id)}
                              className="text-[#2D3436]/70 hover:text-[#FF6B6B] flex items-center gap-1 cursor-pointer font-semibold"
                            >
                              <Camera className="w-3 h-3 text-[#FF6B6B]" /> Attach Photo
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Polaroid Full-Size Lightbox Modal */}
      <PolaroidLightboxModal
        isOpen={Boolean(selectedViewingPhoto)}
        onClose={() => setSelectedViewingPhoto(null)}
        photo={selectedViewingPhoto}
        allPhotos={dayPhotos.length > 0 ? dayPhotos : (selectedViewingPhoto ? [selectedViewingPhoto] : [])}
        onSelectPhoto={setSelectedViewingPhoto}
      />

    </div>
  );
};
