import chromium from 'playwright';
let browser;
let page;

beforeAll(async () => {
  browser = await chromium.launch();
});
afterAll(async () => {
  await browser.close();
});
beforeEach(async () => {
  page = await browser.newPage();
});
afterEach(async () => {
  await page.close();
});
it("Home page should have the correct title", async () => {
    await page.goto("http://localhost:12345/market-prices-stats");
    expect(await page.title()).toBe("Market-prices-stats");
    await page.getByText('Cargar Datos Iniciales').click();
});