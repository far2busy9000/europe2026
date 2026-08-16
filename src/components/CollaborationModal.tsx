import React, { useState } from 'react';
import { 
  Users, Share2, Copy, Check, Sparkles, 
  Smartphone, Wifi, BellRing, Plus, UserCheck, ShieldCheck 
} from 'lucide-react';
import { TripData, FamilyMember } from '../types';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  onAddMember: (member: FamilyMember) => void;
  onSimulatePeerEdit: () => void;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  trip,
  onAddMember,
  onSimulatePeerEdit
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Friend');
  const [newMemberEmoji, setNewMemberEmoji] = useState('🏖️');

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}?tripRoom=${trip.roomCode}` 
    : `https://eurosummer.family/trip/${trip.roomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: FamilyMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      relation: newMemberRole,
      avatarColor: 'bg-amber-500',
      isOnline: true,
      avatarEmoji: newMemberEmoji
    };

    onAddMember(newMember);
    setNewMemberName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A535C]/60 backdrop-blur-xs p-3 sm:p-6 flex min-h-screen items-start justify-center py-6 sm:py-10 animate-fadeIn">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl border-2 border-[#FFE66D] dark:border-slate-800 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-display text-[#1A535C] dark:text-white">
                Family Multi-User Collaboration
              </h3>
              <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 font-medium">
                Sync itinerary edits, expenses & photos across all devices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#FF6B6B] text-lg font-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Share Room Code Box */}
        <div className="bg-gradient-to-r from-[#1A535C] to-[#224A52] rounded-2xl p-4 text-white space-y-2 border border-[#4ECDC4]/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-black text-[#FFE66D]">
              Family Sync Room Code
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFE66D] text-[#1A535C] font-mono font-black shadow-xs">
              {trip.roomCode}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            Share this link with your family group. Anyone with the code can view and edit the itinerary in real time.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/20 text-xs text-[#4ECDC4] font-mono select-all font-bold"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#E85A5A] text-white text-xs font-black flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer shadow-xs shadow-[#FF6B6B]/30"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Family Group Members Roster */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-slate-400">
              Active Group Members ({trip.members.length})
            </h4>
            <span className="text-[11px] text-[#4ECDC4] font-black flex items-center gap-1 bg-[#4ECDC4]/10 px-2 py-0.5 rounded-full border border-[#4ECDC4]/30">
              <Wifi className="w-3 h-3" /> Live Peer Sync Active
            </span>
          </div>

          <div className="divide-y divide-[#FFE66D]/40 dark:divide-slate-800 bg-[#FFF9F2] dark:bg-slate-800/50 rounded-2xl p-2 border border-[#FFE66D]/60 dark:border-slate-700">
            {trip.members.map(m => (
              <div key={m.id} className="py-2 px-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{m.avatarEmoji}</span>
                  <div>
                    <span className="font-bold text-[#1A535C] dark:text-slate-200 block">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-[#2D3436]/60 dark:text-slate-400">{m.relation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${m.isOnline ? 'bg-[#4ECDC4] animate-pulse' : 'bg-slate-400'}`} />
                  <span className="text-[11px] text-[#2D3436]/70 dark:text-slate-400 font-medium">
                    {m.isOnline ? 'Connected' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Family Member Form */}
        <form onSubmit={handleCreateMember} className="space-y-2 bg-[#FFF9F2] dark:bg-slate-800/40 p-3.5 rounded-2xl border border-[#FFE66D]/60 dark:border-slate-700">
          <span className="text-xs font-black text-[#1A535C] dark:text-slate-200 block">
            Add Group Member:
          </span>
          <div className="flex items-center gap-2">
            <select
              value={newMemberEmoji}
              onChange={e => setNewMemberEmoji(e.target.value)}
              className="p-1.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            >
              <option value="👨‍✈️">👨‍✈️</option>
              <option value="👩‍🎨">👩‍🎨</option>
              <option value="🏄‍♂️">🏄‍♂️</option>
              <option value="🍦">🍦</option>
              <option value="🏖️">🏖️</option>
              <option value="🤿">🤿</option>
            </select>

            <input
              type="text"
              placeholder="Name (e.g., Nonna Rosa, Uncle Dave)"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#1A535C] dark:text-slate-200 font-medium"
            />

            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-[#1A535C] hover:bg-[#224A52] text-[#FFE66D] text-xs font-black cursor-pointer shadow-xs"
            >
              Add
            </button>
          </div>
        </form>

        {/* Test Push Notifications Simulation */}
        <div className="bg-[#FFF9F2] dark:bg-slate-800/60 p-3.5 rounded-2xl border border-[#FFE66D]/60 dark:border-slate-700 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black text-[#1A535C] dark:text-slate-200 flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-[#FF6B6B]" /> Test Push Collaboration Alert
            </span>
            <p className="text-[11px] text-[#2D3436]/60 dark:text-slate-400 mt-0.5 font-medium">
              Simulate an incoming edit from another family member's phone.
            </p>
          </div>

          <button
            onClick={() => {
              onSimulatePeerEdit();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#FFE66D] hover:bg-[#FFE66D]/80 text-[#1A535C] text-xs font-black transition-all flex-shrink-0 cursor-pointer shadow-xs border border-[#FFE66D]"
          >
            Trigger Update ⚡
          </button>
        </div>

      </div>
    </div>
  );
};
