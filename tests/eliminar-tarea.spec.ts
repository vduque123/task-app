import { test, expect } from '@playwright/test';

test('eliminar tarea - con confirmación', async ({ page }) => {
  await page.goto('http://localhost:8100/board', { timeout: 60000 });

  // 1. Buscar la tarjeta de la tarea por su título (h3)
  const tarjeta = page.locator('.task-card', {
    has: page.locator('h3', { hasText: 'Tarea actualizada' }),
  });
  await expect(tarjeta).toBeVisible({ timeout: 10000 });

  // 2. Dentro de esa tarjeta, buscar el botón con el ícono de papelera (trash-outline)
  const botonEliminar = tarjeta.locator('ion-button:has(ion-icon[name="trash-outline"])');
  await expect(botonEliminar).toBeVisible({ timeout: 10000 });

  // 3. Hacer clic en el botón de eliminar
  await botonEliminar.click();

  // 4. Confirmar en el modal
  const botonConfirmar = page.getByRole('button', {
    name: /sí|si|yes|confirmar|delete/i,
    exact: false,
  });
  await expect(botonConfirmar).toBeVisible({ timeout: 10000 });
  await botonConfirmar.click();

  // 5. Verificar que la tarjeta ya no aparece
  await expect(tarjeta).toHaveCount(0, { timeout: 10000 });
});
