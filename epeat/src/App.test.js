const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  
  await page.goto("http://localhost:3000/checkout"); 
  
  await page.fill("input[name='name']", "Ilyes");
  await page.fill("input[name='nickname']", "Hedia");
  await page.type("#card-element", "4242 4242 4242 4242"); 
  await page.click("button[type='submit']");
  
  
  await browser.close();
  await browser.close();
})();