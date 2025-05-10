import {create} from 'zustand';
import Cookies from 'js-cookie';
import defaultAvatar from '@/assets/images/avatar.jpg';

const syncCookies = (state) => {
  const { accessToken, refreshToken, user } = state;

  if (accessToken) Cookies.set('accessToken', accessToken);
  else Cookies.remove('accessToken');

  if (refreshToken) Cookies.set('refreshToken', refreshToken);
  else Cookies.remove('refreshToken');

  if (user) Cookies.set('user', JSON.stringify(user));
  else Cookies.remove('user');
};

export const useAuthStore = create((set, get) => ({
  accessToken: Cookies.get('accessToken') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  user: (() => {
    const stored = Cookies.get('user');
    if (!stored) return null;
    const u = JSON.parse(stored);
    if (!u.profile_picture) u.profile_picture = defaultAvatar;
    return u;
  })(),

  login: ({ accessToken, refreshToken, user }) => {
    const profileUser = {
      ...user,
      profile_picture: user.profile_picture || defaultAvatar,
    };
    set({ accessToken, refreshToken, user: profileUser });
    syncCookies(get());
  },

  logout: () => {
    set({ accessToken: null, refreshToken: null, user: null });
    syncCookies(get());
  },
  
  updateUser: (updates) => {
    set((state) => {
      const merged = { ...state.user, ...updates };
      if (!merged.profile_picture) merged.profile_picture = defaultAvatar;
      return { user: merged };
    });
    syncCookies(get());
  },

  setTokens: ({ accessToken, refreshToken }) => {
    set({ accessToken, refreshToken });
    syncCookies(get());
  },
}));
