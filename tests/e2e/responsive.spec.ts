import { test, expect } from "@playwright/test";

test("sin overflow horizontal en la pantalla de intro", async ({ page }) => {
  await page.goto("/");
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
});

test("sin overflow horizontal tras entrar en la ruleta", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Empezar" }).click();
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
});
