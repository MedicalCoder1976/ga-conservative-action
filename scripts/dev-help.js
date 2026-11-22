#!/usr/bin/env node
/**
 * GA Conservative Action - Development Helper
 * 
 * Usage:
 *   node scripts/dev-help.js build         - Build for production
 *   node scripts/dev-help.js verify-env    - Check environment setup
 */

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const commands = {
  build: {
    description: 'Build for production',
    run: async () => {
      console.log('🔨 Building for production...')
      await runCommand('npm', ['run', 'build'])
      console.log('✓ Production build complete. Check .next/ directory.')
    }
  },

  'verify-env': {
    description: 'Verify environment configuration',
    run: async () => {
      const envPath = path.join(__dirname, '..', '.env.local')
      
      if (!fs.existsSync(envPath)) {
        console.log('❌ .env.local not found')
        process.exit(1)
      }

      const envContent = fs.readFileSync(envPath, 'utf8')
      const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && !envContent.includes('your_supabase_url')
      const hasAnonKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && !envContent.includes('your_supabase_anon_key')
      const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY=') && !envContent.includes('your_supabase_service_role_key')

      console.log('🔍 Environment Configuration Check')
      console.log(`  ${hasUrl ? '✓' : '❌'} NEXT_PUBLIC_SUPABASE_URL`)
      console.log(`  ${hasAnonKey ? '✓' : '❌'} NEXT_PUBLIC_SUPABASE_ANON_KEY`)
      console.log(`  ${hasServiceKey ? '✓' : '❌'} SUPABASE_SERVICE_ROLE_KEY`)

      if (!hasUrl || !hasAnonKey || !hasServiceKey) {
        console.log('')
        console.log('⚠️  Some environment variables are not configured.')
        console.log('Follow the SETUP.md guide to get your Supabase credentials.')
        process.exit(1)
      }

      console.log('')
      console.log('✓ All environment variables configured!')
    }
  }
}

function runCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' })
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`Command failed with code ${code}`))
      else resolve()
    })
    child.on('error', reject)
  })
}

const command = process.argv[2]

if (!command || command === '--help' || command === '-h') {
  console.log('GA Conservative Action - Development Helper\n')
  console.log('Available commands:')
  Object.entries(commands).forEach(([name, cmd]) => {
    console.log(`  ${name.padEnd(15)} - ${cmd.description}`)
  })
  process.exit(0)
}

if (!commands[command]) {
  console.log(`❌ Unknown command: ${command}`)
  console.log('Run: node scripts/dev-help.js --help')
  process.exit(1)
}

commands[command].run().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
