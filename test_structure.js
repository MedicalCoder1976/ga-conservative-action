const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('INVESTIGATING COUNTY INTEL STRUCTURE');
    console.log('====================================');
    
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
    
    // Investigate structure
    const structure = await page.evaluate(() => {
      const text = document.body.innerText;
      const buttons = Array.from(document.querySelectorAll('button'));
      
      // Find COUNTY INTEL section
      const sections = Array.from(document.querySelectorAll('[role="region"], section, .section, [class*="county"], [class*="intel"]'));
      
      const buttonInfo = buttons.map((b, i) => ({
        index: i,
        text: b.textContent.trim().substring(0, 40),
        type: b.getAttribute('type') || 'button',
        ariaExpanded: b.getAttribute('aria-expanded'),
        ariaControls: b.getAttribute('aria-controls'),
        disabled: b.hasAttribute('disabled')
      }));
      
      return {
        hasCOUNTYINTEL: text.includes('COUNTY INTEL'),
        buttons: buttonInfo,
        sectionsCount: sections.length,
        pageText: text.substring(0, 500)
      };
    });
    
    console.log('Has COUNTY INTEL text: ' + structure.hasCOUNTYINTEL);
    console.log('Sections found: ' + structure.sectionsCount);
    console.log('');
    console.log('Button details:');
    structure.buttons.forEach(b => {
      console.log('  [' + b.index + '] ' + b.text + ' (aria-expanded: ' + b.ariaExpanded + ')');
    });
    
    console.log('');
    console.log('Page text (first 500 chars):');
    console.log(structure.pageText);
    
    console.log('');
    console.log('Step 2: Scroll down to see if COUNTY INTEL is below');
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });
    await page.waitForTimeout(1500);
    
    const belowScroll = await page.evaluate(() => {
      return {
        text: document.body.innerText,
        hasIntel: document.body.innerText.includes('COUNTY INTEL'),
        hasLogActivity: document.body.innerText.includes('LOG ACTIVITY'),
        hasSignIn: document.body.innerText.includes('Sign in')
      };
    });
    
    console.log('After scroll down:');
    console.log('  Has COUNTY INTEL: ' + belowScroll.hasIntel);
    console.log('  Has LOG ACTIVITY: ' + belowScroll.hasLogActivity);
    console.log('  Has Sign in: ' + belowScroll.hasSignIn);
    
    await page.screenshot({ path: 'structure_investigation.png' });
    
  } catch (error) {
    console.log('ERROR: ' + error.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
