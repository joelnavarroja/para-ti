import { test, expect } from "@playwright/test";

async function skipToVideo(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Empezar" }).click();
  await page.getByTestId("roulette-spin").click();
  await page.waitForTimeout(4600);
  await page.getByTestId("roulette-spin").click();
  await page.waitForTimeout(4600);
  await page.getByRole("button", { name: /Pagar 5€/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "¿Y ahora qué?" }).click();
  await page.getByRole("button", { name: "Empezar" }).click();
  for (let i = 0; i < 4; i++) {
    await page.getByTestId("quiz-option").first().click();
    await page.getByRole("button", { name: "Siguiente" }).click();
  }
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: "..." }).click();
  const verVideoBtn = page.getByRole("button", { name: "Ver vídeo" });
  await expect(verVideoBtn).toBeVisible({ timeout: 10_000 });
  await verVideoBtn.click();
}

test("el vídeo carga sin 404 y el botón cerrar avanza el flujo", async ({
  page,
}) => {
  const failedRequests: string[] = [];
  page.on("response", (res) => {
    if (res.url().includes("video-sorpresa") && res.status() >= 400) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  await skipToVideo(page);

  const video = page.getByTestId("surprise-video");
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute("src", "/assets/video-sorpresa.mp4");

  await expect
    .poll(async () => video.evaluate((el: HTMLVideoElement) => el.readyState))
    .toBeGreaterThan(0);

  expect(failedRequests).toEqual([]);

  await page.getByTestId("video-close").click();
  await expect(page.getByText("Mondongo te ha dado el regalo")).toBeVisible();
});
