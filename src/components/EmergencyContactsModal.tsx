import React, { useState } from 'react';
import { 
  ShieldAlert, Phone, MapPin, X, ExternalLink, 
  Building2, Plane, HeartPulse, AlertCircle, Copy, Check
} from 'lucide-react';

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyContactsModal: React.FC<EmergencyContactsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 min-h-screen py-6 sm:py-10 animate-fadeIn">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#FF6B6B]/70 dark:border-slate-800 space-y-4 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-display text-[#1A535C] dark:text-white">
                Trip Safety & Emergency Contacts
              </h3>
              <p className="text-xs text-[#2D3436]/70 dark:text-slate-400 font-medium">
                1-tap emergency hotlines, embassies & hotel contacts
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

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          
          {/* Quick Universal Emergency Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl border border-red-200 dark:border-red-800/60 space-y-1">
              <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 block">
                🇮🇹 Italy Universal
              </span>
              <a href="tel:112" className="text-lg font-black text-red-700 dark:text-red-300 flex items-center gap-1.5 hover:underline">
                <Phone className="w-4 h-4" /> 112
              </a>
              <span className="text-[11px] text-red-600/80 dark:text-red-400 block">
                Carabinieri & Pronto Soccorso
              </span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200 dark:border-blue-800/60 space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block">
                🇬🇧 UK Universal
              </span>
              <a href="tel:999" className="text-lg font-black text-blue-700 dark:text-blue-300 flex items-center gap-1.5 hover:underline">
                <Phone className="w-4 h-4" /> 999 (or 111)
              </a>
              <span className="text-[11px] text-blue-600/80 dark:text-blue-400 block">
                Police, Fire & NHS Medical
              </span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block">
                🇦🇺 AU 24/7 Consular
              </span>
              <a href="tel:+61262613305" className="text-sm font-black text-amber-700 dark:text-amber-300 flex items-center gap-1 hover:underline">
                <Phone className="w-3.5 h-3.5" /> +61 2 6261 3305
              </a>
              <span className="text-[10px] text-amber-600/80 dark:text-amber-400 block">
                DFAT Canberra 24h Assistance
              </span>
            </div>
          </div>

          {/* Australian Embassies */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#4ECDC4] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FF6B6B]" /> Australian Embassies & Missions
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-[#1A535C] dark:text-white block">Australian Embassy Rome</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Via Antonio Bosio, 5, 00161 Roma</span>
                <a href="tel:+3906852721" className="text-xs font-bold text-[#FF6B6B] flex items-center gap-1 mt-1 hover:underline">
                  <Phone className="w-3 h-3" /> +39 06 852721
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-[#1A535C] dark:text-white block">Australian High Commission London</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Australia House, Strand, London WC2B 4LA</span>
                <a href="tel:+442078875777" className="text-xs font-bold text-[#FF6B6B] flex items-center gap-1 mt-1 hover:underline">
                  <Phone className="w-3 h-3" /> +44 20 7887 5777
                </a>
              </div>
            </div>
          </div>

          {/* Accommodation Check-in & Host Numbers */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" /> Accommodation & Host Contacts
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1A535C] dark:text-white">Starhotels Termini (Naples)</span>
                  <span className="text-[11px] text-slate-500 block">Piazza Garibaldi 91</span>
                </div>
                <a href="tel:+390812208111" className="px-2 py-1 rounded-lg bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] font-bold text-[11px] hover:bg-[#4ECDC4]/30 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Call
                </a>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1A535C] dark:text-white">Florence Flat La Casa di Luna</span>
                  <span className="text-[11px] text-slate-500 block">Via Faenza 18, 50123 Florence</span>
                </div>
                <a href="tel:+393383484695" className="px-2 py-1 rounded-lg bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] font-bold text-[11px] hover:bg-[#4ECDC4]/30 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Call Host
                </a>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1A535C] dark:text-white">Modena Pallamaglio Suites</span>
                  <span className="text-[11px] text-slate-500 block">Via Pallamaglio 8, 41121 Modena</span>
                </div>
                <a href="tel:+393472201888" className="px-2 py-1 rounded-lg bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] font-bold text-[11px] hover:bg-[#4ECDC4]/30 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Call Host
                </a>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1A535C] dark:text-white">Park Avenue Bayswater (London)</span>
                  <span className="text-[11px] text-slate-500 block">42-44 Queensborough Terrace, London W2 3BY</span>
                </div>
                <a href="tel:+442072290881" className="px-2 py-1 rounded-lg bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] font-bold text-[11px] hover:bg-[#4ECDC4]/30 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Call Desk
                </a>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-[#1A535C] dark:text-white">Hotel Villa Margherita (Sardinia)</span>
                  <span className="text-[11px] text-slate-500 block">Via Camillo Benso Conte di Cavour 13, Golfo Aranci</span>
                </div>
                <a href="tel:+39078946900" className="px-2 py-1 rounded-lg bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] font-bold text-[11px] hover:bg-[#4ECDC4]/30 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Call Desk
                </a>
              </div>
            </div>
          </div>

          {/* Airlines 24/7 Lines */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#4ECDC4] flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-blue-500" /> Airline Support Hotlines
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Emirates</span>
                <span className="text-[10px] text-slate-400 block">Booking: FEQ2ND</span>
                <a href="tel:+611300303777" className="font-bold text-[#FF6B6B] block mt-0.5">1300 303 777</a>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">British Airways</span>
                <span className="text-[10px] text-slate-400 block">Booking: XSD2LV</span>
                <a href="tel:+443444930787" className="font-bold text-[#FF6B6B] block mt-0.5">+44 344 493 0787</a>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">EasyJet</span>
                <span className="text-[10px] text-slate-400 block">Booking: KCRW4M7</span>
                <a href="tel:+443305515151" className="font-bold text-[#FF6B6B] block mt-0.5">+44 330 551 5151</a>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Aeroitalia</span>
                <span className="text-[10px] text-slate-400 block">Booking: W9WBJW</span>
                <a href="tel:+390698240800" className="font-bold text-[#FF6B6B] block mt-0.5">+39 06 9824 0800</a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Available 100% offline at all times.</span>
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
