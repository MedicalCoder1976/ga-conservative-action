const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/dashboard/Fulton', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Click COUNTY INTEL
  await page.locator('button:has-text("COUNTY INTEL")').click();
  await page.waitForTimeout(800);
  
  // Take screenshot
  await page.screenshot({ path: 'fulton_county_intel_expanded.png', fullPage: true });
  console.log('Screenshot saved: fulton_county_intel_expanded.png');
  
  await browser.close();
})();
