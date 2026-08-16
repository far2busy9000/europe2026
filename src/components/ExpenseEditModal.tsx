import React, { useState, useEffect } from 'react';
import { 
  Euro, DollarSign, X, Save, Trash2, Calendar, 
  Tag, User, Users, FileText, Check, Sparkles, Link as LinkIcon
} from 'lucide-react';
import { ExpenseItem, TripData, CategoryType, ItineraryItem } from '../types';
import { EUR_TO_AUD_RATE, CurrencyMode, formatCurrencyAmount } from '../utils/currency';
import { formatDateAU } from '../utils/date';

interface ExpenseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  selectedDayIndex: number;
  editingExpense: ExpenseItem | null;
  targetItemId?: string;
  onSaveExpense: (expense: ExpenseItem, targetItemId?: string) => void;
  onDeleteExpense?: (expenseId: string) => void;
}

const EXPENSE_CATEGORIES: { id: CategoryType | 'tickets' | 'other'; label: string; emoji: string }[] = [
  { id: 'food', label: 'Food & Dining', emoji: '🍝' },
  { id: 'transport', label: 'Transport & Fuel', emoji: '🚆' },
  { id: 'lodging', label: 'Lodging & City Tax', emoji: '🏨' },
  { id: 'tickets', label: 'Tickets & Passes', emoji: '🎟️' },
  { id: 'activity', label: 'Activities & Tours', emoji: '🏛️' },
  { id: 'shopping', label: 'Shopping & Souvenirs', emoji: '🛍️' },
  { id: 'other', label: 'Other / Misc', emoji: '💶' },
];

