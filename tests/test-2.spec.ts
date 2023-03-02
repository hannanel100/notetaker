import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Sign in" }).nth(1).click();
  await page.getByRole("button", { name: "Sign in with GitHub" }).click();
  await page
    .getByLabel("Username or email address")
    .fill(process.env.USERNAME as string);
  await page.getByLabel("Username or email address").press("Tab");
  await page.getByLabel("Password").fill(process.env.PASSWORD as string);
  await page.getByLabel("Password").press("Enter");
  await page.getByRole("button", { name: "Authorize hannanel100" }).click();
  await page.goto("http://localhost:3000/");
  await page.getByPlaceholder("Enter New Topic").click();
  await page.getByPlaceholder("Enter New Topic").fill("first topic");
  await page.getByPlaceholder("Enter New Topic").press("Enter");
  await page.getByRole("link", { name: "first topic Delete" }).click();
  await page.getByPlaceholder("Title").click();
  await page.getByPlaceholder("Title").fill("first title");
  await page.locator(".cm-activeLine").click();
  await page.getByRole("textbox").nth(2).fill("first text");
  await page.getByRole("button", { name: "Save" }).click();
  expect(page.locator("text=first title")).toBeTruthy();
  await page.getByText("first title").click();
  await page.getByRole("button", { name: "Delete" }).click();
  expect(page.locator("text=first title")).toBeFalsy();
  await page.getByRole("link", { name: "first topic Delete" }).click();
});
