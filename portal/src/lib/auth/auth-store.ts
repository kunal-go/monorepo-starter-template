import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  isInitialized: boolean
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
  setInitialized: (initialized: boolean) => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isInitialized: false,

  setAccessToken: (token: string) => {
    set({ accessToken: token })
  },

  clearAccessToken: () => {
    set({ accessToken: null })
  },

  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized })
  },

  isAuthenticated: () => {
    return !!get().accessToken
  },
}))
