import { test, expect } from '@playwright/test';

test('crear tarea - flujo básico con ion-input', async ({ page }) => {
  await page.goto('http://localhost:8100/board', { timeout: 60000 });

  const addTaskButton = page.getByRole('button', { name: /add task/i });
  await expect(addTaskButton).toBeVisible();
  await addTaskButton.click();

  const titleInput = page.locator('ion-input[formcontrolname="title"] input');
  await expect(titleInput).toBeVisible();
  await titleInput.fill('nueva tarea');

  const createButton = page.getByRole('button', { name: /create/i });
  await expect(createButton).toBeEnabled();
  await createButton.click();

  // Verificar la tarea recién creada
  await expect(
    page.getByRole('heading', { name: 'nueva tarea', level: 3 }).first()
  ).toBeVisible({ timeout: 10000 });
});
