#!/usr/bin/env node

/**
 * Direct test of Supabase authentication
 * Verifies that the test user can authenticate
 */

const { createClient } = require("@supabase/supabase-js");

async function testLogin() {
  const supabaseUrl = "https://ntxzjdsnbitqtpgtcler.supabase.co";
  const anonKey = "sb_publishable_qRDQR8SeAcE70Ql2k0JW3w_AUYY25oo";

  const supabase = createClient(supabaseUrl, anonKey);

  console.log("Testing login with credentials...");
  console.log("Email: testuser@gaissues.local");
  console.log("Password: testpass123");
  console.log("");

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "testuser@gaissues.local",
      password: "testpass123",
    });

    if (error) {
      console.error("❌ Login failed:");
      console.error("Error:", error.message);
      console.error("Status:", error.status);
      return false;
    }

    if (data.user && data.session) {
      console.log("✅ LOGIN SUCCESSFUL!");
      console.log("");
      console.log("User Details:");
      console.log("  ID:", data.user.id);
      console.log("  Email:", data.user.email);
      console.log("  Created At:", data.user.created_at);
      console.log("");
      console.log("Session:");
      console.log("  Access Token (first 30 chars):", data.session.access_token.substring(0, 30) + "...");
      console.log("  Expires In:", data.session.expires_in, "seconds");
      console.log("");
      console.log("✅ Test user can successfully login via Supabase Auth!");
      return true;
    }
  } catch (err) {
    console.error("❌ Exception during login:");
    console.error(err);
    return false;
  }
}

testLogin().then((success) => {
  process.exit(success ? 0 : 1);
});
