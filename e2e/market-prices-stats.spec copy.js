// @ts-check
import { test, expect } from '@playwright/test';

test('market-prices-stats page has right title', async ({ page }) => {
    await page.goto('http://localhost:12345/market-prices-stats');
    expect(await page.title()).toBe("Market-prices-stats");
});
test('market-prices-stats create data works', async ({ page }) => {
    await page.goto('http://localhost:12345/market-prices-stats');
    await page.getByText('Cargar Datos Iniciales').click();
    await page.waitForSelector('Table');
    await expect((await page.$$('table tr')).length).toBeGreaterThan(1);
});
test('market-prices-stats delete single resource works', async ({ page }) => {
    await page.goto('http://localhost:12345/market-prices-stats');
    
    // Guarda la cantidad inicial de filas en la tabla
    const initialRowCount = (await page.$$('table tr')).length;
    await page.getByText('Borrar').click();
    await page.waitForSelector('Table');
    // Obtiene la nueva cantidad de filas en la tabla después del borrado
    const newRowCount = (await page.$$('table tr')).length;
    // Verifica que la cantidad de filas se haya reducido en 1
    await expect(newRowCount).toEqual(initialRowCount - 1);
  });
test('market-prices-stats delete all data works', async ({ page }) => {
    await page.goto('http://localhost:12345/market-prices-stats');
    await page.getByText('Borrar recursos').click();
    await page.getByText('Proceder').click();
    await page.waitForSelector('Table');
    await expect((await page.$$('table tr')).length).toEqual(1);


});
