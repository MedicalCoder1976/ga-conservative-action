#!/usr/bin/env node
/**
 * Test logging in with test users
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ntxzjdsnbitqtpgtcler.supabase.co";
const ANON_KEY = "sb_publishable_qRDQR8SeAcE70Ql2k0JW3w_AUYY25oo";

async function testLogin() {
  console.log("🧪 Testing login with demo@gaissues.local\n");

  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  try {
    // Try signing in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "demo@gaissues.local",
      password: "demo12345",
    });

    if (error) {
      console.error("❌ Login failed:");
      console.error(`   Code: ${error.status}`);
      console.error(`   Message: ${error.message}`);
      return;
    }

    if (data?.user) {
      console.log("✅ Login successful!");
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Confirmed at: ${data.user.email_confirmed_at}`);
      console.log(`\n📝 Session token: ${data.session?.access_token?.substring(0, 20)}...`);
    }
  } catch (err) {
    console.error("❌ Exception during login:");
    console.error(err);
  }
}

testLogin();
