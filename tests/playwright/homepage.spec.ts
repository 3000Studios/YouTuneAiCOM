import { test, expect } from '@playwright/test';

test.describe('YouTuneAI Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads
    await expect(page).toHaveTitle(/YouTuneAI|YouTune/);
    
    // Check if main navigation is present
    const navigation = page.locator('nav.main-navigation');
    await expect(navigation).toBeVisible();
    
    // Check if site branding is present
    const branding = page.locator('.site-branding');
    await expect(branding).toBeVisible();
  });
  
  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile menu toggle
    await page.setViewportSize({ width: 375, height: 667 });
    
    const menuToggle = page.locator('.menu-toggle');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      
      const menu = page.locator('.main-navigation ul');
      await expect(menu).toBeVisible();
    }
  });
});

test.describe('Avatar Chat System', () => {
  test('should display avatar chat bubble', async ({ page }) => {
    await page.goto('/');
    
    // Wait for chat bubble to appear
    const chatBubble = page.locator('#avatar-chat-bubble');
    await expect(chatBubble).toBeVisible({ timeout: 10000 });
  });
  
  test('should open chat interface on click', async ({ page }) => {
    await page.goto('/');
    
    // Wait for and click chat bubble
    const chatBubble = page.locator('#avatar-chat-bubble');
    await chatBubble.waitFor({ state: 'visible', timeout: 10000 });
    
    const avatarContainer = chatBubble.locator('.avatar-container');
    await avatarContainer.click();
    
    // Check if chat opens
    await expect(chatBubble).toHaveClass(/chat-open/);
    
    // Check if input field is visible
    const inputField = chatBubble.locator('#chat-input-field');
    await expect(inputField).toBeVisible();
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
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
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
    await page.waitForTimeout(3000);
    
    // Filter out known acceptable errors (like missing 3D models in test environment)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('404') && 
      !error.includes('avatar') && 
      !error.includes('.glb')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});