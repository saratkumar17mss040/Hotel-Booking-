import { test, expect } from "@playwright/test";

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

test("Should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("Where are you going ?").fill("Test city");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText("Hotels found in")).toBeVisible();
  await expect(page.getByText("Test hotel").first()).toBeVisible();
});

test("Should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("Where are you going ?").fill("Test");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("Test hotel").first().click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});
