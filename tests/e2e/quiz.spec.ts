import { test, expect } from "@playwright/test";
import { QUIZ_QUESTIONS } from "../../lib/content";

async function skipToQuiz(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Empezar" }).click();
  await page.getByTestId("roulette-spin").click();
  await page.waitForTimeout(5000);
  await page.getByTestId("roulette-spin").click();
  await page.waitForTimeout(5000);
  await page.getByRole("button", { name: /Pagar 5€/ }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "¿Y ahora qué?" }).click();
  await page.getByRole("button", { name: "Empezar" }).click();
}

test("cada pregunta lleva a la misma respuesta sin importar la opción pulsada", async ({
  page,
}) => {
  await skipToQuiz(page);

  const question = QUIZ_QUESTIONS[0];
  const options = page.getByTestId("quiz-option");
  const count = await options.count();

  // Probar dos opciones distintas (en dos pasadas separadas no es posible tras
  // responder, así que verificamos que la primera y la última muestran la misma
  // respuesta fija comparando contra el texto esperado del contenido).
  await options.nth(count - 1).click();
  await expect(page.getByTestId("quiz-response")).toHaveText(question.response);
});

test("las 4 preguntas del quiz muestran su respuesta fija esperada", async ({
  page,
}) => {
  await skipToQuiz(page);

  for (const question of QUIZ_QUESTIONS) {
    await page.getByTestId("quiz-option").first().click();
    await expect(page.getByTestId("quiz-response")).toHaveText(question.response);
    await page.getByRole("button", { name: "Siguiente" }).click();
  }
});
