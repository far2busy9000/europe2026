import React, { useState } from 'react';
import { 
  FileSpreadsheet, Upload, Download, Check, AlertCircle, 
  Table, Sparkles, FileText, ArrowRight 
} from 'lucide-react';
import { TripData } from '../types';
import { parseCSV, generateCSVTemplate, exportTripToCSV } from '../services/csvService';

interface CsvImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData;
  onImportTripData: (importedData: Partial<TripData>, mode: 'replace' | 'append') => void;
}

export const CsvImportExportModal: React.FC<CsvImportExportModalProps> = ({
  isOpen,
  onClose,
  trip,
  onImportTripData
}) => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<Partial<TripData> | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const readFile = (file: File) => {
    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      tryParse(text);
    };
    reader.onerror = () => setErrorMsg('Failed to read CSV file.');
    reader.readAsText(file);
  };

  const tryParse = (text: string) => {
    try {
      const parsed = parseCSV(text);
      if (!parsed.items || parsed.items.length === 0) {
        throw new Error('No valid itinerary items found in the CSV.');
      }
      setParsedPreview(parsed);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error parsing CSV structure.');
      setParsedPreview(null);
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'EuroSummer_Itinerary_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCurrent = () => {
    const csvData = exportTripToCSV(trip);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${trip.title.replace(/\s+/g, '_')}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmImport = () => {
    if (!parsedPreview) return;
    onImportTripData(parsedPreview, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A535C]/60 backdrop-blur-xs p-3 sm:p-6 flex min-h-screen items-start justify-center py-6 sm:py-10 animate-fadeIn">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border-2 border-[#FFE66D] dark:border-slate-800 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#4ECDC4]/20 text-[#1A535C] dark:text-[#4ECDC4] border border-[#4ECDC4]/30">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-display text-[#1A535C] dark:text-white">
                CSV Itinerary Sync & Importer
              </h3>
              <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 font-medium">
                Upload your family travel spreadsheet or export your current itinerary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#FF6B6B] text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Action Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="p-3.5 rounded-2xl bg-[#FFF9F2] hover:bg-[#FFE66D]/30 dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#FFE66D] dark:border-slate-700 text-left transition-all flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-xs font-black text-[#1A535C] dark:text-[#FFE66D] block">
                📄 Download Sample CSV Template
              </span>
              <span className="text-[11px] text-[#2D3436]/70 dark:text-slate-400 font-medium">
                Clean template with Day, Time, Destination & Cost
              </span>
            </div>
            <Download className="w-4 h-4 text-[#FF6B6B]" />
          </button>

          <button
            onClick={handleExportCurrent}
            className="p-3.5 rounded-2xl bg-[#4ECDC4]/10 hover:bg-[#4ECDC4]/20 dark:bg-slate-800 dark:hover:bg-slate-700 border border-[#4ECDC4]/40 dark:border-slate-700 text-left transition-all flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="text-xs font-black text-[#1A535C] dark:text-[#4ECDC4] block">
                💾 Export Current Itinerary (.csv)
              </span>
              <span className="text-[11px] text-[#2D3436]/70 dark:text-slate-400 font-medium">
                Backup all {trip.items.length} stops, notes & expenses
              </span>
            </div>
            <Download className="w-4 h-4 text-[#1A535C] dark:text-[#4ECDC4]" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
            dragOver
              ? 'border-[#4ECDC4] bg-[#4ECDC4]/15 dark:bg-[#4ECDC4]/20'
              : 'border-[#FFE66D] dark:border-slate-700 hover:border-[#FF6B6B] bg-[#FFF9F2] dark:bg-slate-800/40'
          }`}
        >
          <Upload className="w-8 h-8 text-[#FF6B6B] mx-auto mb-2" />
          <h4 className="text-sm font-black text-[#1A535C] dark:text-slate-200">
            Drag & Drop your Itinerary CSV file here
          </h4>
          <p className="text-xs text-[#2D3436]/60 dark:text-slate-400 mt-1 font-medium">
            or click to browse your computer or mobile documents
          </p>
          <label className="mt-3 inline-block px-4 py-2 rounded-xl bg-[#1A535C] hover:bg-[#224A52] text-[#FFE66D] text-xs font-black cursor-pointer transition-all shadow-xs">
            Choose CSV File
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FF6B6B]/15 dark:bg-[#FF6B6B]/20 border border-[#FF6B6B]/40 text-xs text-[#FF6B6B] flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedPreview && (
          <div className="space-y-3 bg-[#FFF9F2] dark:bg-slate-800/60 p-4 rounded-2xl border border-[#FFE66D] dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1A535C] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#4ECDC4]" />
                Parsed {parsedPreview.items?.length} stops across {parsedPreview.days?.length} days
              </span>
              <span className="text-[11px] text-[#4ECDC4] font-black">
                ✓ Ready to Import
              </span>
            </div>

            {/* Mini preview list */}
            <div className="max-h-40 overflow-y-auto divide-y divide-[#FFE66D]/40 dark:divide-slate-700 text-xs font-medium">
              {parsedPreview.items?.slice(0, 5).map((it, idx) => (
                <div key={idx} className="py-1.5 flex items-center justify-between">
                  <span className="font-bold text-[#1A535C] dark:text-slate-200">
                    Day {(it.dayIndex ?? 0) + 1}: {it.title}
                  </span>
                  <span className="text-[#2D3436]/60 dark:text-slate-400 font-mono text-[11px]">{it.time}</span>
                </div>
              ))}
              {(parsedPreview.items?.length || 0) > 5 && (
                <div className="text-[10px] text-[#2D3436]/50 dark:text-slate-400 py-1 font-bold">
                  +{(parsedPreview.items?.length || 0) - 5} additional stops...
                </div>
              )}
            </div>

            {/* Import Mode: Replace vs Append */}
            <div className="flex items-center gap-4 pt-2 border-t border-[#FFE66D]/50 dark:border-slate-700 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-[#1A535C] dark:text-slate-300 font-bold">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="accent-[#FF6B6B]"
                />
                <span>Replace Current Itinerary</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-[#1A535C] dark:text-slate-300 font-bold">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="accent-[#FF6B6B]"
                />
                <span>Append to Existing Itinerary</span>
              </label>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            disabled={!parsedPreview}
            onClick={handleConfirmImport}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              parsedPreview
                ? 'bg-[#FF6B6B] hover:bg-[#E85A5A] text-white shadow-md shadow-[#FF6B6B]/25 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Import Data into Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
