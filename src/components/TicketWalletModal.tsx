import React, { useState } from 'react';
import { 
  Ticket, Plane, Train, Landmark, Hotel, Compass, 
  Copy, Check, Search, X, Calendar, Clock, User, QrCode
} from 'lucide-react';
import { TripData, TicketItem } from '../types';
import { formatDateAU } from '../utils/date';

interface TicketWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
}

export const TicketWalletModal: React.FC<TicketWalletModalProps> = ({
  isOpen,
  onClose,
  trip
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  // Combine tickets from items and allTickets
  const itemTickets = trip.items.flatMap(it => it.tickets || []);
  const allTicketsMap = new Map<string, TicketItem>();
  
  (trip.allTickets || []).forEach(t => allTicketsMap.set(t.id, t));
  itemTickets.forEach(t => allTicketsMap.set(t.id, t));
  
  const allTicketsList = Array.from(allTicketsMap.values());

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredTickets = allTicketsList.filter(tkt => {
    if (filterType !== 'all' && tkt.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = tkt.title.toLowerCase().includes(q);
      const matchCode = tkt.confirmationCode.toLowerCase().includes(q);
      const matchNotes = (tkt.notes || '').toLowerCase().includes(q);
      return matchTitle || matchCode || matchNotes;
    }
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-4 h-4 text-blue-500" />;
      case 'train':
        return <Train className="w-4 h-4 text-emerald-600" />;
      case 'museum':
        return <Landmark className="w-4 h-4 text-amber-500" />;
      case 'hotel':
        return <Hotel className="w-4 h-4 text-purple-500" />;
      default:
        return <Compass className="w-4 h-4 text-[#FF6B6B]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 min-h-screen py-6 sm:py-10 animate-fadeIn">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#FFE66D]/70 dark:border-slate-800 space-y-4 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FFE66D] flex items-center justify-center text-white shadow-sm">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-display text-[#1A535C] dark:text-white">
                Family Trip Wallet & Passes
              </h3>
              <p className="text-xs text-[#2D3436]/70 dark:text-slate-400 font-medium">
                Instant access to boarding passes, train PNRs & museum tickets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Search */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by airline, train code, museum name or PNR..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-[#1A535C] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#1A535C] text-[#FFE66D]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Passes ({allTicketsList.length})
            </button>
            <button
              onClick={() => setFilterType('flight')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'flight'
                  ? 'bg-[#1A535C] text-[#FFE66D]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              ✈️ Flights
            </button>
            <button
              onClick={() => setFilterType('train')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'train'
                  ? 'bg-[#1A535C] text-[#FFE66D]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              🚆 Trains
            </button>
            <button
              onClick={() => setFilterType('museum')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'museum'
                  ? 'bg-[#1A535C] text-[#FFE66D]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              🏛️ Museums & Tours
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2.5 pr-1">
          {filteredTickets.map(tkt => (
            <div 
              key={tkt.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-[#4ECDC4] transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-2xs border border-slate-200 dark:border-slate-700 mt-0.5">
                    {getTypeIcon(tkt.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#1A535C] dark:text-white leading-tight">
                      {tkt.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-[#2D3436]/70 dark:text-slate-400 mt-1 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#FF6B6B]" /> {formatDateAU(tkt.validDate, 'medium')}
                      </span>
                      {tkt.validTime && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#4ECDC4]" /> {tkt.validTime}
                          </span>
                        </>
                      )}
                      {tkt.seatInfo && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[#1A535C] dark:text-slate-300">{tkt.seatInfo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Copy PNR Code Button */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-[#4ECDC4]/50 shadow-2xs text-center">
                    <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">PNR / CODE</span>
                    <span className="text-xs font-mono font-black text-[#FF6B6B] dark:text-[#FFE66D]">
                      {tkt.confirmationCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(tkt.confirmationCode)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#1A535C] dark:text-[#4ECDC4] hover:underline cursor-pointer"
                  >
                    {copiedCode === tkt.confirmationCode ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Notes & Passengers */}
              {tkt.notes && (
                <p className="text-xs text-[#2D3436]/80 dark:text-slate-300 bg-white/80 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                  💡 {tkt.notes}
                </p>
              )}

              {tkt.holderNames && tkt.holderNames.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#2D3436]/60 dark:text-slate-400">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="truncate font-medium">
                    Guests: {tkt.holderNames.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No passes matching "{searchTerm}".
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>All passes stored offline for instant check-in without roaming data.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1A535C] text-[#FFE66D] font-bold cursor-pointer hover:bg-[#144249]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