export const ExpenseEditModal: React.FC<ExpenseEditModalProps> = ({
  isOpen,
  onClose,
  trip,
  selectedDayIndex,
  editingExpense,
  targetItemId: initialTargetItemId,
  onSaveExpense,
  onDeleteExpense
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'EUR' | 'AUD' | 'GBP' | 'USD'>('EUR');
  const [category, setCategory] = useState<CategoryType | 'tickets' | 'other'>('food');
  const [date, setDate] = useState<string>('');
  const [paidBy, setPaidBy] = useState<string>('Anthony & Tai Fazzalari');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [bookingRef, setBookingRef] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);

  // Initialize form whenever modal opens or editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || '');
      setAmount(editingExpense.amount ? String(editingExpense.amount) : '');
      setCurrency((editingExpense.currency as any) || 'EUR');
      setCategory(editingExpense.category || 'food');
      setDate(editingExpense.date || trip.days[selectedDayIndex]?.date || '2026-08-17');
      setPaidBy(editingExpense.paidBy || 'Anthony & Tai Fazzalari');
      setSplitBetween(editingExpense.splitBetween && editingExpense.splitBetween.length > 0 
        ? editingExpense.splitBetween 
        : trip.members.map(m => m.name));
      setNotes(editingExpense.notes || '');
      setBookingRef(editingExpense.bookingRef || '');

      // Find if this expense is attached to an item
      const parentItem = trip.items.find(it => it.expenses && it.expenses.some(e => e.id === editingExpense.id));
      if (parentItem) {
        setSelectedItemId(parentItem.id);
        setSelectedDayNum(parentItem.dayIndex + 1);
      } else {
        setSelectedItemId(initialTargetItemId || '');
        const dayMatchIndex = trip.days.findIndex(d => d.date === editingExpense.date);
        setSelectedDayNum(dayMatchIndex >= 0 ? dayMatchIndex + 1 : selectedDayIndex + 1);
      }
    } else {
      // New Expense Defaults
      const currentDay = trip.days[selectedDayIndex] || trip.days[0];
      setTitle('');
      setAmount('');
      setCurrency('EUR');
      setCategory('food');
      setDate(currentDay ? currentDay.date : '2026-08-17');
      setPaidBy('Anthony & Tai Fazzalari');
      setSplitBetween(trip.members.map(m => m.name));
      setNotes('');
      setBookingRef('');
      setSelectedItemId(initialTargetItemId || '');
      setSelectedDayNum(selectedDayIndex + 1);
    }
  }, [editingExpense, isOpen, selectedDayIndex, trip, initialTargetItemId]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  
  // Converted amount preview
  const previewAud = currency === 'EUR' ? numAmount * EUR_TO_AUD_RATE : currency === 'AUD' ? numAmount : numAmount * 1.65;
  const previewEur = currency === 'AUD' ? numAmount / EUR_TO_AUD_RATE : currency === 'EUR' ? numAmount : numAmount * 0.9;

  const handleToggleMember = (memberName: string) => {
    if (splitBetween.includes(memberName)) {
      if (splitBetween.length > 1) {
        setSplitBetween(splitBetween.filter(m => m !== memberName));
      }
    } else {
      setSplitBetween([...splitBetween, memberName]);
    }
  };

  const handleSelectAllMembers = () => {
    setSplitBetween(trip.members.map(m => m.name));
  };

  const handleDayChange = (dayNum: number) => {
    setSelectedDayNum(dayNum);
    const day = trip.days[dayNum - 1];
    if (day) {
      setDate(day.date);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an expense title / description.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid expense amount.');
      return;
    }

    const savedExpense: ExpenseItem = {
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      currency,
      paidBy: paidBy.trim() || 'Anthony & Tai Fazzalari',
      splitBetween: splitBetween.length > 0 ? splitBetween : trip.members.map(m => m.name),
      category,
      date: date || trip.days[selectedDayNum - 1]?.date || '2026-08-17',
      notes: notes.trim() || undefined,
      bookingRef: bookingRef.trim() || undefined,
    };

    onSaveExpense(savedExpense, selectedItemId || undefined);
    onClose();
  };

  const dayItems = trip.items.filter(it => it.dayIndex === (selectedDayNum - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#FFE66D] dark:border-slate-700 my-auto overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#FFE66D]/60 dark:border-slate-800 bg-[#FFFDF9] dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] flex items-center justify-center font-black border border-[#4ECDC4]/40">
              <Euro className="w-5 h-5 text-[#1A535C] dark:text-[#4ECDC4]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-display text-[#1A535C] dark:text-white">
                {editingExpense ? 'Edit Expense Details' : 'Log New Expense'}
              </h3>
              <p className="text-xs text-[#2D3436]/70 dark:text-slate-400 font-medium">
                {editingExpense ? 'Update amount, payer, split, or category' : 'Track costs in EUR or AUD with automatic split'}
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Title & Description */}
          <div>
            <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
              Expense Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Colosseum Family Tickets, Dinner at Da Enzo, Trenitalia Train"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-medium focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
            />
          </div>

          {/* Amount & Currency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
                Amount Paid *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 pl-8 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-black text-base focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
                />
                <span className="absolute left-3 top-3 text-slate-400 font-bold">
                  {currency === 'EUR' ? '€' : currency === 'AUD' ? '$' : currency === 'GBP' ? '£' : '$'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-bold focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
              >
                <option value="EUR">EUR (€) - Euros (Italy & EU)</option>
                <option value="AUD">AUD ($) - Australian Dollars</option>
                <option value="GBP">GBP (£) - British Pounds (London)</option>
                <option value="USD">USD ($) - US Dollars</option>
              </select>
            </div>
          </div>

          {/* Live Currency Conversion Callout */}
          {numAmount > 0 && (
            <div className="bg-[#4ECDC4]/10 dark:bg-slate-800/80 p-3 rounded-2xl border border-[#4ECDC4]/30 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Live Equivalent:
              </span>
              <div className="font-bold text-[#1A535C] dark:text-[#4ECDC4] space-x-2">
                {currency === 'EUR' ? (
                  <span>≈ ${previewAud.toFixed(2)} AUD (at {EUR_TO_AUD_RATE} rate)</span>
                ) : (
                  <span>≈ €{previewEur.toFixed(2)} EUR</span>
                )}
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1.5">
              Expense Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXPENSE_CATEGORIES.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2 rounded-xl text-left font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A535C] text-[#FFE66D] border-[#1A535C] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-[#2D3436] dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day & Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
                Trip Day
              </label>
              <select
                value={selectedDayNum}
                onChange={(e) => handleDayChange(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-medium text-xs focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
              >
                {trip.days.map((day) => (
                  <option key={day.dayNumber} value={day.dayNumber}>
                    Day {day.dayNumber}: {day.city} ({formatDateAU(day.date, 'short')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
                Expense Date (DD/MM/YYYY)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-medium text-xs focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
              />
            </div>
          </div>

          {/* Paid By Selection */}
          <div>
            <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1.5">
              Who Paid?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Anthony & Tai Fazzalari', 'Anthony (Dad)', 'Tai (Mom)', 'Zoe', 'James', 'Lia', 'Nonna (Francesca)'].map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setPaidBy(name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    paidBy === name
                      ? 'bg-[#FF6B6B] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Split Between Multi-Select */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#4ECDC4]" /> Split Between ({splitBetween.length} People)
              </label>
              <button
                type="button"
                onClick={handleSelectAllMembers}
                className="text-[11px] font-bold text-[#1A535C] dark:text-[#FFE66D] hover:underline cursor-pointer"
              >
                Select All ({trip.members.length})
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {trip.members.map(member => {
                const isSelected = splitBetween.includes(member.name);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleToggleMember(member.name)}
                    className={`p-2 rounded-xl text-left font-bold text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFE66D]/40 dark:bg-slate-800 text-[#1A535C] dark:text-[#FFE66D] border-[#FFE66D]'
                        : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{member.avatarEmoji}</span>
                      <span className="truncate">{member.name.split(' ')[0]}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1A535C] dark:text-[#FFE66D] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Link to Stop (Optional) */}
          <div>
            <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
              Link to Itinerary Stop (Optional)
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-medium text-xs focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
            >
              <option value="">Standalone Trip Expense (General)</option>
              {dayItems.map(item => (
                <option key={item.id} value={item.id}>
                  Day {selectedDayNum}: {item.time} - {item.title} ({item.locationName})
                </option>
              ))}
            </select>
          </div>

          {/* Notes & Booking Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
                Booking Ref / Receipt Code (Optional)
              </label>
              <input
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                placeholder="e.g. REC-98214 or PNR code"
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#1A535C] dark:text-slate-300 mb-1">
                Notes / Memo (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Includes tip + 4 gelatos"
                className="w-full px-3 py-2 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-white font-medium text-xs focus:ring-2 focus:ring-[#FF6B6B] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            {editingExpense && onDeleteExpense ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${editingExpense.title}"?`)) {
                    onDeleteExpense(editingExpense.id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#FF6B6B]/25 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingExpense ? 'Save Changes' : 'Log Expense'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
