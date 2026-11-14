const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('DETAILED SVG STRUCTURE ANALYSIS');
    console.log('================================');
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    // Scroll to map
    await page.evaluate(() => {
      document.querySelector('[id="map"]').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Get SVG structure
    const svgStructure = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const mapSvg = svgs.find(svg => svg.children.length > 50);
      
      if (!mapSvg) return { error: 'No map SVG' };
      
      const groups = Array.from(mapSvg.querySelectorAll('g'));
      
      // Get first 10 groups and their children
      const groupDetails = groups.slice(0, 10).map(g => {
        const children = Array.from(g.children);
        return {
          id: g.getAttribute('id') || 'no-id',
          'data-name': g.getAttribute('data-name') || 'no-data-name',
          class: g.getAttribute('class') || 'no-class',
          childCount: children.length,
          childTypes: children.map(c => c.tagName).join(','),
          onclick: g.getAttribute('onclick') || 'no-onclick'
        };
      });
      
      return {
        totalGroups: groups.length,
        groupDetails: groupDetails
      };
    });
    
    if (svgStructure.error) {
      console.log('ERROR: ' + svgStructure.error);
    } else {
      console.log('Total groups: ' + svgStructure.totalGroups);
      console.log('');
      console.log('First 10 group details:');
      svgStructure.groupDetails.forEach((g, i) => {
        console.log('  [' + i + '] id=' + g.id + ', data-name=' + g['data-name']);
        console.log('       class=' + g.class + ', children=' + g.childCount);
        console.log('       childTypes=' + g.childTypes);
        console.log('       onclick=' + (g.onclick === 'no-onclick' ? 'None' : 'Has onclick'));
      });
    }
    
    console.log('');
    console.log('ATTEMPTING CLICK');
    console.log('================');
    
    // Try to click on a group using keyboard/mouse
    await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const mapSvg = svgs.find(svg => svg.children.length > 50);
      if (!mapSvg) return;
      
      const groups = Array.from(mapSvg.querySelectorAll('g'));
      if (groups.length > 0) {
        // Find a group that's likely clickable (has stroke or fill)
        const clickableGroup = groups.find(g => {
          const style = window.getComputedStyle(g);
          return style.cursor === 'pointer' || g.getAttribute('onclick') || g.getAttribute('data-county');
        }) || groups[0];
        
        // Dispatch click event
        clickableGroup.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    
    console.log('  Dispatched click event');
    await page.waitForTimeout(2000);
    
    console.log('');
    console.log('CHECKING RESULT');
    console.log('===============');
    
    const result = await page.evaluate(() => {
      return {
        pageContent: document.body.innerText.substring(0, 500),
        hasModal: document.querySelectorAll('[role="dialog"], .modal, .sidebar').length > 0
      };
    });
    
    console.log('Has modal/dialog: ' + result.hasModal);
    console.log('Page content (first 500 chars):');
    console.log(result.pageContent);
    
    await page.screenshot({ path: 'svg_structure_test.png' });
    
  } catch (error) {
    console.log('ERROR: ' + error.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();
