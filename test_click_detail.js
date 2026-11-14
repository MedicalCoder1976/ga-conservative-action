const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('TESTING COUNTY INTEL EXPANSION - DETAILED');
    console.log('========================================');
    
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
    
    await page.waitForTimeout(2000);
    
    console.log('Step 1: Initial state check');
    let beforeClick = await page.evaluate(() => {
      const text = document.body.innerText;
      const countyIntelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('COUNTY INTEL'));
      return {
        hasElectionBefore: text.includes('2026') || text.includes('Election'),
        hasDemoBefore: text.includes('Demographics'),
        buttonText: countyIntelBtn ? countyIntelBtn.textContent : 'not found',
        buttonClass: countyIntelBtn ? countyIntelBtn.className : 'N/A'
      };
    });
    
    console.log('Before click:');
    console.log('  Has Election: ' + beforeClick.hasElectionBefore);
    console.log('  Has Demographics: ' + beforeClick.hasDemoBefore);
    console.log('  Button text: ' + beforeClick.buttonText);
    console.log('');
    
    console.log('Step 2: Click COUNTY INTEL button');
    
    // Click using locator
    await page.locator('button').nth(0).click({ force: true });
    console.log('  ✓ Clicked button');
    
    await page.waitForTimeout(1500);
    
    console.log('');
    console.log('Step 3: Check after click');
    
    let afterClick = await page.evaluate(() => {
      const text = document.body.innerText;
      const countyIntelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('COUNTY INTEL'));
      
      return {
        hasElectionAfter: text.includes('2026') || text.includes('Election') || text.includes('Results'),
        hasDemoAfter: text.includes('Demographics'),
        hasAgeAfter: text.includes('Age'),
        hasIncomeAfter: text.includes('Income'),
        hasRaceAfter: text.includes('Race') || text.includes('White'),
        buttonText: countyIntelBtn ? countyIntelBtn.textContent : 'not found',
        textLength: text.length,
        fullText: text.substring(0, 1500)
      };
    });
    
    console.log('After click:');
    console.log('  Has Election: ' + afterClick.hasElectionAfter);
    console.log('  Has Demographics: ' + afterClick.hasDemoAfter);
    console.log('  Has Age: ' + afterClick.hasAgeAfter);
    console.log('  Has Income: ' + afterClick.hasIncomeAfter);
    console.log('  Has Race: ' + afterClick.hasRaceAfter);
    console.log('  Button text: ' + afterClick.buttonText);
    console.log('  Text length: ' + afterClick.textLength);
    console.log('');
    console.log('Full text after expansion:');
    console.log(afterClick.fullText);
    
    await page.screenshot({ path: 'county_intel_after_click.png' });
    
  } catch (error) {
    console.log('ERROR: ' + error.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
