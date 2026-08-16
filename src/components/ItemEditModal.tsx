import React, { useState, useEffect } from 'react';
import { 
  Clock, MapPin, Tag, Lightbulb, Euro, 
  Ticket, Plus, Save, Compass 
} from 'lucide-react';
import { ItineraryItem, CategoryType, TripData, ExpenseItem, TicketItem } from '../types';

interface ItemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  selectedDayIndex: number;
  editingItem: ItineraryItem | null;
  onSaveItem: (item: ItineraryItem) => void;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Adelaide': { lat: -34.9285, lng: 138.6007 },
  'Dubai': { lat: 25.2048, lng: 55.2708 },
  'Naples': { lat: 40.8518, lng: 14.2681 },
  'Pompeii': { lat: 40.7484, lng: 14.4842 },
  'Roccella Ionica': { lat: 38.3241, lng: 16.4025 },
  'Reggio Calabria': { lat: 38.0994, lng: 15.6427 },
  'Montesarchio': { lat: 41.0664, lng: 14.6406 },
  'San Martino VC': { lat: 41.0261, lng: 14.6644 },
  'Sperlonga': { lat: 41.2583, lng: 13.4331 },
  'Rome': { lat: 41.9028, lng: 12.4964 },
  'Florence': { lat: 43.7696, lng: 11.2558 },
  'Pisa': { lat: 43.7230, lng: 10.3966 },
  'Modena': { lat: 44.6471, lng: 10.9252 },
  'Maranello': { lat: 44.5298, lng: 10.8654 },
  'Padova': { lat: 45.4064, lng: 11.8768 },
  'Montebelluna': { lat: 45.7766, lng: 12.0468 },
  'Venice': { lat: 45.4342, lng: 12.3389 },
  'Verona': { lat: 45.4384, lng: 10.9916 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Olbia': { lat: 40.9240, lng: 9.4988 },
  'Golfo Aranci': { lat: 40.9996, lng: 9.6148 },
  'La Maddalena': { lat: 41.2228, lng: 9.4085 }
};

