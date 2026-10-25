import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function capture(page, name) {
    await mkdir('artifacts/review', { recursive: true });
    // Full-page evidence starts at the document top so sticky navigation is not
    // composited across the middle of a page scrolled by native form validation.
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await page.screenshot({ path: `artifacts/review/${name}-${test.info().project.name}.png`, fullPage: true });
}

test('search, rejected payment and confirmed payment respect the report gate', async ({ page, browser }) => {
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    await page.goto('/');
    await page.getByRole('link', { name: 'Dzīvoklis Brīvības iela 64–12 Rīga', exact: true }).click();
    await page.getByRole('link', { name: 'Apskatīt īpašumu', exact: true }).click();
    const propertyURL = page.url();
    await expect(page.getByRole('heading', { name: 'Pilnā informācija ir slēgta' })).toBeVisible();
    expect(await page.content()).not.toContain('87 500');
    await page.goto(`${propertyURL}/atskaite?paid=true`);
    await expect(page).toHaveURL(propertyURL);
    await page.getByRole('button', { name: 'Iegādāties atskaiti', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Maksājuma informācija' })).toBeVisible();
    await page.getByRole('button', { name: 'Izmēģināt noraidītu maksājumu', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Testa maksājuma apstrāde' })).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('Testa maksājums noraidīts', { timeout: 15000 });
    expect(await page.content()).not.toContain('87 500');
    await page.getByRole('button', { name: 'Apmaksāt testa režīmā 9,99 €', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Testa maksājuma apstrāde' })).toBeVisible();
    await expect(page).toHaveURL(`${propertyURL}/atskaite`, { timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Saglabāt kā PDF' })).toBeVisible();
    await expect(page.getByRole('main')).toContainText('87 500');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    // A different browser context does not inherit the first browser's paid access.
    const stranger = await browser.newContext();
    const otherPage = await stranger.newPage();
    await otherPage.goto(`${propertyURL}/atskaite`);
    await expect(otherPage).toHaveURL(propertyURL);
    await expect(otherPage.getByRole('heading', { name: 'Pilnā informācija ir slēgta' })).toBeVisible();
    await stranger.close();
    expect(failures).toEqual([]);
});

test('Latvian field errors stay linked to inputs and preserve useful input', async ({ page }) => {
    await page.goto('/kontakti');
    await page.getByLabel('Vārds, uzvārds', { exact: true }).fill('Testa Pircējs');
    await page.getByLabel('E-pasts', { exact: true }).fill('not-an-email');
    await page.getByLabel('Temats', { exact: true }).fill('Testa jautājums');
    await page.getByLabel('Ziņojums', { exact: true }).fill('Pietiekami gara demonstrācijas ziņa.');
    await page.getByRole('button', { name: 'Nosūtīt ziņojumu' }).click();
    await expect(page.locator('#email-error')).toHaveText('Lūdzu, ievadiet derīgu e-pasta adresi.');
    await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#email')).toHaveAttribute('aria-describedby', 'email-error');
    await capture(page, 'contact');

    // A request that passes browser min-length but fails the server's address rule.
    await page.goto('/');
    await page.locator('#property-search').fill(',,,');
    await page.getByRole('search').first().getByRole('button').click();
    await expect(page.locator('#property-search-error')).toContainText('Lūdzu, pārbaudiet');
    await expect(page.locator('#property-search')).toHaveValue(',,,');
    await expect(page.locator('#property-search')).toHaveAttribute('aria-describedby', 'property-search-error');
});

test('the native demo video loads captions and plays without a CSP error', async ({ page }) => {
    const cspErrors = [];
    page.on('console', message => { if (message.type() === 'error' && /Content Security Policy|Refused to/.test(message.text())) cspErrors.push(message.text()); });
    const response = await page.goto('/demo');
    expect(response.status()).toBe(200);
    const video = page.locator('video');
    await expect(video).toBeVisible();
    await video.evaluate(async element => { element.muted = true; await element.play(); });
    await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(0);
    expect(await video.evaluate(element => element.duration)).toBeGreaterThan(60);
    expect(await video.locator('track').getAttribute('srclang')).toBe('lv');
    await expect.poll(() => video.locator('track').evaluate(element => element.readyState)).toBe(2);
    await video.evaluate(element => { element.pause(); element.currentTime = 20; });
    await expect.poll(() => video.evaluate(element => !element.seeking && element.currentTime >= 20), { timeout: 20000 }).toBe(true);
    await capture(page, 'demo');
    expect(cspErrors).toEqual([]);
});
