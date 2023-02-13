const { test, expect } = require("@playwright/test");

test("login", async ({ page }, testInfo) => {
  test.setTimeout(120000);
    try {
    await page.goto("http://localhost:3000/Auth");


    await page.fill('input[name="email"]', "test@test.fr");
    await page.fill('input[name="password"]', "testtest");
    
    await page.screenshot({ path: "screenshot/inputlogin.png" });

    
    
    await page.click('button[type="submitlogin"]');

   
    const url = await page.url();
    expect(url).toBe("http://localhost:3000/Auth");
    await page.screenshot({ path: "screenshot/login.png" });
    await testInfo.attach("screenshot", {
      path: "screenshot/login.png",
      contentType: "image/png",
    });

    await testInfo.attach("screenshot", {
        path: "screenshot/login.png",
        contentType: "image/png",
      });
  } catch (error) {
    console.error("Error navigate", error);
  }
});