export const ItemEditModal: React.FC<ItemEditModalProps> = ({
  isOpen,
  onClose,
  trip,
  selectedDayIndex,
  editingItem,
  onSaveItem
}) => {
  const [dayIndex, setDayIndex] = useState(selectedDayIndex);
  const [time, setTime] = useState('10:00 AM');
  const [title, setTitle] = useState('');
  const [destinationCity, setDestinationCity] = useState('Rome');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState<CategoryType>('sightseeing');
  const [lat, setLat] = useState<number>(41.9028);
  const [lng, setLng] = useState<number>(12.4964);
  const [notes, setNotes] = useState('');
  const [mustTryTip, setMustTryTip] = useState('');
  const [suggestedDuration, setSuggestedDuration] = useState('2 hours');

  // Linked Expense State
  const [attachExpense, setAttachExpense] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseCurrency, setExpenseCurrency] = useState<'EUR' | 'AUD'>('EUR');
  const [expensePaidBy, setExpensePaidBy] = useState('Anthony & Tai Fazzalari');

  // Linked Ticket State
  const [attachTicket, setAttachTicket] = useState(false);
  const [ticketCode, setTicketCode] = useState('');
  const [ticketSeat, setTicketSeat] = useState('');

  useEffect(() => {
    if (editingItem) {
      setDayIndex(editingItem.dayIndex);
      setTime(editingItem.time || '10:00 AM');
      setTitle(editingItem.title || '');
      setDestinationCity(editingItem.destinationCity || 'Rome');
      setLocationName(editingItem.locationName || '');
      setCategory(editingItem.category || 'sightseeing');
      setLat(editingItem.lat || 41.9028);
      setLng(editingItem.lng || 12.4964);
      setNotes(editingItem.notes || '');
      setMustTryTip(editingItem.mustTryTip || '');
      setSuggestedDuration(editingItem.suggestedDuration || '2 hours');

      if (editingItem.expenses && editingItem.expenses.length > 0) {
        setAttachExpense(true);
        setExpenseAmount(editingItem.expenses[0].amount);
        setExpenseCurrency((editingItem.expenses[0].currency as 'EUR' | 'AUD') || 'EUR');
        setExpensePaidBy(editingItem.expenses[0].paidBy);
      } else {
        setAttachExpense(false);
        setExpenseAmount(0);
        setExpenseCurrency('EUR');
      }

      if (editingItem.tickets && editingItem.tickets.length > 0) {
        setAttachTicket(true);
        setTicketCode(editingItem.tickets[0].confirmationCode);
        setTicketSeat(editingItem.tickets[0].seatInfo || '');
      } else {
        setAttachTicket(false);
        setTicketCode('');
      }
    } else {
      // New stop default
      setDayIndex(selectedDayIndex);
      const currentCity = trip.days[selectedDayIndex]?.city || 'Rome';
      setDestinationCity(currentCity);
      const coords = CITY_COORDINATES[currentCity] || { lat: 41.9028, lng: 12.4964 };
      setLat(coords.lat);
      setLng(coords.lng);
      setTime('10:00 AM');
      setTitle('');
      setLocationName(currentCity);
      setCategory('sightseeing');
      setNotes('');
      setMustTryTip('');
      setSuggestedDuration('2 hours');
      setAttachExpense(false);
      setExpenseAmount(0);
      setExpenseCurrency('EUR');
      setAttachTicket(false);
      setTicketCode('');
    }
  }, [editingItem, selectedDayIndex, trip.days]);

  if (!isOpen) return null;

  const handleCityPreset = (city: string) => {
    setDestinationCity(city);
    if (CITY_COORDINATES[city]) {
      setLat(CITY_COORDINATES[city].lat);
      setLng(CITY_COORDINATES[city].lng);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an activity title.');
      return;
    }

    const expenses: ExpenseItem[] = editingItem?.expenses ? [...editingItem.expenses] : [];
    if (attachExpense && expenseAmount > 0) {
      const amountAud = expenseCurrency === 'AUD' ? expenseAmount : expenseAmount * 1.64;
      const amountEur = expenseCurrency === 'EUR' ? expenseAmount : expenseAmount / 1.64;

      if (expenses.length > 0) {
        expenses[0] = {
          ...expenses[0],
          title: `${title} Cost`,
          amount: amountEur,
          amountAud: amountAud,
          currency: expenseCurrency,
          paidBy: expensePaidBy
        };
      } else {
        expenses.push({
          id: `exp-${Date.now()}`,
          title: `${title} Cost`,
          amount: amountEur,
          amountAud: amountAud,
          currency: expenseCurrency,
          paidBy: expensePaidBy,
          splitBetween: trip.members.map(m => m.name),
          category: category === 'transport' || category === 'lodging' || category === 'food' ? category : 'other',
          date: trip.days[dayIndex]?.date || '2026-08-17'
        });
      }
    }

    const tickets: TicketItem[] = editingItem?.tickets ? [...editingItem.tickets] : [];
    if (attachTicket && ticketCode.trim()) {
      if (tickets.length > 0) {
        tickets[0] = {
          ...tickets[0],
          title: `${title} Pass`,
          confirmationCode: ticketCode.trim(),
          seatInfo: ticketSeat
        };
      } else {
        tickets.push({
          id: `tkt-${Date.now()}`,
          title: `${title} Pass`,
          type: category === 'transport' ? 'train' : 'museum',
          confirmationCode: ticketCode.trim(),
          seatInfo: ticketSeat,
          validDate: trip.days[dayIndex]?.date || '2026-08-01',
          validTime: time,
          holderNames: trip.members.map(m => m.name)
        });
      }
    }

    const itemToSave: ItineraryItem = {
      id: editingItem ? editingItem.id : `it-${Date.now()}`,
      dayIndex,
      time,
      title: title.trim(),
      destinationCity,
      locationName: locationName.trim() || destinationCity,
      category,
      lat,
      lng,
      notes: notes.trim(),
      mustTryTip: mustTryTip.trim(),
      suggestedDuration,
      completed: editingItem ? editingItem.completed : false,
      expenses,
      tickets,
      photos: editingItem?.photos || []
    };

    onSaveItem(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A535C]/60 backdrop-blur-xs p-3 sm:p-6 flex min-h-screen items-start justify-center py-6 sm:py-10 animate-fadeIn">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl border-2 border-[#FFE66D] dark:border-slate-800 space-y-4 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base sm:text-lg font-black font-display text-[#1A535C] dark:text-white flex items-center gap-2">
            <span>{editingItem ? '✏️ Edit Itinerary Stop' : '📍 Add Itinerary Stop'}</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-[#FF6B6B] flex items-center justify-center text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Day & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
                Trip Day:
              </label>
              <select
                value={dayIndex}
                onChange={e => setDayIndex(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-[#FFF9F2] dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-bold"
              >
                {trip.days.map((d) => (
                  <option key={d.dayIndex} value={d.dayIndex}>
                    Day {d.dayNumber}: {d.city} ({d.dayOfWeek.slice(0, 3)}, {d.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
                Time / Schedule:
              </label>
              <input
                type="text"
                placeholder="e.g. 09:30 AM or 14:00"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Activity Title */}
          <div>
            <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
              Activity / Stop Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Colosseum Arena Tour or Gelato at Giolitti"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-bold"
            />
          </div>

          {/* Category & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
              >
                <option value="sightseeing">🏛️ Sightseeing & Monument</option>
                <option value="food">🍝 Food & Dining</option>
                <option value="transport">🚆 Transport & Train</option>
                <option value="lodging">🏨 Hotel & Penthouse</option>
                <option value="activity">⛵ Activity & Boat</option>
                <option value="shopping">🛍️ Shopping & Souvenirs</option>
                <option value="relaxation">🏖️ Beach & Relaxation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
                City / Region:
              </label>
              <input
                type="text"
                value={destinationCity}
                onChange={e => setDestinationCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Quick city coordinate presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-[#2D3436]/60 dark:text-slate-400 font-black">City Presets:</span>
            {Object.keys(CITY_COORDINATES).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => handleCityPreset(c)}
                className="px-2.5 py-1 rounded-lg bg-[#FFE66D]/30 hover:bg-[#FFE66D] text-[10px] font-bold text-[#1A535C] transition-colors border border-[#FFE66D]"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Specific Location Name & Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
                Location Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Piazza Navona"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
                Latitude:
              </label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={e => setLat(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
                Longitude:
              </label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={e => setLng(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          {/* Notes & Insider Tip */}
          <div>
            <label className="text-xs font-black text-[#1A535C] dark:text-slate-300 block mb-1">
              Notes & Itinerary Details:
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Meet guide near arch of Constantine. Bring water and sunglasses."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-black text-[#FF6B6B] block mb-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-[#FF6B6B]" /> Family Insider Tip:
            </label>
            <input
              type="text"
              placeholder="e.g. Try the wild strawberry gelato!"
              value={mustTryTip}
              onChange={e => setMustTryTip(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#FF6B6B]/40 dark:border-slate-700 bg-[#FF6B6B]/10 dark:bg-slate-800 text-xs text-[#1A535C] dark:text-white font-medium"
            />
          </div>

          {/* Link Expense Box */}
          <div className="bg-[#4ECDC4]/10 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-[#4ECDC4]/40 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attachExpense}
                onChange={e => setAttachExpense(e.target.checked)}
                className="rounded accent-[#4ECDC4]"
              />
              <span className="text-xs font-black text-[#1A535C] dark:text-[#4ECDC4] flex items-center gap-1">
                <Euro className="w-3.5 h-3.5 text-[#4ECDC4]" /> Link Expense to this Stop
              </span>
            </label>

            {attachExpense && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-[#1A535C] dark:text-slate-400 block mb-0.5">Amount:</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#4ECDC4]/40 bg-white dark:bg-slate-800 text-xs font-bold text-[#1A535C] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A535C] dark:text-slate-400 block mb-0.5">Currency:</label>
                  <select
                    value={expenseCurrency}
                    onChange={e => setExpenseCurrency(e.target.value as 'EUR' | 'AUD')}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#4ECDC4]/40 bg-white dark:bg-slate-800 text-xs font-bold text-[#1A535C] dark:text-white"
                  >
                    <option value="EUR">€ EUR (Euros)</option>
                    <option value="AUD">$ AUD (Australian $)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A535C] dark:text-slate-400 block mb-0.5">Paid By:</label>
                  <select
                    value={expensePaidBy}
                    onChange={e => setExpensePaidBy(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#4ECDC4]/40 bg-white dark:bg-slate-800 text-xs font-bold text-[#1A535C] dark:text-white"
                  >
                    {trip.members.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Link Ticket Box */}
          <div className="bg-[#FFF9F2] dark:bg-indigo-950/20 p-3.5 rounded-2xl border border-[#FFE66D] space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attachTicket}
                onChange={e => setAttachTicket(e.target.checked)}
                className="rounded accent-[#FF6B6B]"
              />
              <span className="text-xs font-black text-[#1A535C] dark:text-indigo-300 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-[#FF6B6B]" /> Link Ticket / Booking Confirmation
              </span>
            </label>

            {attachTicket && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-[#1A535C] dark:text-slate-400 block mb-0.5">Confirmation / PNR Code:</label>
                  <input
                    type="text"
                    placeholder="e.g. PNR-K8F92L"
                    value={ticketCode}
                    onChange={e => setTicketCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#FFE66D] bg-white dark:bg-slate-800 text-xs font-mono font-bold text-[#1A535C]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1A535C] dark:text-slate-400 block mb-0.5">Seat / Coach / Gate:</label>
                  <input
                    type="text"
                    placeholder="e.g. Coach 3, Seats 41-46"
                    value={ticketSeat}
                    onChange={e => setTicketSeat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#FFE66D] bg-white dark:bg-slate-800 text-xs font-bold text-[#1A535C]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black shadow-md shadow-[#FF6B6B]/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingItem ? 'Save Changes' : 'Add to Schedule'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
