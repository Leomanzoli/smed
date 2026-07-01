import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  consent: boolean;
  acceptConsent: () => void;
  revokeConsent: () => void;
}

// LGPD consent flag, persisted locally.
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      consent: false,
      acceptConsent: () => set({ consent: true }),
      revokeConsent: () => set({ consent: false }),
    }),
    { name: 'smed-settings' },
  ),
);
