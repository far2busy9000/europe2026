import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Sparkles, Sun, CloudSun, CloudRain, 
  Wind, Umbrella, Image as ImageIcon, Save, X, RotateCcw,
  RefreshCw, CloudLightning
} from 'lucide-react';
import { TripDay, WeatherData } from '../types';
import { fetchLiveWeatherForCity } from '../services/weatherService';
import { formatDayAndDateAU } from '../utils/date';

interface DayEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: TripDay | null;
  onSaveDay: (updatedDay: TripDay) => void;
}

const PHOTO_PRESETS = [
  { label: 'Naples / Amalfi', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rome / Colosseum', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Florence Duomo', url: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Venice Canal', url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Italian Beach / Sardinia', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'London Landmarks', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Calabria Coast', url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tuscan Countryside', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Italian Dining / Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80' }
];

export const DayEditModal: React.FC<DayEditModalProps> = ({
  isOpen,
  onClose,
  day,
  onSaveDay
}) => {
  const [themeTitle, setThemeTitle] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [summaryNotes, setSummaryNotes] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // Weather state
  const [temp, setTemp] = useState<number>(28);
  const [condition, setCondition] = useState<WeatherData['condition']>('Sunny');
  const [rainChance, setRainChance] = useState<number>(0);
  const [uvIndex, setUvIndex] = useState<number>(8);
  const [windSpeed, setWindSpeed] = useState<string>('10 km/h');
  const [packingTip, setPackingTip] = useState<string>('');
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [weatherFetchedMsg, setWeatherFetchedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (day) {
      setThemeTitle(day.themeTitle || '');
      setCity(day.city || '');
      setCountry(day.country || '');
      setSummaryNotes(day.summaryNotes || '');
      setCoverImage(day.coverImage || '');
      
      if (day.weather) {
        setTemp(day.weather.temp ?? 28);
        setCondition(day.weather.condition || 'Sunny');
        setRainChance(day.weather.rainChance ?? 0);
        setUvIndex(day.weather.uvIndex ?? 8);
        setWindSpeed(day.weather.windSpeed || '10 km/h');
        setPackingTip(day.weather.packingTip || '');
      }
      setWeatherFetchedMsg(null);
    }
  }, [day]);

  if (!isOpen || !day) return null;

  const handleFetchLiveWeather = async () => {
    if (!city) return;
    setFetchingWeather(true);
    setWeatherFetchedMsg(null);
    try {
      const live = await fetchLiveWeatherForCity(city, day.date);
      if (live) {
        setTemp(live.temp);
        setCondition(live.condition);
        setRainChance(live.rainChance ?? 0);
        setUvIndex(live.uvIndex ?? 6);
        setWindSpeed(live.windSpeed || '10 km/h');
        if (live.packingTip) {
          setPackingTip(live.packingTip);
        }
        setWeatherFetchedMsg(`Updated with live Open-Meteo forecast for ${city}!`);
      } else {
        setWeatherFetchedMsg(`Using seasonal European climate averages for ${city}.`);
      }
    } catch {
      setWeatherFetchedMsg(`Could not fetch live weather. Keep current forecast.`);
    } finally {
      setFetchingWeather(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedWeather: WeatherData = {
      temp: Number(temp),
      condition: condition as WeatherData['condition'],
      icon: condition === 'Rainy' || condition === 'Thunderstorm' ? 'CloudRain' : condition === 'Partly Cloudy' ? 'CloudSun' : condition === 'Breezy' ? 'Wind' : 'Sun',
      uvIndex: Number(uvIndex),
      rainChance: Number(rainChance),
      windSpeed,
      packingTip
    };

    const updatedDay: TripDay = {
      ...day,
      themeTitle: themeTitle.trim() || `Day ${day.dayNumber} in ${city || 'Europe'}`,
      city: city.trim() || 'Europe',
      country: country.trim() || 'Italy',
      summaryNotes: summaryNotes.trim(),
      coverImage: coverImage.trim(),
      weather: updatedWeather
    };

    onSaveDay(updatedDay);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A535C]/60 backdrop-blur-xs p-3 sm:p-6 flex min-h-screen items-start justify-center py-6 sm:py-10 animate-fadeIn">
      <div className="bg-white dark:bg-[#1A282F] rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border-2 border-[#FFE66D] dark:border-slate-800 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#FFE66D] text-[#1A535C] font-black text-sm shadow-xs">
              Day {day.dayNumber}
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-display text-[#1A535C] dark:text-white">
                Edit Day {day.dayNumber} Title & Details
              </h3>
              <p className="text-xs text-[#2D3436]/70 dark:text-slate-400 font-semibold">
                {formatDayAndDateAU(day.dayOfWeek, day.date, 'medium')} • Fully customizable content
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 flex items-center justify-center font-black transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Day Theme Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] mb-1.5">
              Day Title / Main Theme <span className="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              required
              value={themeTitle}
              onChange={(e) => setThemeTitle(e.target.value)}
              placeholder="e.g. Free day in Florence, Pompeii Guided Tour, Beach in Roccella..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-[#FFF9F2] dark:bg-slate-800 text-[#1A535C] dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            />
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" /> Destination City / Region <span className="text-[#FF6B6B]">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Naples, Florence, London, Roccella Ionica..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-[#FFF9F2] dark:bg-slate-800 text-[#1A535C] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Italy, United Kingdom, UAE..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-[#FFF9F2] dark:bg-slate-800 text-[#1A535C] dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              />
            </div>
          </div>

          {/* Day Summary & Notes */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] mb-1.5">
              Day Summary & Family Notes
            </label>
            <textarea
              rows={3}
              value={summaryNotes}
              onChange={(e) => setSummaryNotes(e.target.value)}
              placeholder="Write a summary of plans, dinner spots, transit instructions, or family notes for this day..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-[#FFF9F2] dark:bg-slate-800 text-[#1A535C] dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            />
          </div>

          {/* Waypoint & Packing Advice */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B6B]" /> Daily Waypoint Advice / Packing Tip
            </label>
            <input
              type="text"
              value={packingTip}
              onChange={(e) => setPackingTip(e.target.value)}
              placeholder="e.g. Bring sunhat, comfortable walking shoes for cobblestones, passport..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#FFE66D] dark:border-slate-700 bg-[#FFF9F2] dark:bg-slate-800 text-[#1A535C] dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            />
          </div>

          {/* Weather Settings */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#FF8E53]" /> Weather Forecast Settings
              </span>
              <button
                type="button"
                onClick={handleFetchLiveWeather}
                disabled={fetchingWeather || !city}
                className="px-2.5 py-1 rounded-lg bg-[#4ECDC4]/20 hover:bg-[#4ECDC4]/40 text-[#1A535C] dark:text-[#4ECDC4] text-[11px] font-bold flex items-center gap-1 border border-[#4ECDC4]/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${fetchingWeather ? 'animate-spin' : ''}`} />
                <span>{fetchingWeather ? 'Fetching Open-Meteo...' : 'Sync Live Weather'}</span>
              </button>
            </div>

            {weatherFetchedMsg && (
              <p className="text-[11px] font-semibold text-[#1A535C] dark:text-[#4ECDC4] bg-[#4ECDC4]/10 p-2 rounded-lg">
                🌤️ {weatherFetchedMsg}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Temp (°C)
                </label>
                <input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-[#1A535C] dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-[#1A535C] dark:text-white"
                >
                  <option value="Sunny">Sunny ☀️</option>
                  <option value="Clear Warm">Clear Warm 🌅</option>
                  <option value="Partly Cloudy">Partly Cloudy ⛅</option>
                  <option value="Breezy">Breezy 💨</option>
                  <option value="Rainy">Rainy 🌧️</option>
                  <option value="Thunderstorm">Thunderstorm ⛈️</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Rain Chance (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rainChance}
                  onChange={(e) => setRainChance(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-[#1A535C] dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  UV Index (1-12)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={uvIndex}
                  onChange={(e) => setUvIndex(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-[#1A535C] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Cover Photo URL & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#1A535C] dark:text-[#FFE66D] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#FF6B6B]" /> Cover Photo URL
              </label>
            </div>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-[#1A535C] dark:text-white mb-2"
            />

            {/* Presets Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Themes:</span>
              {PHOTO_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverImage(p.url)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FFE66D]/20 hover:bg-[#FFE66D]/50 text-[#1A535C] dark:text-[#FFE66D] border border-[#FFE66D]/50 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:opacity-95 text-white text-xs font-black shadow-md shadow-[#FF6B6B]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Day Details</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

