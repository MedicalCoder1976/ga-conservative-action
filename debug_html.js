const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:3000/dashboard/Fulton", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Click COUNTY INTEL
    const button = await page.locator("button:has-text('COUNTY INTEL')");
    await button.click();
    await page.waitForTimeout(1000);

    // Get the HTML structure of the page
    const content = await page.content();
    
    // Look for the COUNTY INTEL section in the HTML
    const intelStart = content.indexOf("COUNTY INTEL");
    if (intelStart !== -1) {
      const section = content.substring(intelStart, intelStart + 3000);
      console.log("COUNTY INTEL SECTION (first 3000 chars after title):");
      console.log(section);
      console.log("\n---END OF SECTION---\n");
    }

    // Check for any divs that might contain the data
    const allText = await page.locator("body").textContent();
    console.log("FIRST 3000 CHARS OF BODY TEXT:");
    console.log(allText.substring(0, 3000));

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();
