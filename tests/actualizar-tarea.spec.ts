import { test, expect } from '@playwright/test';

test('actualizar tarea - editar título', async ({ page }) => {
  await page.goto('http://localhost:8100/board', { timeout: 60000 });

  // 1. Esperar la tarea original
  const tareaOriginal = page.getByRole('heading', { name: 'nueva tarea', level: 3 }).first();
  await expect(tareaOriginal).toBeVisible({ timeout: 10000 });

  // 2. Buscar el botón de editar que esté cerca del heading de la tarea
  const tareaContainer = tareaOriginal.locator('..').locator('..'); // sube 2 niveles desde el <h3>
  const editButton = tareaContainer.getByRole('button').nth(0); // asumiendo que el primer botón es editar (ajústalo si no)
  await editButton.click();

  // 3. Esperar el campo de edición de título
  const titleInput = page.locator('ion-input[formcontrolname="title"] input');
  await expect(titleInput).toBeVisible();
  await titleInput.fill('Tarea actualizada');

  // 4. Clic en el botón "Update" (puede variar a "Save" o similar)
  const updateButton = page.getByRole('button', { name: /update/i });
  await expect(updateButton).toBeEnabled();
  await updateButton.click();

  // 5. Verificar que aparece el nuevo título
  await expect(
    page.getByRole('heading', { name: 'Tarea actualizada', level: 3 }).first()
  ).toBeVisible({ timeout: 10000 });
});
