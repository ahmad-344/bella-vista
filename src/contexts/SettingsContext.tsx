import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { RESTAURANT_INFO } from '../data/restaurantData';

export interface SiteSettings {
  restaurant_name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours_mon_thu: string;
  hours_fri_sat: string;
  hours_sun: string;
  map_label: string;
  map_lat: string;
  map_lng: string;
  instagram_url: string;
  facebook_url: string;
  x_url: string;
  [key: string]: string;
}

const DEFAULT: SiteSettings = {
  restaurant_name: RESTAURANT_INFO.name,
  tagline:         RESTAURANT_INFO.tagline,
  address:         RESTAURANT_INFO.address,
  phone:           RESTAURANT_INFO.phone,
  whatsapp:        RESTAURANT_INFO.whatsapp,
  email:           RESTAURANT_INFO.email,
  hours_mon_thu:   RESTAURANT_INFO.hours.monThu,
  hours_fri_sat:   RESTAURANT_INFO.hours.friSat,
  hours_sun:       RESTAURANT_INFO.hours.sun,
  map_label:       'Blue Area, Islamabad',
  map_lat:         '33.7215',
  map_lng:         '73.0433',
  instagram_url:   '',
  facebook_url:    '',
  x_url:           '',
};

interface SettingsCtx {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const Ctx = createContext<SettingsCtx>({
  settings: DEFAULT,
  refreshSettings: async () => {},
  loading: false,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT);
  const [loading,  setLoading]  = useState(true);

  const refreshSettings = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data } = await supabase.from('settings').select('*');
      if (data && data.length > 0) {
        const map: Record<string,string> = {};
        data.forEach((r: { key:string; value:string }) => { map[r.key] = r.value; });
        setSettings(prev => ({ ...prev, ...map }));
      }
    } catch { /* use defaults */ }
    setLoading(false);
  }, []);

  useEffect(() => { refreshSettings(); }, [refreshSettings]);

  return (
    <Ctx.Provider value={{ settings, refreshSettings, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSettings = () => useContext(Ctx);
