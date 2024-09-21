import { expect, test } from "@playwright/test";
import path from "path";

// this should match with the local frontend URL
const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("samaboy@gmail.com");
  await page.locator("[name=password]").fill("1234567");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Sign in successful !")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);
  await page.locator("[name='name']").fill("Test hotel");
  await page.locator("[name='city']").fill("Test city");
  await page.locator("[name='country']").fill("Test country");
  await page.locator("[name='description']").fill("Test description");
  await page.locator("[name='pricePerNight']").fill("100");

  await page.selectOption("select[name='starRating']", "3");

  await page.getByText("Budget").click();
  await page.click('input[name="facilities"][value="Free WiFi"]');
  await page.click('input[name="facilities"][value="Parking"]');

  await page.locator('input[name="adultCount"]').fill("2");
  await page.locator('input[name="childCount"]').fill("4");

  await page.setInputFiles("[name='imageFiles']", [
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();

  // Wait for the specific API call response
  const response = await page.waitForResponse((response) => {
    return (
      response.url().includes("api/my-hotels") &&
      (response.status() === 201 || response.status() === 200)
    );
  });

  await expect(page.getByText("Hotel saved !")).toBeVisible();
});

// Test name 1
// Test des 1
// , Test country 1
// Luxury
// $50 per night
// 2 adults, 2 children
// 2 Star Rating

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);
  // hotel name
  await expect(page.getByText("Test name 1")).toBeVisible();
  // hotel des
  await expect(page.getByText("Test des 1")).toBeVisible();
  // hotel country
  await expect(page.getByText("Test country 1")).toBeVisible();
  // hotel type
  await expect(page.getByText("Luxury")).toBeVisible();
  // hotel rate
  await expect(page.getByText("$50 per night")).toBeVisible();
  // hotel adult counts, child counts
  await expect(page.getByText("2 adults, 2 children")).toBeVisible();
  // hotel rating
  await expect(page.getByText("2 Star Rating")).toBeVisible();

  await expect(page.getByRole("link", { name: "View Details" }).first()).toBeVisible();
});
