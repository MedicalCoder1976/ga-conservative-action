const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('TESTING COUNTY INTEL EXPANSION');
    console.log('=============================');
    console.log('');
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      const elem = document.querySelector('[id="map"]');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Click county
    await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const mapSvg = svgs.find(svg => svg.children.length > 50);
      if (!mapSvg) return;
      const groups = Array.from(mapSvg.querySelectorAll('g'));
      if (groups.length > 0) {
        groups[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    
    console.log('Step 1: County dashboard loaded');
    await page.waitForTimeout(2000);
    
    // Find and click COUNTY INTEL button to expand
    console.log('Step 2: Finding COUNTY INTEL expand button');
    
    const buttons = await page.locator('button').count();
    console.log('  Total buttons: ' + buttons);
    
    // Get button texts
    const buttonData = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(b => ({
        text: b.textContent.trim().substring(0, 50),
        hasCountyIntel: b.textContent.includes('COUNTY INTEL')
      }));
    });
    
    const countyIntelIndex = buttonData.findIndex(b => b.hasCountyIntel);
    console.log('  Button texts found: ' + buttons);
    if (countyIntelIndex >= 0) {
      console.log('  ✓ Found COUNTY INTEL button at index ' + countyIntelIndex);
    }
    
    // Try to find and click COUNTY INTEL button
    console.log('');
    console.log('Step 3: Clicking COUNTY INTEL to expand');
    
    const nthButton = countyIntelIndex >= 0 ? countyIntelIndex + 1 : 1;
    const selectorStr = 'button:nth-of-type(' + nthButton + ')';
    
    try {
      await page.locator('button').nth(countyIntelIndex >= 0 ? countyIntelIndex : 0).click();
      console.log('  ✓ Clicked COUNTY INTEL button');
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log('  Try clicking via XPath');
      // Try alternative method
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const countyIntelBtn = buttons.find(b => b.textContent.includes('COUNTY INTEL'));
        if (countyIntelBtn) {
          countyIntelBtn.click();
        }
      });
      console.log('  ✓ Clicked COUNTY INTEL via evaluate');
      await page.waitForTimeout(1000);
    }
    
    console.log('');
    console.log('Step 4: Check expanded content');
    
    const expandedData = await page.evaluate(() => {
      const text = document.body.innerText;
      const lines = text.split('\n');
      
      return {
        firstLines: lines.slice(0, 30).join(' | '),
        hasElection: text.includes('2026') || text.includes('Election') || text.includes('Results'),
        hasDemographics: text.includes('Demographics'),
        hasVoter: text.includes('Voter') || text.includes('Priorities'),
        hasAge: text.includes('Age') || text.includes('18-29'),
        hasIncome: text.includes('Income'),
        textLength: text.length
      };
    });
    
    console.log('Content length: ' + expandedData.textLength);
    console.log('Has Election/2026: ' + expandedData.hasElection);
    console.log('Has Demographics: ' + expandedData.hasDemographics);
    console.log('Has Voter/Priorities: ' + expandedData.hasVoter);
    console.log('Has Age data: ' + expandedData.hasAge);
    console.log('Has Income data: ' + expandedData.hasIncome);
    console.log('');
    console.log('First 30 lines:');
    console.log(expandedData.firstLines);
    
    console.log('');
    console.log('Step 5: Take screenshot of expanded view');
    await page.screenshot({ path: 'county_intel_expanded.png' });
    console.log('  ✓ Screenshot saved');
    
  } catch (error) {
    console.log('ERROR: ' + error.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
