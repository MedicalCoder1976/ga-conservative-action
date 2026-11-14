const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('FULL TEST SEQUENCE');
    console.log('==================');
    
    console.log('');
    console.log('Step 1: Load page and navigate to map');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('  OK: Home page loaded');
    
    await page.waitForTimeout(1000);
    
    // Try different ways to access the map
    await page.evaluate(() => {
      // Scroll to map section
      const mapSection = document.querySelector('[id="map"]');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    console.log('  OK: Scrolled to map section');
    await page.waitForTimeout(2000);
    
    console.log('');
    console.log('Step 2: Find the county map SVG');
    const mapSvgInfo = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const mapSvg = svgs.find(svg => svg.children.length > 50);
      
      if (mapSvg) {
        const paths = Array.from(mapSvg.querySelectorAll('path'));
        return {
          found: true,
          pathCount: paths.length,
          svgWidth: mapSvg.getAttribute('width'),
          svgHeight: mapSvg.getAttribute('height'),
          viewBox: mapSvg.getAttribute('viewBox'),
          pathClasses: paths.slice(0, 5).map(p => p.getAttribute('class'))
        };
      }
      return { found: false };
    });
    
    if (!mapSvgInfo.found) {
      console.log('  WARN: No map SVG found with many children');
    } else {
      console.log('  OK: Map SVG found');
      console.log('     Paths: ' + mapSvgInfo.pathCount);
      console.log('     ViewBox: ' + mapSvgInfo.viewBox);
      console.log('     Sample path classes: ' + mapSvgInfo.pathClasses.join(', '));
    }
    
    console.log('');
    console.log('Step 3: Click on a county (using direct path selector)');
    
    // Get all g elements (groups) which might be counties
    const countiesInfo = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const mapSvg = svgs.find(svg => svg.children.length > 50);
      if (!mapSvg) return { found: false };
      
      const groups = Array.from(mapSvg.querySelectorAll('g'));
      return {
        found: true,
        groupCount: groups.length,
        hasPath: groups.length > 0 && groups[0].querySelector('path') !== null
      };
    });
    
    console.log('  Groups in map: ' + (countiesInfo.found ? countiesInfo.groupCount : 'N/A'));
    console.log('  Has paths: ' + (countiesInfo.found ? countiesInfo.hasPath : 'N/A'));
    
    // Try clicking on the map SVG - any polygon should work
    try {
      // Get a specific path element and click it using coordinates
      const clickCoords = await page.evaluate(() => {
        const svgs = Array.from(document.querySelectorAll('svg'));
        const mapSvg = svgs.find(svg => svg.children.length > 50);
        if (!mapSvg) return null;
        
        const paths = Array.from(mapSvg.querySelectorAll('path'));
        if (paths.length > 0) {
          const path = paths[0];
          const rect = path.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
        return null;
      });
      
      if (clickCoords) {
        await page.mouse.move(clickCoords.x, clickCoords.y);
        await page.mouse.click(clickCoords.x, clickCoords.y);
        console.log('  OK: Clicked on county at (' + clickCoords.x.toFixed(0) + ', ' + clickCoords.y.toFixed(0) + ')');
      }
    } catch (e) {
      console.log('  WARN: Could not click on county: ' + e.message);
    }
    
    await page.waitForTimeout(3000);
    
    console.log('');
    console.log('Step 4: Check for dashboard/panel content');
    
    // Take screenshot
    await page.screenshot({ path: 'final_test.png' });
    console.log('  OK: Screenshot saved');
    
    // Check content
    const finalContent = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText.substring(0, 300),
        hasDashboard: document.body.innerText.includes('COUNTY') || document.body.innerText.includes('Dashboard'),
        hasCountyIntel: document.body.innerText.includes('COUNTY INTEL'),
        hasLogActivity: document.body.innerText.includes('LOG ACTIVITY'),
        hasDemographics: document.body.innerText.includes('Demographics'),
        hasElectionResults: document.body.innerText.includes('Election') || document.body.innerText.includes('Results'),
        totalElements: document.querySelectorAll('*').length
      };
    });
    
    console.log('');
    console.log('Step 5: Final content verification');
    console.log('  Page title: ' + finalContent.title);
    console.log('  Body text (first 200 chars): ' + finalContent.bodyText.replace(/\n/g, ' ').substring(0, 200));
    console.log('  Has dashboard content: ' + finalContent.hasDashboard);
    console.log('  Has COUNTY INTEL: ' + finalContent.hasCountyIntel);
    console.log('  Has LOG ACTIVITY: ' + finalContent.hasLogActivity);
    console.log('  Has Demographics: ' + finalContent.hasDemographics);
    console.log('  Has Election Results: ' + finalContent.hasElectionResults);
    console.log('  Total page elements: ' + finalContent.totalElements);
    
  } catch (error) {
    console.log('');
    console.log('ERROR: ' + error.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
