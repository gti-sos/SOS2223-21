// @ts-check
import { test, expect } from 'playwright-test-coverage';

test('basic test market-prices-stats', async ({ page }) => {
    await page.goto('http://localhost:12345/market-prices-stats');
    expect(await page.title()).toBe("Market-prices-stats");
    await page.getByText('Cargar Datos Iniciales').click();
});
//  test('basic test market-prices-stats', async ({ page }) => {
//      await page.goto('http://localhost:12345/market-prices-stats');
//      await expect(page).toHaveTitle('Cargar Datos Iniciales');

// });