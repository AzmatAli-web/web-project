import { test, expect } from '@playwright/test';

// Isolated API fixtures: these are never bundled into the production catalog.
const products = [
  { _id: 'book-1', name: 'Software Engineering textbook', category: 'books', price: 1200, image: '/images/books.jpeg', createdAt: '2026-11-10', seller: { _id: 'seller-1', name: 'Test Seller', email: 'seller@example.test' }, contact: 'Contact available at meetup', location: 'Campus library' },
  { _id: 'laptop-1', name: 'Student laptop', category: 'gadgets', price: 45000, image: '/images/laptop.jpeg', createdAt: '2026-11-11', seller: { _id: 'seller-2', name: 'Test Student' }, location: 'Main campus' },
  { _id: 'pen-1', name: 'Stationery set', category: 'stationery', price: 350, image: '/images/stationary.jpeg', createdAt: '2026-11-09' },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/products**', async route => {
    const url = new URL(route.request().url());
    let response = products;
    if (url.pathname.includes('/category/')) response = products.filter(p => p.category === url.pathname.split('/').at(-1));
    else if (url.pathname.endsWith('/search')) response = products.filter(p => p.name.toLowerCase().includes((url.searchParams.get('q') || '').toLowerCase()));
    else if (/\/products\/[^/]+$/.test(url.pathname)) response = products.find(p => p._id === url.pathname.split('/').at(-1));
    await route.fulfill({ json: response });
  });
});

test('homepage imagery and layout render without overflow or runtime errors', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Small prices.');
  await expect(page.locator('.listing-card')).toHaveCount(3);
  await expect.poll(() => page.locator('.editorial-board img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('hero search and category links show matching results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Search campus marketplace' }).fill('textbook');
  await page.getByRole('button', { name: 'Find it' }).click();
  await expect(page).toHaveURL(/\/search\?q=textbook$/);
  await expect(page.locator('.listing-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Gadgets', exact: true }).click();
  await expect(page).toHaveURL(/\/category\/gadgets$/);
  await expect(page.locator('.listing-card')).toContainText('Student laptop');
});

test('price sorting, product details, seller contact and guest bag flow', async ({ page }) => {
  await page.goto('/browse');
  await page.getByRole('combobox').selectOption('price-low');
  await expect(page.locator('.listing-card').first()).toContainText('Stationery set');
  await page.getByRole('combobox').selectOption('price-high');
  await expect(page.locator('.listing-card').first()).toContainText('Student laptop');
  await page.getByRole('link', { name: 'Software Engineering textbook', exact: true }).last().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Software Engineering textbook');
  await page.getByText('Contact the seller', { exact: true }).click();
  await expect(page.getByRole('link', { name: 'seller@example.test' })).toBeVisible();
  await page.getByRole('button', { name: 'Add to bag' }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test('latest category filter has an honest empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'accessories', exact: true }).click();
  await expect(page.getByText('No finds here just yet.')).toBeVisible();
  await expect(page.locator('.listing-card')).toHaveCount(0);
  await page.getByRole('button', { name: 'All finds', exact: true }).click();
  await expect(page.locator('.listing-card')).toHaveCount(3);
});

test('catalog outage supports retry without fake listings', async ({ page }) => {
  let unavailable = true;
  await page.route('**/api/products', route => unavailable
    ? route.fulfill({ status: 503, json: { message: 'Temporarily unavailable' } })
    : route.fulfill({ json: products }));
  await page.goto('/browse');
  await expect(page.getByRole('alert')).toContainText('Temporarily unavailable');
  await expect(page.locator('.listing-card')).toHaveCount(0);
  unavailable = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('.listing-card')).toHaveCount(3);
});

test('navigation and selling route work on small and large screens', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
  }
  await page.getByRole('navigation').getByRole('link', { name: 'Sell an item' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('tablet layout and reduced motion remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.listing-card')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.locator('.route-content').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
});
