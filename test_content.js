const playwright = require("playwright");

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:3000/dashboard/Fulton", { waitUntil: "networkidle" });
    
    const pageContent = await page.content();
    
    // Save full page content for analysis
    require("fs").writeFileSync("page_content.html", pageContent);
    
    // Get text content
    const bodyText = await page.locator("body").textContent();
    console.log("BODY TEXT LENGTH:", bodyText.length);
    console.log("\nFIRST 2000 CHARS OF BODY TEXT:");
    console.log(bodyText.substring(0, 2000));
    
    console.log("\n\nLOOKING FOR COUNTY INTEL SECTION:");
    const countyIntelMatch = pageContent.substring(pageContent.indexOf("COUNTY INTEL") - 200, pageContent.indexOf("COUNTY INTEL") + 500);
    console.log(countyIntelMatch);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();
