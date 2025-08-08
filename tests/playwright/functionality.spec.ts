import { test, expect } from '@playwright/test';

test.describe('WooCommerce Integration', () => {
  test('should navigate to shop page', async ({ page }) => {
    await page.goto('/shop');
    
    // Check if shop page loads
    await expect(page.locator('.woocommerce')).toBeVisible();
    
    // Check for shop header
    const shopTitle = page.locator('h1');
    await expect(shopTitle).toContainText(/shop|store/i);
  });
  
  test('should display product grid', async ({ page }) => {
    await page.goto('/shop');
    
    // Wait for products to load
    const products = page.locator('.woocommerce ul.products li');
    await expect(products.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Custom Post Types', () => {
  test('should access games archive', async ({ page }) => {
    await page.goto('/games');
    
    // Should not return 404
    await expect(page.locator('body')).not.toHaveClass(/error-404/);
    
    // Should have some content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
  
  test('should access VR room page', async ({ page }) => {
    await page.goto('/vr-room');
    
    // Should not return 404
    await expect(page.locator('body')).not.toHaveClass(/error-404/);
    
    // Should have VR-related content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
  
  test('should access YouTune Garage', async ({ page }) => {
    await page.goto('/youtune-garage');
    
    // Should not return 404
    await expect(page.locator('body')).not.toHaveClass(/error-404/);
    
    // Should have garage-related content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});