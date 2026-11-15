#!/usr/bin/env node
/**
 * Create test users in Supabase Auth for local testing
 * Usage: node create-test-users.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://ntxzjdsnbitqtpgtcler.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const testUsers = [
  {
    email: "testuser@gaissues.local",
    password: "testpass123",
    username: "testuser",
    full_name: "Test User",
  },
  {
    email: "demo@gaissues.local",
    password: "demo12345",
    username: "demouser",
    full_name: "Demo Account",
  },
  {
    email: "fulton@gaissues.local",
    password: "fulton123",
    username: "fulton_volunteer",
    full_name: "Fulton County Volunteer",
  },
];

async function createTestUsers() {
  console.log("🔐 Creating test users in Supabase Auth...\n");

  // Use service role key to create users as admin
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}...`);

      // Create auth user
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            username: user.username,
            full_name: user.full_name,
          },
        });

      if (authError) {
        console.error(`  ❌ Error creating auth user:`, authError.message);
        continue;
      }

      const userId = authUser.user.id;
      console.log(`  ✅ Auth user created: ${userId}`);

      // Create profile record
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        username: user.username,
        full_name: user.full_name,
        county: "Statewide",
        role: "Visitor",
        show_real_name: false,
        points: 0,
      });

      if (profileError) {
        console.error(`  ⚠️  Error creating profile:`, profileError.message);
      } else {
        console.log(`  ✅ Profile created`);
      }

      console.log(`\n📝 Login credentials:\n   Email: ${user.email}\n   Password: ${user.password}\n   Username: ${user.username}\n`);
    } catch (err) {
      console.error(`❌ Error creating user ${user.email}:`, err.message);
    }
  }

  console.log("✨ Test user creation complete!\n");
}

createTestUsers().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
