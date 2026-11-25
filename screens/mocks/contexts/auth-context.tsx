import type { ReactNode } from 'react';

import { fixture } from '@screens/fixture';

const idle = async () => {};

export function useAuth() {
  const { user = null, role = 'client' } = fixture();
  return {
    session: user ? { status: 'authenticated', user, role } : { status: 'signed_out' },
    isAuthenticated: Boolean(user),
    isLoading: false,
    login: idle,
    loginWithGoogle: idle,
    loginWithApple: idle,
    logout: idle,
    refreshAuth: idle,
    retrySession: idle,
    error: null,
    clearError: () => {},
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => children;
