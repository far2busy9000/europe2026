import { WeatherData } from '../types';

export interface CityCoord {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export const DESTINATION_COORDINATES: Record<string, CityCoord> = {
  'Adelaide': { lat: -34.9285, lng: 138.6007, name: 'Adelaide', country: 'Australia' },
  'Dubai': { lat: 25.2048, lng: 55.2708, name: 'Dubai', country: 'UAE' },
  'Naples': { lat: 40.8518, lng: 14.2681, name: 'Naples', country: 'Italy' },
  'Roccella Ionica': { lat: 38.3228, lng: 16.4025, name: 'Roccella Ionica', country: 'Italy' },
  'Montesarchio': { lat: 41.0664, lng: 14.6433, name: 'Montesarchio', country: 'Italy' },
  'Sperlonga': { lat: 41.2583, lng: 13.4339, name: 'Sperlonga', country: 'Italy' },
  'Rome': { lat: 41.9028, lng: 12.4964, name: 'Rome', country: 'Italy' },
  'Florence': { lat: 43.7696, lng: 11.2558, name: 'Florence', country: 'Italy' },
  'Pisa': { lat: 43.7228, lng: 10.4017, name: 'Pisa', country: 'Italy' },
  'Modena': { lat: 44.6471, lng: 10.9252, name: 'Modena', country: 'Italy' },
  'Maranello': { lat: 44.5264, lng: 10.8661, name: 'Maranello', country: 'Italy' },
  'Montebelluna': { lat: 45.7761, lng: 12.0469, name: 'Montebelluna', country: 'Italy' },
  'Treviso': { lat: 45.6669, lng: 12.2430, name: 'Treviso', country: 'Italy' },
  'Venice': { lat: 45.4408, lng: 12.3155, name: 'Venice', country: 'Italy' },
  'London': { lat: 51.5074, lng: -0.1278, name: 'London', country: 'United Kingdom' },
  'Golfo Aranci': { lat: 40.9998, lng: 9.6158, name: 'Golfo Aranci', country: 'Italy' },
  'Fiumicino': { lat: 41.7735, lng: 12.2319, name: 'Fiumicino', country: 'Italy' }
};

function weatherCodeToCondition(code: number): { condition: WeatherData['condition']; icon: WeatherData['icon'] } {
  if (code === 0) return { condition: 'Sunny', icon: 'Sun' };
  if (code === 1 || code === 2) return { condition: 'Clear Warm', icon: 'Sun' };
  if (code === 3) return { condition: 'Partly Cloudy', icon: 'CloudSun' };
  if (code >= 45 && code <= 48) return { condition: 'Partly Cloudy', icon: 'CloudSun' };
  if (code >= 51 && code <= 67) return { condition: 'Rainy', icon: 'CloudRain' };
  if (code >= 80 && code <= 82) return { condition: 'Rainy', icon: 'CloudRain' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: 'CloudRain' };
  return { condition: 'Sunny', icon: 'Sun' };
}

const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Fetches real-time / forecasted meteorological data from Open-Meteo API
 * (Free, open-source global meteorological API with no key required)
 */
export async function fetchLiveWeatherForCity(cityName: string, targetDate?: string): Promise<WeatherData | null> {
  const coord = DESTINATION_COORDINATES[cityName] || Object.values(DESTINATION_COORDINATES).find(
    c => cityName.toLowerCase().includes(c.name.toLowerCase())
  );

  if (!coord) return null;

  const cacheKey = `${coord.name}_${targetDate || 'current'}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=auto`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API request failed');

    const json = await res.json();
    
    // Check if targetDate matches any daily forecast index (Open-Meteo gives 7-14 days)
    let temp = Math.round(json.current?.temperature_2m ?? 24);
    let conditionCode = json.current?.weather_code ?? 0;
    let uvIndex = 6;
    let rainChance = 0;
    let windSpeed = `${Math.round(json.current?.wind_speed_10m ?? 10)} km/h`;

    if (json.daily && targetDate && json.daily.time) {
      const dayIdx = json.daily.time.indexOf(targetDate);
      if (dayIdx !== -1) {
        temp = Math.round(json.daily.temperature_2m_max[dayIdx] ?? temp);
        conditionCode = json.daily.weather_code[dayIdx] ?? conditionCode;
        uvIndex = Math.round(json.daily.uv_index_max[dayIdx] ?? 6);
        rainChance = Math.round(json.daily.precipitation_probability_max[dayIdx] ?? 0);
      }
    } else if (json.daily?.temperature_2m_max?.[0]) {
      temp = Math.round(json.daily.temperature_2m_max[0]);
      uvIndex = Math.round(json.daily.uv_index_max?.[0] ?? 6);
      rainChance = Math.round(json.daily.precipitation_probability_max?.[0] ?? 0);
    }

    const { condition, icon } = weatherCodeToCondition(conditionCode);

    const result: WeatherData = {
      temp,
      condition,
      icon,
      uvIndex,
      rainChance,
      windSpeed,
      packingTip: `Live Open-Meteo forecast for ${coord.name}: ${condition}, ${temp}°C.`
    };

    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.warn(`Could not fetch live weather for ${cityName}:`, err);
    return null;
  }
}
