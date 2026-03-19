'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { sdk } from '@/lib/medusa';
import { MEDUSA_BACKEND_URL } from '@/lib/config';

interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface AuthContextValue {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendAvailable: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Beim Start: prüfen ob bereits eingeloggt
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const healthResponse = await fetch(`${MEDUSA_BACKEND_URL}/health`, {
          signal: AbortSignal.timeout(3000),
        });
        if (!healthResponse.ok) throw new Error('Backend not healthy');
        setBackendAvailable(true);

        // Versuche bestehende Session zu laden
        try {
          const response = await sdk.store.customer.retrieve();
          if (response.customer) {
            setCustomer({
              id: response.customer.id,
              email: response.customer.email,
              first_name: response.customer.first_name ?? null,
              last_name: response.customer.last_name ?? null,
            });
          }
        } catch {
          // Nicht eingeloggt — kein Fehler
          setCustomer(null);
        }
      } catch {
        setBackendAvailable(false);
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await sdk.auth.login('customer', 'emailpass', {
          email,
          password,
        });

        // Kundenprofil laden
        const response = await sdk.store.customer.retrieve();
        if (response.customer) {
          setCustomer({
            id: response.customer.id,
            email: response.customer.email,
            first_name: response.customer.first_name ?? null,
            last_name: response.customer.last_name ?? null,
          });
        }
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Login fehlgeschlagen';
        return { success: false, error: message };
      }
    },
    []
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        // 1. Auth-Account erstellen
        const token = await sdk.auth.register('customer', 'emailpass', {
          email: data.email,
          password: data.password,
        });

        if (!token) {
          return { success: false, error: 'Registrierung fehlgeschlagen' };
        }

        // 2. Kundenprofil erstellen
        const response = await sdk.store.customer.create({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        });

        if (response.customer) {
          setCustomer({
            id: response.customer.id,
            email: response.customer.email,
            first_name: response.customer.first_name ?? null,
            last_name: response.customer.last_name ?? null,
          });
        }
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Registrierung fehlgeschlagen';
        return { success: false, error: message };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await sdk.auth.logout();
    } catch {
      // silent
    }
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        backendAvailable,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
