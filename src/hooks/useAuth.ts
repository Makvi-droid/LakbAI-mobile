import { useState, useEffect, useCallback } from 'react';
import { Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { signInWithGoogle as signInWithGoogleFlow } from '@/lib/googleAuth';

interface UseAuthReturn {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ session: Session | null; error: Error | null }>;
}

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setSession(session);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      // On web this resolves to null almost immediately because the tab
      // navigates away to Google — that's fine, /auth-callback finishes
      // the job on return. On native this resolves to the actual
      // session once the Custom Tab closes, since there's no separate
      // screen navigation involved in that path.
      const session = await signInWithGoogleFlow();
      return { session, error: null };
    } catch (err) {
      return {
        session: null,
        error: err instanceof Error ? err : new Error('Google sign-in failed.'),
      };
    }
  }, []);

  return { session, loading, signIn, signOut, signInWithGoogle };
}