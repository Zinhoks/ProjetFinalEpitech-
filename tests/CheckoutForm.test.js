const { test, expect } = require("@playwright/test");

test("navigate if success payment", async ({ page }, testInfo) => {
  const stripeFrame = page.frameLocator("iframe").first();

  try {
    await page.goto("http://localhost:3000/stripe");

    await page.screenshot({ path: "screenshot/form.png" });

    await page.fill('input[name="name"]', "ilyes");
    await page.fill('input[name="nickname"]', "ilyes");
    await stripeFrame
      .locator('[placeholder="Card number"]')
      .fill("4242424242424242");
    await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
    await stripeFrame.locator('[placeholder="CVC"]').fill("242");

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    await page.screenshot({ path: "screenshot/Paimentsuccess.png" });
    await testInfo.attach("screenshot", {
      path: "screenshot/Paimentsuccess.png",
      contentType: "image/png",
    });

    const url = await page.url();
    expect(url).toBe("http://localhost:3000/Success");
  } catch (error) {
    console.error("Error navigate", error);
  }
});
