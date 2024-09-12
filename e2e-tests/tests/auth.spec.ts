import { test, expect } from "@playwright/test";

// this should match with the local frontend URL
const UI_URL = "http://localhost:5173";

test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("samaboy@gmail.com");
  await page.locator("[name=password]").fill("1234567");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Sign in successful !")).toBeVisible();
  await expect(page.getByRole("link", { name: "My bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});

test("should allow the user to register", async ({ page }) => {
  // generating a number between 10000 and 99999 (a range of 90,000 possible values),
  // const randomTestEmail = `test_register_${
  //   Math.floor(Math.random() * 90000) + 10000
  // }@test.com`;
  // Since it uses cryptographic random values, it's considered highly reliable for uniqueness.
  const randomEmail = `test_${crypto.randomUUID()}@test.com`;
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an account" })
  ).toBeVisible();
  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(randomEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Registration successful !")).toBeVisible();
  await expect(page.getByRole("link", { name: "My bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});
