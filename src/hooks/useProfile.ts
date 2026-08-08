import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type SignInProvider = 'google' | 'email' | 'unknown';

export interface ProfileInfo {
  isLoaded: boolean;
  isSignedIn: boolean;
  email: string | null;
  fullName: string | null;
  initials: string;
  avatarUrl: string | null;
  address: string | null;
  provider: SignInProvider;
  providerLabel: string;
  memberSince: string | null;
}

function getInitials(name: string | null, email: string | null): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
  if (email) return email[0]!.toUpperCase();
  return '?';
}

function formatMemberSince(createdAt: string | undefined): string | null {
  if (!createdAt) return null;
  try {
    return new Date(createdAt).toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

/**
 * Derives display-ready profile data from the current Supabase session.
 * Keeps user_metadata / app_metadata field-shape knowledge in one place
 * so UI components never touch `session.user` directly.
 */
export function useProfile(): ProfileInfo {
  const { session, loading } = useAuth();

  return useMemo(() => {
    if (!session?.user) {
      return {
        isLoaded: !loading,
        isSignedIn: false,
        email: null,
        fullName: null,
        initials: '?',
        avatarUrl: null,
        address: null,
        provider: 'unknown',
        providerLabel: 'Not signed in',
        memberSince: null,
      };
    }

    const { user } = session;
    const metadata = user.user_metadata ?? {};

    const fullName: string | null = metadata.full_name ?? metadata.name ?? null;
    const avatarUrl: string | null = metadata.avatar_url ?? metadata.picture ?? null;
    const address: string | null = metadata.address ?? null;
    const email = user.email ?? null;

    // app_metadata.provider is the source of truth Supabase sets on the
    // user row; fall back to inspecting identities if it's ever absent.
    const rawProvider =
      user.app_metadata?.provider ??
      user.identities?.[0]?.provider ??
      'unknown';

    const provider: SignInProvider =
      rawProvider === 'google' ? 'google' : rawProvider === 'email' ? 'email' : 'unknown';

    const providerLabel =
      provider === 'google'
        ? 'Signed in with Google'
        : provider === 'email'
        ? 'Signed in with Email'
        : 'Signed in';

    return {
      isLoaded: !loading,
      isSignedIn: true,
      email,
      fullName,
      initials: getInitials(fullName, email),
      avatarUrl,
      address,
      provider,
      providerLabel,
      memberSince: formatMemberSince(user.created_at),
    };
  }, [session, loading]);
}