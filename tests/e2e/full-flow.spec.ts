import { test, expect } from "@playwright/test";

test("recorrido completo de intro a pack opening final", async ({ page }) => {
  test.setTimeout(90_000);
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("response", (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Empezar" }).click();

  // Ruleta 1: dos giros hasta avanzar
  await page.getByTestId("roulette-spin").click();
  await page.waitForTimeout(4600);
  await page.getByTestId("roulette-spin").click();
  await page.waitForTimeout(4600);

  // Pago falso
  await page.getByRole("button", { name: /Pagar 5€/ }).click();

  // Premio falso
  await page.getByRole("button", { name: "Continuar" }).click();

  // Virus roba todo
  await page.getByRole("button", { name: "¿Y ahora qué?" }).click();

  // Quiz intro
  await page.getByRole("button", { name: "Empezar" }).click();

  // 4 preguntas del quiz
  for (let i = 0; i < 4; i++) {
    const options = page.getByTestId("quiz-option");
    await options.first().click();
    await expect(page.getByTestId("quiz-response")).toBeVisible();
    await page.getByRole("button", { name: "Siguiente" }).click();
  }

  // Evaluando (auto-avanza)
  await expect(page.getByText("Evaluando si te mereces un premio...")).toBeVisible();
  await page.waitForTimeout(2500);

  // Resultado evaluación
  await page.getByRole("button", { name: "..." }).click();

  // Countdown falso (auto-avanza)
  const verVideoBtn = page.getByRole("button", { name: "Ver vídeo" });
  await expect(verVideoBtn).toBeVisible({ timeout: 10_000 });

  // Admirador
  await verVideoBtn.click();

  // Vídeo
  await expect(page.getByTestId("surprise-video")).toBeVisible();
  await page.getByTestId("video-close").click();

  // Regalo comido
  await page.getByRole("button", { name: "Ver" }).click();
  await page.getByRole("button", { name: "Recuperarlo" }).click();

  // Ruleta final
  await page.getByTestId("roulette-spin").click();
  await page.waitForTimeout(5000);

  // Pack opening: la apertura ahora es una secuencia dramática de varios
  // segundos (tensión -> rasgado -> flash -> reveal), así que esperamos con
  // un timeout generoso a que aparezca la imagen final.
  await page.getByTestId("pack-button").click();
  await expect(page.getByTestId("final-gift-image")).toBeVisible({
    timeout: 15_000,
  });

  expect(consoleErrors, `Console errors: ${consoleErrors.join(", ")}`).toEqual([]);
  expect(failedRequests, `Failed requests: ${failedRequests.join(", ")}`).toEqual([]);
});
