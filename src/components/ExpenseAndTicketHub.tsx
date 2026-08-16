import React, { useState } from 'react';
import { 
  Euro, Ticket, Plus, Users, 
  Copy, Check, Filter, Search, 
  Sparkles, CreditCard, ChevronDown, CheckCircle2,
  DollarSign, ArrowRightLeft, TrendingUp, Edit3, Trash2
} from 'lucide-react';
import { TripData, ExpenseItem, TicketItem, FamilyMember } from '../types';
import { 
  CurrencyMode, 
  EUR_TO_AUD_RATE, 
  getExpenseAmountInCurrency, 
  formatCurrencyAmount, 
  formatShortCurrency 
} from '../utils/currency';
import { formatDateAU } from '../utils/date';

interface ExpenseAndTicketHubProps {
  trip: TripData;
  currencyMode?: CurrencyMode;
  setCurrencyMode?: (mode: CurrencyMode) => void;
  onAddExpense: () => void;
  onEditExpense?: (expense: ExpenseItem) => void;
  onAddTicket: () => void;
  onDeleteExpense: (id: string) => void;
  onDeleteTicket: (id: string) => void;
}

export const ExpenseAndTicketHub: React.FC<ExpenseAndTicketHubProps> = ({
  trip,
  currencyMode: propCurrencyMode,
  setCurrencyMode: propSetCurrencyMode,
  onAddExpense,
  onEditExpense,
  onAddTicket,
  onDeleteExpense,
  onDeleteTicket
}) => {
  const [subTab, setSubTab] = useState<'expenses' | 'tickets'>('expenses');
  const [internalCurrencyMode, setInternalCurrencyMode] = useState<CurrencyMode>('AUD');
  const currencyMode = propCurrencyMode || internalCurrencyMode;
  const setCurrencyMode = propSetCurrencyMode || setInternalCurrencyMode;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMember, setFilterMember] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Collect all expenses from items plus standalone
  const allExpenses: ExpenseItem[] = [];
  trip.items.forEach(it => {
    if (it.expenses) allExpenses.push(...it.expenses);
  });
  if (trip.allExpenses) {
    trip.allExpenses.forEach(e => {
      if (!allExpenses.some(ex => ex.id === e.id)) {
        allExpenses.push(e);
      }
    });
  }

  // Collect all tickets
  const allTickets: TicketItem[] = [];
  trip.items.forEach(it => {
    if (it.tickets) allTickets.push(...it.tickets);
  });
  if (trip.allTickets) {
    trip.allTickets.forEach(t => {
      if (!allTickets.some(tk => tk.id === t.id)) {
        allTickets.push(t);
      }
    });
  }

  // Calculate total spent in active currency
  const totalSpentSelected = allExpenses.reduce((sum, e) => {
    return sum + getExpenseAmountInCurrency(e, currencyMode);
  }, 0);

  const totalSpentOther = allExpenses.reduce((sum, e) => {
    return sum + getExpenseAmountInCurrency(e, currencyMode === 'AUD' ? 'EUR' : 'AUD');
  }, 0);

  // Category breakdown in selected currency
  const categoryTotals: Record<string, number> = {
    food: 0,
    transport: 0,
    lodging: 0,
    tickets: 0,
    activity: 0,
    shopping: 0,
    other: 0
  };

  allExpenses.forEach(e => {
    const cat = e.category || 'other';
    const amount = getExpenseAmountInCurrency(e, currencyMode);
    if (categoryTotals[cat] !== undefined) {
      categoryTotals[cat] += amount;
    } else {
      categoryTotals.other += amount;
    }
  });

  // Calculate Family Balances (Who paid what vs who consumed what)
  const memberBalances: Record<string, { paid: number; share: number; net: number }> = {};
  trip.members.forEach(m => {
    memberBalances[m.name] = { paid: 0, share: 0, net: 0 };
  });

  allExpenses.forEach(e => {
    const expenseVal = getExpenseAmountInCurrency(e, currencyMode);
    // Add to payer
    if (memberBalances[e.paidBy]) {
      memberBalances[e.paidBy].paid += expenseVal;
    }

    // Split among splitBetween
    const splitList = e.splitBetween && e.splitBetween.length > 0 ? e.splitBetween : trip.members.map(m => m.name);
    const splitShare = expenseVal / splitList.length;

    splitList.forEach(mName => {
      if (memberBalances[mName]) {
        memberBalances[mName].share += splitShare;
      }
    });
  });

  Object.keys(memberBalances).forEach(name => {
    memberBalances[name].net = memberBalances[name].paid - memberBalances[name].share;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Filtered expenses
  const filteredExpenses = allExpenses.filter(e => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    if (filterMember !== 'all' && e.paidBy !== filterMember) return false;
    if (searchTerm && !e.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Filtered tickets
  const filteredTickets = allTickets.filter(t => {
    if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase()) && !t.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Lia portion values (in AUD base converted to current currency mode)
  const liaPortionBaseAud = 2187.24;
  const liaPortionDisplay = currencyMode === 'AUD' 
    ? liaPortionBaseAud 
    : liaPortionBaseAud / EUR_TO_AUD_RATE;

  const liaItems = [
    { title: 'Florence Flat & Museums', desc: 'La Casa di Luna (Via Faenza) + Accademia', aud: 263.97 },
    { title: 'Modena Pallamaglio Suites', desc: 'Suite Retro & Suite Tortellino + City Tax', aud: 166.28 },
    { title: 'London Hotel & EasyJet', desc: 'Park Avenue Bayswater + EasyJet EZY8294', aud: 321.50 },
    { title: 'Harry Potter Studios Tour', desc: 'Warner Bros Studio Tour (Victoria Station)', aud: 645.39 },
    { title: 'Sardinia Hotel & Flights', desc: 'Hotel Villa Margherita Golfo Aranci + BA 592', aud: 422.00 },
    { title: 'Rome B&B & Aeroitalia', desc: 'Number 60 Fiumicino + Flight XZ2612 + Transfers', aud: 259.48 },
    { title: 'Emirates Return Flight Portion', desc: 'Rome FCO → Dubai DXB → Adelaide ADL (EK 0098 & EK 0440)', aud: 108.62 }
  ];

  return (
    <div className="space-y-6">
      {/* Sub tabs: Expenses vs Tickets + Global Currency Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white/90 dark:bg-[#1A282F]/90 backdrop-blur-md p-3 rounded-2xl border border-[#FFE66D]/70 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSubTab('expenses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'expenses'
                ? 'bg-[#4ECDC4] text-[#1A535C] shadow-sm shadow-[#4ECDC4]/30'
                : 'text-[#2D3436]/70 dark:text-slate-400 hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#1A535C]" />
            <span>Holiday Expenses & Family Split ({allExpenses.length})</span>
          </button>

          <button
            onClick={() => setSubTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'tickets'
                ? 'bg-[#FF6B6B] text-white shadow-sm shadow-[#FF6B6B]/30'
                : 'text-[#2D3436]/70 dark:text-slate-400 hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Central Tickets & Passes Vault ({allTickets.length})</span>
          </button>
        </div>

        {/* Currency Switcher & Add Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Currency Toggle Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrencyMode('AUD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                currencyMode === 'AUD'
                  ? 'bg-[#FF6B6B] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="View all prices in Australian Dollars ($ AUD)"
            >
              <span>🇦🇺 $ AUD</span>
            </button>
            <button
              onClick={() => setCurrencyMode('EUR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                currencyMode === 'EUR'
                  ? 'bg-[#1A535C] text-[#FFE66D] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="View all prices in Euros (€ EUR)"
            >
              <span>🇪🇺 € EUR</span>
            </button>
          </div>

          {subTab === 'expenses' ? (
            <button
              onClick={onAddExpense}
              className="px-3.5 py-2 rounded-xl bg-[#1A535C] hover:bg-[#224A52] text-[#FFE66D] text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FFE66D]" />
              <span>Log Expense</span>
            </button>
          ) : (
            <button
              onClick={onAddTicket}
              className="px-3.5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black flex items-center gap-1.5 shadow-sm shadow-[#FF6B6B]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pass / Ticket</span>
            </button>
          )}
        </div>
      </div>

      {subTab === 'expenses' ? (
        /* EXPENSES & FAMILY SPLIT VIEW */
        <div className="space-y-6">
          
          {/* Total Expenditure & Category Summary Hero Card */}
          <div className="bg-gradient-to-br from-[#1A535C] via-[#224A52] to-[#2D3436] rounded-3xl p-6 sm:p-7 text-white shadow-xl space-y-4 border border-[#4ECDC4]/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FFE66D] px-2.5 py-0.5 rounded-md bg-white/10">
                    Total Family Holiday Spend
                  </span>
                  <span className="text-[11px] text-slate-300 font-semibold">
                    (1 EUR ≈ 1.64 AUD)
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-2 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black font-display text-white">
                    {formatCurrencyAmount(totalSpentSelected, currencyMode, 0)}
                  </span>
                  <span className="text-sm sm:text-base text-[#4ECDC4] font-bold">
                    ≈ {formatCurrencyAmount(totalSpentOther, currencyMode === 'AUD' ? 'EUR' : 'AUD', 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                <ArrowRightLeft className="w-4 h-4 text-[#FFE66D]" />
                <div className="text-right">
                  <span className="text-[10px] text-slate-300 font-black uppercase tracking-wider block">Live Currency</span>
                  <span className="text-xs font-black text-[#FFE66D]">
                    {currencyMode === 'AUD' ? 'Displaying Australian Dollars ($)' : 'Displaying European Euros (€)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Category breakdown pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 border-t border-white/15 text-xs">
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                <span className="text-[#FFE66D] block text-[10px] uppercase font-black">🍝 Food & Wine</span>
                <span className="font-black text-white text-sm">
                  {formatShortCurrency(categoryTotals.food, currencyMode, 0)}
                </span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                <span className="text-[#FFE66D] block text-[10px] uppercase font-black">🚆 Transport</span>
                <span className="font-black text-white text-sm">
                  {formatShortCurrency(categoryTotals.transport, currencyMode, 0)}
                </span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                <span className="text-[#FFE66D] block text-[10px] uppercase font-black">🏨 Lodging</span>
                <span className="font-black text-white text-sm">
                  {formatShortCurrency(categoryTotals.lodging, currencyMode, 0)}
                </span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                <span className="text-[#FFE66D] block text-[10px] uppercase font-black">🎟️ Passes/Tours</span>
                <span className="font-black text-white text-sm">
                  {formatShortCurrency(categoryTotals.tickets + categoryTotals.activity, currencyMode, 0)}
                </span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                <span className="text-[#FFE66D] block text-[10px] uppercase font-black">🛍️ Shopping</span>
                <span className="font-black text-white text-sm">
                  {formatShortCurrency(categoryTotals.shopping, currencyMode, 0)}
                </span>
              </div>
              <div className="bg-black/30 rounded-xl p-2.5 border border-white/10">
                <span className="text-[#FFE66D] block text-[10px] uppercase font-black">✨ Other</span>
                <span className="font-black text-white text-sm">
                  {formatShortCurrency(categoryTotals.other, currencyMode, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Family Member Settlement / Who Paid & Fair Share */}
          <div className="bg-white dark:bg-[#1A282F] rounded-3xl p-5 border border-[#FFE66D]/70 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF6B6B]" />
                <h4 className="text-base font-black font-display text-[#1A535C] dark:text-white">
                  Family Fair-Share & Split Settlement
                </h4>
              </div>
              <span className="text-xs text-[#2D3436]/60 dark:text-slate-400 font-semibold">
                Amounts shown in {currencyMode}
              </span>
            </div>

            {/* Lia Nigro's Portion Dedicated Highlight Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFE66D]/20 via-[#4ECDC4]/15 to-[#FF6B6B]/15 border-2 border-[#1A535C]/20 dark:border-[#FFE66D]/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <h5 className="text-sm font-black text-[#1A535C] dark:text-white">
                      Lia Nigro's Travel Portion Breakdown
                    </h5>
                    <p className="text-[11px] text-[#2D3436]/70 dark:text-slate-300 font-medium">
                      Itemized individual accommodation, transport & tour shares
                    </p>
                  </div>
                </div>
                <div className="text-right bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-[#4ECDC4]/40 shadow-xs">
                  <span className="text-[10px] text-[#FF6B6B] dark:text-[#FFE66D] font-black uppercase block">Total Lia's Share</span>
                  <span className="text-lg font-black text-[#1A535C] dark:text-[#4ECDC4]">
                    {formatCurrencyAmount(liaPortionDisplay, currencyMode, 2)}
                  </span>
                </div>
              </div>

              {/* Lia's Itemized List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {liaItems.map((item, idx) => {
                  const val = currencyMode === 'AUD' ? item.aud : item.aud / EUR_TO_AUD_RATE;
                  return (
                    <div key={idx} className={`bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700 ${idx === liaItems.length - 1 ? 'sm:col-span-2 md:col-span-3' : ''}`}>
                      <div className="flex justify-between font-bold text-[#1A535C] dark:text-slate-200">
                        <span>{item.title}</span>
                        <span className="text-[#FF6B6B] font-black">
                          {formatShortCurrency(val, currencyMode, 2)}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400 block mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Member Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {trip.members.map(m => {
                const bal = memberBalances[m.name] || { paid: 0, share: 0, net: 0 };
                const isOwed = bal.net > 0.5;
                const isDebt = bal.net < -0.5;

                return (
                  <div 
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-slate-800/60 border border-[#FFE66D]/60 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{m.avatarEmoji}</span>
                        <div>
                          <span className="font-black text-xs text-[#1A535C] dark:text-white block">{m.name}</span>
                          <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400 font-medium">{m.relation}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-[#2D3436] dark:text-slate-400 font-medium">
                        <div className="flex justify-between">
                          <span>Total Paid:</span>
                          <span className="font-bold text-[#1A535C] dark:text-slate-200">
                            {formatShortCurrency(bal.paid, currencyMode, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fair Share:</span>
                          <span className="font-bold text-[#1A535C] dark:text-slate-200">
                            {formatShortCurrency(bal.share, currencyMode, 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#FFE66D]/50 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#2D3436]/60 dark:text-slate-400">Status:</span>
                      <span className={`text-xs font-black ${
                        isOwed 
                          ? 'text-[#4ECDC4] dark:text-[#4ECDC4]' 
                          : isDebt 
                          ? 'text-[#FF6B6B] dark:text-[#FFA8A8]' 
                          : 'text-slate-400'
                      }`}>
                        {isOwed 
                          ? `Gets back ${formatShortCurrency(bal.net, currencyMode, 0)}` 
                          : isDebt 
                          ? `Owes ${formatShortCurrency(Math.abs(bal.net), currencyMode, 0)}` 
                          : 'Settled ✨'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expenses Itemized List with Filters */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <h4 className="text-base font-black font-display text-[#1A535C] dark:text-white">
                All Linked Expenses ({filteredExpenses.length})
              </h4>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-slate-200 text-xs font-medium"
                />

                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-slate-200 text-xs font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transport</option>
                  <option value="lodging">Lodging</option>
                  <option value="tickets">Tickets / Tours</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={filterMember}
                  onChange={e => setFilterMember(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#1A535C] dark:text-slate-200 text-xs font-semibold"
                >
                  <option value="all">All Payers</option>
                  {trip.members.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#1A282F] rounded-3xl border border-[#FFE66D]/70 dark:border-slate-800 shadow-sm overflow-hidden">
              {filteredExpenses.map((exp) => {
                const amountPrimary = getExpenseAmountInCurrency(exp, currencyMode);
                const amountSecondary = getExpenseAmountInCurrency(exp, currencyMode === 'AUD' ? 'EUR' : 'AUD');

                return (
                  <div 
                    key={exp.id} 
                    className="p-4 flex items-center justify-between gap-3 hover:bg-[#FFF9F2] dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onEditExpense ? onEditExpense(exp) : onAddExpense()}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/15 dark:bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] flex items-center justify-center font-black text-sm flex-shrink-0 border border-[#4ECDC4]/30 group-hover:scale-105 transition-transform">
                        {currencyMode === 'AUD' ? '$' : '€'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="text-sm font-bold text-[#1A535C] dark:text-white truncate">
                            {exp.title}
                          </h5>
                          {exp.bookingRef && (
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
                              Ref: {exp.bookingRef}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#2D3436]/60 dark:text-slate-400 mt-0.5 font-medium flex-wrap">
                          <span>Paid by <strong className="text-[#1A535C] dark:text-slate-300 font-bold">{exp.paidBy}</strong></span>
                          <span>•</span>
                          <span>{formatDateAU(exp.date, 'numeric')}</span>
                          <span>•</span>
                          <span className="capitalize px-1.5 py-0.5 rounded-md bg-[#FFE66D]/30 dark:bg-slate-800 text-[10px] font-bold text-[#1A535C] dark:text-slate-300 border border-[#FFE66D]/40">
                            {exp.category}
                          </span>
                          {exp.splitBetween && exp.splitBetween.length > 0 && exp.splitBetween.length < trip.members.length && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              (Split {exp.splitBetween.length} ways)
                            </span>
                          )}
                        </div>

                        {exp.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic line-clamp-1">
                            "{exp.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-right flex-shrink-0">
                      <div>
                        <span className="text-base font-black text-[#1A535C] dark:text-[#4ECDC4] block">
                          {formatShortCurrency(amountPrimary, currencyMode, 0)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          ≈ {formatShortCurrency(amountSecondary, currencyMode === 'AUD' ? 'EUR' : 'AUD', 0)}
                        </span>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEditExpense) onEditExpense(exp);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF6B6B] hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        title="Edit expense details"
                      >
                        <Edit3 className="w-4 h-4 text-[#FF6B6B]" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete expense "${exp.title}"?`)) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs cursor-pointer transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        /* TICKETS & PASSES VAULT VIEW */
        <div className="space-y-6">
          
          <div className="flex items-center justify-between px-1">
            <div>
              <h4 className="text-base font-black font-display text-[#1A535C] dark:text-white">
                Confirmed Travel Tickets & Boarding Passes
              </h4>
              <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 mt-0.5 font-medium">
                Instant offline access to PNR codes, seat allocations, and confirmation references.
              </p>
            </div>

            <button
              onClick={onAddTicket}
              className="px-3.5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black flex items-center gap-1.5 shadow-sm shadow-[#FF6B6B]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map(tkt => (
              <div 
                key={tkt.id}
                className="bg-white dark:bg-[#1A282F] rounded-3xl p-5 border-2 border-[#4ECDC4]/40 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative boarding pass notches */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF9F2] dark:bg-slate-950 border-r-2 border-[#4ECDC4]/40 dark:border-slate-700" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFF9F2] dark:bg-slate-950 border-l-2 border-[#4ECDC4]/40 dark:border-slate-700" />

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#4ECDC4]/30 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] border border-[#4ECDC4]/30">
                        <Ticket className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="text-[10px] uppercase font-black text-[#FF6B6B] dark:text-[#FFE66D]">
                          {tkt.type} Reservation
                        </span>
                        <h5 className="text-base font-black text-[#1A535C] dark:text-white">
                          {tkt.title}
                        </h5>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTicket(tkt.id)}
                      className="text-slate-300 hover:text-[#FF6B6B] p-1 text-xs cursor-pointer"
                      title="Delete Ticket"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400 block uppercase font-bold">Valid Date & Time</span>
                      <span className="font-black text-[#1A535C] dark:text-slate-200">
                        {formatDateAU(tkt.validDate, 'medium')} {tkt.validTime ? `• ${tkt.validTime}` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400 block uppercase font-bold">Seat / Access Info</span>
                      <span className="font-black text-[#1A535C] dark:text-slate-200">
                        {tkt.seatInfo || 'General Admission / Family 4x'}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400 block uppercase font-bold">Passengers / Holders</span>
                      <span className="font-bold text-[#2D3436] dark:text-slate-300">
                        {tkt.holderNames?.join(', ') || 'Fazzalari Family'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barcode & Code Box */}
                <div className="pt-3 border-t border-dashed border-[#4ECDC4]/30 dark:border-slate-800 flex items-center justify-between bg-[#4ECDC4]/10 dark:bg-slate-800/60 -mx-5 -mb-5 p-4 rounded-b-3xl">
                  <div>
                    <span className="text-[10px] text-[#1A535C] dark:text-[#4ECDC4] font-black uppercase block">
                      Confirmation PNR Code
                    </span>
                    <span className="font-mono text-sm font-black text-[#1A535C] dark:text-white tracking-wider">
                      {tkt.confirmationCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(tkt.confirmationCode)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1A535C] hover:bg-[#224A52] text-[#FFE66D] text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    {copiedCode === tkt.confirmationCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#4ECDC4]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

