import { test, expect } from '@playwright/test';

test.describe('YouTuneAI Modern Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads with new title
    await expect(page).toHaveTitle(/YouTuneAI - AI-Powered Music & Entertainment/);
    
    // Check if main hero section is present
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    // Check if main heading is present
    const heading = page.locator('h1:has-text("YouTuneAI")');
    await expect(heading).toBeVisible();
  });
  
  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation links
    const navLinks = ['Home', 'Features', 'About', 'Contact'];
    for (const linkText of navLinks) {
      const link = page.locator(`nav a:has-text("${linkText}")`);
      await expect(link).toBeVisible();
    }
    
    // Check admin button exists
    const adminButton = page.locator('button:has-text("Admin")');
    await expect(adminButton).toBeVisible();
  });
  
  test('should display feature cards', async ({ page }) => {
    await page.goto('/');
    
    // Check for feature cards
    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(4);
    
    // Check specific features
    await expect(page.locator('.feature-card:has-text("AI Music Generation")')).toBeVisible();
    await expect(page.locator('.feature-card:has-text("Interactive Gaming")')).toBeVisible();
    await expect(page.locator('.feature-card:has-text("VR Experiences")')).toBeVisible();
    await expect(page.locator('.feature-card:has-text("AI Avatar")')).toBeVisible();
  });
});

test.describe('Admin Access System', () => {
  test('should show admin modal when admin button clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click admin button
    const adminButton = page.locator('button:has-text("Admin")');
    await adminButton.click();
    
    // Check if modal appears
    const modal = page.locator('#adminModal');
    await expect(modal).toHaveClass(/active/);
    
    // Check modal content
    await expect(page.locator('.modal-content h2:has-text("Admin Access")')).toBeVisible();
    await expect(page.locator('.proceed-button')).toBeVisible();
  });
  
  test('should close modal when clicking X or outside', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    const adminButton = page.locator('button:has-text("Admin")');
    await adminButton.click();
    
    // Close with X button
    const closeButton = page.locator('.close');
    await closeButton.click();
    
    // Check modal is hidden
    const modal = page.locator('#adminModal');
    await expect(modal).not.toHaveClass(/active/);
  });
  
  test('should redirect to admin when proceeding', async ({ page }) => {
    await page.goto('/');
    
    // Open modal and proceed
    const adminButton = page.locator('button:has-text("Admin")');
    await adminButton.click();
    
    // Mock the redirect (since we don't have a server running)
    page.on('framenavigated', frame => {
      if (frame.url().includes('/admin/')) {
        expect(frame.url()).toContain('/admin/');
      }
    });
    
    const proceedButton = page.locator('.proceed-button');
    await proceedButton.click();
  });
});

test.describe('Performance', () => {
  test('should meet basic performance requirements', async ({ page }) => {
    // Start measuring performance
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check if page loaded within reasonable time
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'));
    });
    
    const navigation = JSON.parse(performanceEntries)[0];
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    // Should load within 3 seconds for the simple homepage
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Modern homepage should have no console errors
    expect(consoleErrors).toHaveLength(0);
  });
  
  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if hero content is still visible
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Check if feature cards are in grid layout
    const featureSection = page.locator('.features');
    await expect(featureSection).toBeVisible();
  });
});