import { test, expect } from '@playwright/test';

test('crear tarea con prioridad Alta', async ({ page }) => {
  await page.goto('http://localhost:8100/board', { timeout: 60000 });

  // 1. Abrir el modal de nueva tarea
  await page.getByRole('button', { name: /add task/i }).click();

  // 2. Llenar el título
  const titleInput = page.locator('ion-input[formcontrolname="title"] input');
  await expect(titleInput).toBeVisible();
  await titleInput.fill('Tarea con prioridad Alta');

  // 3. Abrir el select de prioridad
  const select = page.locator('ion-select[formcontrolname="priority"]');
  await select.click();

  // 4. Esperar y seleccionar la opción "Alta" (popover o alert compatible)
  const altaOption = page.locator('ion-alert button span, ion-select-popover ion-item').filter({
    hasText: 'Alta',
  });

  await expect(altaOption).toBeVisible({ timeout: 5000 });
  await altaOption.click();

  // 5. Hacer clic en "Create"
  const createButton = page.getByRole('button', { name: /create/i });
  await expect(createButton).toBeEnabled();
  await createButton.click();

  // 6. Verificar que la tarea aparece con el título
  const tarea = page.locator('.task-card', {
    has: page.locator('h3', { hasText: 'Tarea con prioridad Alta' }),
  });
  await expect(tarea).toBeVisible({ timeout: 10000 });

  // 7. Verificar que la prioridad es "Alta"
  await expect(tarea.locator('p')).toContainText('Alta');
});
