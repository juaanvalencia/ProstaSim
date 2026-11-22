import { supabase } from "./supabase";

export function getSession() {
  return supabase.auth.getSession();
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export function fetchProfile(userId) {
  return supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
}

export function signUp(fullName, email, password) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signOut() {
  return supabase.auth.signOut();
}
