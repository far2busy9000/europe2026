import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Wifi, WifiOff, Users, Calendar, 
  FileSpreadsheet, Download, PlusCircle, Sparkles, CheckCircle2,
  Ticket, ShieldAlert, MoreVertical, X, Bell, Globe
} from 'lucide-react';
import { TripData, CollaborationNotification } from '../types';
import { downloadICSFile } from '../services/icsExport';
import { CurrencyMode } from '../utils/currency';
import { formatDateRangeAU } from '../utils/date';

interface NavbarProps {
  trip: TripData;
  activeTab: 'day' | 'overview' | 'expenses';
  setActiveTab: (tab: 'day' | 'overview' | 'expenses') => void;
  selectedDayIndex: number;
  currencyMode: CurrencyMode;
  setCurrencyMode: (mode: CurrencyMode) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenWallet: () => void;
  onOpenEmergency: () => void;
  onOpenCsvModal: () => void;
  onOpenCollabModal: () => void;
  onOpenAddItemModal: () => void;
  notifications: CollaborationNotification[];
}

export const Navbar: React.FC<NavbarProps> = ({
  trip,
  activeTab,
  setActiveTab,
  selectedDayIndex,
  currencyMode,
  setCurrencyMode,
  darkMode,
  setDarkMode,
  onOpenWallet,
  onOpenEmergency,
  onOpenCsvModal,
  onOpenCollabModal,
  onOpenAddItemModal,
  notifications
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [syncedToast, setSyncedToast] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncedToast(true);
      setTimeout(() => setSyncedToast(false), 3000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1A282F]/95 backdrop-blur-md border-b border-[#FFE66D]/60 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Banner / Sync alert */}
      {syncedToast && (
        <div className="bg-[#4ECDC4] text-[#1A535C] text-xs py-1 px-4 text-center font-bold flex items-center justify-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Connection active! Offline itinerary synced across family devices.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Left: Brand Identity & Title */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#FF6B6B] via-[#FF8E53] to-[#FFE66D] flex items-center justify-center shadow-md shadow-[#FF6B6B]/25 text-white flex-shrink-0">
              <span className="text-base sm:text-lg">☀️</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base md:text-lg font-black font-display text-[#1A535C] dark:text-white tracking-tight leading-tight whitespace-nowrap truncate">
                  EUROPE TRIP 2026
                </h1>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black bg-[#FFE66D]/50 dark:bg-[#FFE66D]/20 text-[#1A535C] dark:text-[#FFE66D] border border-[#FFE66D]">
                  45 Days
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#2D3436]/60 dark:text-slate-400 font-semibold truncate hidden sm:block">
                {formatDateRangeAU(trip.startDate, trip.endDate)} • Italy, UK & Sardinia
              </p>
            </div>
          </div>

          {/* Right Action Controls: Clean, spacious, touch-friendly */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Universal Currency Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                onClick={() => setCurrencyMode('AUD')}
                className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  currencyMode === 'AUD'
                    ? 'bg-[#FF6B6B] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Display all prices in Australian Dollars ($ AUD)"
              >
                <span>$ AUD</span>
              </button>
              <button
                onClick={() => setCurrencyMode('EUR')}
                className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  currencyMode === 'EUR'
                    ? 'bg-[#1A535C] text-[#FFE66D] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Display all prices in Euros (€ EUR)"
              >
                <span>€ EUR</span>
              </button>
            </div>

            {/* Quick Wallet / Passes Button */}
            <button
              onClick={onOpenWallet}
              title="Open Passes & Booking Codes Wallet"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#FFE66D]/30 hover:bg-[#FFE66D]/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A535C] dark:text-[#FFE66D] border border-[#FFE66D]/70 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-[#FF6B6B]" />
              <span className="hidden sm:inline font-black">Passes</span>
            </button>

            {/* Desktop Only Extra Buttons */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Family Collaboration Button */}
              <button
                onClick={onOpenCollabModal}
                title="Family Collaboration & Live Sync"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#FFE66D]/40 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A535C] dark:text-[#FFE66D] border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span className="font-bold">Family ({trip.members.length})</span>
              </button>

              {/* Add Stop Button */}
              <button
                onClick={onOpenAddItemModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black shadow-xs shadow-[#FF6B6B]/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Stop</span>
              </button>
            </div>

            {/* Trip Controls Menu Toggle (Houses Safety, Dark Mode, Collab, CSV, ICS) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-[#FFE66D]/40 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A535C] dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                title="Trip Controls & Settings"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1A282F] rounded-2xl shadow-2xl border border-[#FFE66D]/60 dark:border-slate-700 p-3 z-50 animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-white">Trip Controls & Tools</span>
                    <button 
                      onClick={() => setShowMobileMenu(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dark Mode / Light Mode Toggle */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-[#1A535C] dark:text-slate-200 bg-slate-100 hover:bg-[#FFE66D]/30 dark:bg-slate-800/90 dark:hover:bg-slate-700/80 flex items-center justify-between cursor-pointer transition-all border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      {darkMode ? <Sun className="w-4 h-4 text-[#FFE66D]" /> : <Moon className="w-4 h-4 text-[#1A535C]" />}
                      <span>Appearance Mode</span>
                    </div>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      {darkMode ? '🌙 Night' : '☀️ Sunny'}
                    </span>
                  </button>

                  {/* Trip Safety & Emergency Numbers */}
                  <button
                    onClick={() => {
                      onOpenEmergency();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-red-700 dark:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/80 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Trip Safety & Emergency Numbers</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200">
                      112 / 999
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenAddItemModal();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#FF6B6B] hover:bg-[#E85A5A] flex items-center justify-between cursor-pointer"
                  >
                    <span>Add Itinerary Stop</span>
                    <PlusCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenCollabModal();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1A535C] dark:text-slate-200 hover:bg-[#FFE66D]/20 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>Family Collaboration ({trip.members.length})</span>
                    <Users className="w-4 h-4 text-[#FF6B6B]" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenCsvModal();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1A535C] dark:text-slate-200 hover:bg-[#FFE66D]/20 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>Import / Export CSV</span>
                    <FileSpreadsheet className="w-4 h-4 text-[#4ECDC4]" />
                  </button>

                  <button
                    onClick={() => {
                      downloadICSFile(trip);
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#1A535C] dark:text-slate-200 hover:bg-[#FFE66D]/20 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>Export Calendar (.ics)</span>
                    <Calendar className="w-4 h-4 text-[#FF8E53]" />
                  </button>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2 text-[11px] text-slate-400 font-semibold">
                    <span>{isOnline ? '🟢 Online Sync' : '🟡 Offline Ready'}</span>
                    <span>{trip.days.length} Days Total</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Streamlined Primary Navigation (3 Tabs: Daily, Trip Calendar, Expenses & Tix) - Fully readable on all screens */}
        <nav className="flex items-center gap-1.5 sm:gap-2 py-2 border-t border-[#FFE66D]/40 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('day')}
            className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'day'
                ? 'bg-[#FF6B6B] text-white shadow-sm shadow-[#FF6B6B]/30'
                : 'text-[#1A535C] dark:text-slate-300 hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-xs sm:text-sm">📅</span>
            <span>Daily</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-[1.2] py-2 px-1.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#FF6B6B] text-white shadow-sm shadow-[#FF6B6B]/30'
                : 'text-[#1A535C] dark:text-slate-300 hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-xs sm:text-sm">🗓️</span>
            <span>Trip Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-[1.2] py-2 px-1.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'bg-[#FF6B6B] text-white shadow-sm shadow-[#FF6B6B]/30'
                : 'text-[#1A535C] dark:text-slate-300 hover:bg-[#FFE66D]/30 dark:hover:bg-slate-800'
            }`}
          >
            <span className="text-xs sm:text-sm">💶</span>
            <span>Expenses & Tix</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
