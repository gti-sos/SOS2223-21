// @ts-check
import { test, expect } from '@playwright/test';

test('workingplaces-stats page has right title', async ({ page }) => {
    await page.goto('http://localhost:12345/workingplaces-stats');
    expect(await page.title()).toBe("Workingplaces-stats");
});
test('workingplaces-stats create data works', async ({ page }) => {
    await page.goto('http://localhost:12345/workingplaces-stats');
    await page.getByText('Cargar Datos Iniciales').click();
    await page.waitForSelector('Table');
    await expect((await page.$$('table tr')).length).toBeGreaterThan(1);
});

test('workingplaces-stats delete all data works', async ({ page }) => {
    await page.goto('http://localhost:12345/workingplaces-stats');
    await page.getByText('Borrar recursos').click();
    await page.getByText('Proceder').click();
    await page.waitForSelector('Table');
    await expect((await (await page.locator('.WorkingplaceRow')).all()).length).toEqual(0);


}); 
