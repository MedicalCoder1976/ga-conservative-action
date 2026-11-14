const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:3000/dashboard/Fulton", { waitUntil: "networkidle" });
    console.log("✓ Page loaded successfully");

    await page.waitForTimeout(1000);
    await page.screenshot({ path: "screenshot_initial.png" });
    console.log("✓ Initial screenshot taken");

    const countyIntelButton = await page.locator("text=COUNTY INTEL").first();
    if (countyIntelButton) {
      await countyIntelButton.click();
      console.log("✓ Clicked COUNTY INTEL");
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: "screenshot_expanded.png" });
    console.log("✓ Expanded screenshot taken");

    const pageContent = await page.content();

    console.log("\n=== KEY CONTENT VERIFICATION ===");
    console.log("2026 or Election found:", pageContent.includes("2026") || pageContent.includes("Election"));
    console.log("Demographics found:", pageContent.includes("Demographics"));
    console.log("Age groups found:", pageContent.includes("18-29") || pageContent.includes("30-44"));
    console.log("Race categories found:", pageContent.includes("White") || pageContent.includes("Black"));
    console.log("Voter Priorities found:", pageContent.includes("Priorities"));

    const bodyText = await page.locator("body").textContent();
    console.log("\n=== DATA QUALITY CHECK ===");
    console.log("N/A values count:", (bodyText.match(/N\/A/g) || []).length);
    console.log("null values count:", (bodyText.match(/null/gi) || []).length);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();
