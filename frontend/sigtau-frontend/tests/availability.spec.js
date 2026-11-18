import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
 await page.clock.install({ time: new Date('2026-11-20T10:00:00') });
 await page.addInitScript(() => {
  const token = btoa(JSON.stringify({ alg: 'none' })) + '.' + btoa(JSON.stringify({ role: 'STUDENT', exp: 4102444800 })) + '.test';
  localStorage.setItem('token', token);
  localStorage.setItem('role', 'STUDENT');
 });
 const base = { tutoringDate: '2026-11-20', endTime: '12:00:00', status: 'OPEN', availableSpots: 2, subjectName: 'Cálculo', careerName: 'Ingeniería', tutorName: 'Tutor', modalityName: 'Virtual' };
 await page.route('http://localhost:8080/**', async route => {
  const path = new URL(route.request().url()).pathname;
  let data = [];
  if (path === '/tutorings') data = [
   { ...base, id: 1, title: 'Pasada', startTime: '09:00:00' },
   { ...base, id: 2, title: 'Próxima', startTime: '10:00:05' },
  ];
  if (path === '/enrollments/my') data = [
   { ...base, id: 1, tutoringTitle: 'Pasada', startTime: '09:00:00', status: 'ACTIVE' },
   { ...base, id: 2, tutoringTitle: 'Próxima', startTime: '10:00:05', status: 'ACTIVE' },
  ];
  await route.fulfill({ json: data });
 });
});

test('catálogo oculta pasadas y actualiza el límite sin recargar', async ({ page }) => {
 await page.goto('/tutorings');
 await expect(page.getByRole('heading', { name: 'Próxima', exact: true })).toBeVisible();
 await expect(page.getByRole('heading', { name: 'Pasada', exact: true })).toHaveCount(0);
 await page.getByLabel('Solo próximas con cupos disponibles').uncheck();
 await expect(page.locator('.card').filter({ hasText: 'Pasada' }).getByRole('button')).toBeDisabled();
 await expect(page.locator('.card').filter({ hasText: 'Próxima' }).getByRole('button')).toBeEnabled();
 await page.clock.fastForward(6000);
 await expect(page.locator('.card').filter({ hasText: 'Próxima' }).getByRole('button')).toBeDisabled();
});

test('cancelación no se ofrece después del inicio, incluso con confirmación abierta', async ({ page }) => {
 await page.goto('/my-enrollments');
 await expect(page.getByRole('row').filter({ hasText: 'Pasada' })).toContainText('Plazo de cancelación finalizado');
 await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
 await expect(page.getByRole('button', { name: 'Confirmar cancelación' })).toBeEnabled();
 await page.clock.fastForward(6000);
 await expect(page.getByRole('button', { name: 'Confirmar cancelación' })).toBeDisabled();
});
