import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Custom storage adapter for React Native using SecureStore
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function uploadCheckinPhoto(localUri: string, checkinId: string): Promise<string | null> {
    try {
        const fileName = `checkins/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

        // Read as base64 — fetch().blob() returns empty in React Native
        const base64 = await FileSystem.readAsStringAsync(localUri, {
            encoding: 'base64',
        });

        // Convert base64 to Uint8Array
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const { data, error } = await supabase.storage
            .from('checkin-photos')
            .upload(fileName, bytes, { contentType: 'image/jpeg', upsert: false });

        if (error || !data) {
            console.error('[upload] storage error:', error);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('checkin-photos')
            .getPublicUrl(data.path);

        // Save to checkin_media table
        const { error: mediaError } = await supabase
            .from('checkin_media')
            .insert({ checkin_id: checkinId, media_url: publicUrl, media_type: 'image' });

        if (mediaError) console.error('[upload] media insert error:', mediaError);

        return publicUrl;
    } catch (e) {
        console.error('[upload] error:', e);
        return null;
    }
}
