const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:3000/dashboard/Fulton", { waitUntil: "networkidle" });
    console.log("✓ Page loaded");

    // Wait for hydration
    await page.waitForTimeout(2000);

    // Find and click the COUNTY INTEL button
    const button = await page.locator("button:has-text('COUNTY INTEL')");
    if (button && await button.isVisible()) {
      console.log("✓ Found COUNTY INTEL button");
      await button.click();
      console.log("✓ Clicked COUNTY INTEL button");
      await page.waitForTimeout(800);
    } else {
      console.log("✗ Could not find COUNTY INTEL button");
    }

    // Take screenshot after clicking
    await page.screenshot({ path: "screenshot_after_click.png" });
    console.log("✓ Screenshot saved: screenshot_after_click.png");

    // Get the text content
    const bodyText = await page.locator("body").textContent();
    
    console.log("\n=== TEXT CONTENT ANALYSIS ===");
    
    // Look for specific keywords
    const keywords = {
      "2026": bodyText.includes("2026"),
      "Election": bodyText.includes("Election"),
      "Republican": bodyText.includes("Republican"),
      "Democrat": bodyText.includes("Democrat"),
      "Demographics": bodyText.includes("Demographics"),
      "18-29": bodyText.includes("18-29"),
      "30-44": bodyText.includes("30-44"),
      "45-64": bodyText.includes("45-64"),
      "65+": bodyText.includes("65+"),
      "White": bodyText.includes("White"),
      "Black": bodyText.includes("Black"),
      "Hispanic": bodyText.includes("Hispanic"),
      "Asian": bodyText.includes("Asian"),
      "Voter Priorities": bodyText.includes("Voter Priorities") || bodyText.includes("Priorities"),
      "Exit polls": bodyText.includes("Exit polls") || bodyText.includes("exit polls")
    };

    Object.entries(keywords).forEach(([key, found]) => {
      console.log((found ? "✓" : "✗") + " " + key);
    });

    // Count nulls and N/A
    const nullCount = (bodyText.match(/null/gi) || []).length;
    const naCount = (bodyText.match(/N\/A/gi) || []).length;
    
    console.log("\n=== DATA QUALITY ===");
    console.log("null values: " + nullCount);
    console.log("N/A values: " + naCount);
    
    if (nullCount > 20) {
      console.log("⚠ HIGH NUMBER OF NULL VALUES");
    }

  } catch (error) {
    console.error("✗ Error:", error.message);
  } finally {
    await browser.close();
  }
})();
