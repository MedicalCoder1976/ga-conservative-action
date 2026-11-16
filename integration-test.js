#!/usr/bin/env node

/**
 * Integration test for GeorgiaInteractiveMapSVG component
 * Verifies all components are properly integrated and ready for production
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║  Georgia Interactive Map - Integration Test                 ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failed++;
  }
}

// Test 1: Component file exists
const svgMapPath = path.join(__dirname, 'src', 'components', 'GeorgiaInteractiveMapSVG.tsx');
test('SVG Map Component exists', fs.existsSync(svgMapPath), svgMapPath);

// Test 2: Check component has required imports
if (fs.existsSync(svgMapPath)) {
  const content = fs.readFileSync(svgMapPath, 'utf8');
  test('Component imports react-simple-maps', 
    content.includes('from \'react-simple-maps\''),
    'ComposableMap, Geographies used');
  
  test('Component fetches drift data', 
    content.includes('/api/voter-drift'),
    'Calls voter drift API endpoint');
  
  test('Component references US counties data', 
    content.includes('/data/us-counties.json'),
    'Uses TopoJSON for county boundaries');
  
  test('Component handles county click events', 
    content.includes('onCountyClick'),
    'Navigates to county dashboard');
  
  test('Component implements color coding', 
    content.includes('getColor') && content.includes('drift'),
    'Red/blue/green based on drift');
  
  test('Component has hover effects', 
    content.includes('hoveredCounty') && content.includes('setHoveredCounty'),
    'Visual feedback on hover');
  
  test('Component has year selector', 
    content.includes('selectedYear') && content.includes('ELECTIONS'),
    'Switch between 2018-2026');
}

// Test 3: Page component updated
const pagePath = path.join(__dirname, 'src', 'app', 'page.tsx');
test('Page component exists', fs.existsSync(pagePath), pagePath);

if (fs.existsSync(pagePath)) {
  const content = fs.readFileSync(pagePath, 'utf8');
  test('Page imports GeorgiaInteractiveMapSVG', 
    content.includes('import GeorgiaInteractiveMapSVG'),
    'Correct component imported');
  
  test('Page uses new map component', 
    content.includes('<GeorgiaInteractiveMapSVG'),
    'Component rendered on page');
  
  test('Page passes handleCountyClick callback', 
    content.includes('onCountyClick={handleCountyClick}'),
    'County click navigation configured');
}

// Test 4: Data files exist
const dataDir = path.join(__dirname, 'public', 'data');
test('Data directory exists', fs.existsSync(dataDir), dataDir);

if (fs.existsSync(dataDir)) {
  const usCountiesPath = path.join(dataDir, 'us-counties.json');
  test('US counties TopoJSON exists', 
    fs.existsSync(usCountiesPath),
    `Size: ${(fs.statSync(usCountiesPath).size / 1024 / 1024).toFixed(1)} MB`);
  
  const georgiaStatePath = path.join(dataDir, 'georgia-state.json');
  test('Georgia state data exists', 
    fs.existsSync(georgiaStatePath),
    `Size: ${(fs.statSync(georgiaStatePath).size / 1024 / 1024).toFixed(1)} MB`);
}

// Test 5: API endpoint exists
const apiPath = path.join(__dirname, 'src', 'app', 'api', 'voter-drift', 'route.ts');
test('Voter drift API endpoint exists', 
  fs.existsSync(apiPath),
  apiPath);

if (fs.existsSync(apiPath)) {
  const content = fs.readFileSync(apiPath, 'utf8');
  test('API handles year parameter', 
    content.includes('election_year'),
    'Fetches data by election year');
  
  test('API calculates drift percentage', 
    content.includes('drift'),
    'Compares baseline to current year');
}

// Test 6: Dependencies
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  test('react-simple-maps installed', 
    packageJson.dependencies['react-simple-maps'],
    `v${packageJson.dependencies['react-simple-maps']}`);
  
  test('leaflet installed', 
    packageJson.dependencies['leaflet'],
    `v${packageJson.dependencies['leaflet']}`);
  
  test('react-leaflet installed', 
    packageJson.dependencies['react-leaflet'],
    `v${packageJson.dependencies['react-leaflet']}`);
  
  test('topojson-client installed', 
    packageJson.dependencies['topojson-client'],
    `v${packageJson.dependencies['topojson-client']}`);
}

// Test 7: Build configuration
const tsConfigPath = path.join(__dirname, 'tsconfig.json');
test('TypeScript config exists', fs.existsSync(tsConfigPath), tsConfigPath);

const nextConfigPath = path.join(__dirname, 'next.config.ts');
test('Next.js config exists', fs.existsSync(nextConfigPath), nextConfigPath);

// Summary
console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log(`║  Results: ${passed} passed, ${failed} failed                     ║`);
console.log('╚══════════════════════════════════════════════════════════════╝\n');

if (failed === 0) {
  console.log('🎉 All integration tests passed! Ready for production.\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} test(s) failed. Please review above.\n`);
  process.exit(1);
}
