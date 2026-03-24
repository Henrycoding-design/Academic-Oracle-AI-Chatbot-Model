import { supabase } from "./supabaseClient"

export async function getAccessToken() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }

    if (session) {
      const accessToken = session.access_token;
    //   console.log('Access Token:', accessToken);
      return accessToken;
    } else {
      console.log('No active session found.');
      return null;
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err.message);
    return null;
  }
}