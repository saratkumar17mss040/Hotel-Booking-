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

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);
  // hotel name
  await expect(page.getByText("Test hotel").first()).toBeVisible();
  // hotel des
  await expect(page.getByText("Test city").first()).toBeVisible();
  // hotel country
  await expect(page.getByText("Test country").first()).toBeVisible();
  // hotel type
  await expect(page.getByText("Test description").first()).toBeVisible();
  // hotel rate
  await expect(page.getByText("$100 per night").first()).toBeVisible();
  // hotel adult counts, child counts
  await expect(page.getByText("2 adults, 4 children").first()).toBeVisible();
  // hotel rating
  await expect(page.getByText("3 Star Rating").first()).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);
  await page.getByRole("link", { name: "View Details" }).first().click();
  await page.waitForSelector('[name="name"]', { state: "attached" });
  // this data is hard-coded, for it to work on second run, we need update the field value in ui manually
  // instead, we are resetting using the code below
  await expect(page.locator('[name="name"]')).toHaveValue("Test hotel");
  await page.locator('[name="name"]').fill("Test hotel updated");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue("Test hotel updated");
  await page.locator('[name="name"]').fill("Test hotel");
  await page.getByRole("button", { name: "Save" }).click();
});
