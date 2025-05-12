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
  try {
    const stored = Cookies.get('user');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      profile_picture: parsed.profile_picture || defaultAvatar
    };
  } catch (e) {
    console.error('Failed to parse user from cookies', e);
    return null;
  }
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
      if (updates.password) merged.password = updates.password;
      if (updates.username) merged.username = updates.username;
      if (updates.email) merged.email = updates.email;
      if (updates.full_name) merged.full_name = updates.full_name;

      return { user: merged };
    });
 
    syncCookies(get());
    return get().user;
  },

  setTokens: ({ accessToken, refreshToken }) => {
    set({ accessToken, refreshToken });
    syncCookies(get());
  },
}));
