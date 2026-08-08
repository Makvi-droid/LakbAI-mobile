import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

// Must resolve to something matched by an entry in Supabase Dashboard >
// Authentication > URL Configuration > Redirect URLs:
//   - Expo Go            -> exp://**
//   - dev client/standalone -> lakbaimobile://**
//   - web dev             -> http://localhost:<port>/**
const redirectTo = Linking.createURL('/auth-callback');

export async function createSessionFromUrl(url: string): Promise<Session | null> {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) return null;

  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return data.session;
}

export async function signInWithGoogle(): Promise<Session | null> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data?.url) throw new Error('Supabase did not return an auth URL.');

  if (Platform.OS === 'web') {
    // Navigate the current tab to Google. It will redirect back to
    // redirectTo (our own /auth-callback route), which is what actually
    // finishes the sign-in — nothing more to do in this function.
    window.location.assign(data.url);
    return null;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'success' && result.url) {
    return createSessionFromUrl(result.url);
  }
  if (result.type === 'cancel' || result.type === 'dismiss') {
    return null;
  }
  throw new Error('Google sign-in failed. Please try again.');
}