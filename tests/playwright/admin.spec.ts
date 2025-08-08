import { test, expect } from '@playwright/test';

// Only run admin tests if admin credentials are provided
const adminUser = process.env.WP_ADMIN_USER || 'admin';
const adminPass = process.env.WP_ADMIN_PASS || 'password';
const skipAdminTests = !process.env.WP_ADMIN_USER;

test.describe('Admin Control Center', () => {
  test.skip(skipAdminTests, 'Admin credentials not provided');
  
  test.beforeEach(async ({ page }) => {
    // Login to WordPress admin
    await page.goto('/wp-admin');
    
    await page.fill('#user_login', adminUser);
    await page.fill('#user_pass', adminPass);
    await page.click('#wp-submit');
    
    // Wait for dashboard
    await page.waitForURL(/wp-admin/);
  });
  
  test('should access YouTune Admin Control Center', async ({ page }) => {
    // Navigate to YouTune Admin
    await page.goto('/wp-admin/admin.php?page=youtune-admin');
    
    // Check if admin page loads
    await expect(page.locator('.youtune-admin-wrap')).toBeVisible();
    
    // Check if header is present
    const header = page.locator('.youtune-admin-header');
    await expect(header).toBeVisible();
    await expect(header).toContainText('YouTune Admin Control Center');
  });
  
  test('should have all control cards', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=youtune-admin');
    
    // Check for all expected cards
    const expectedCards = [
      'Deploy',
      'Seed Content', 
      'Cache',
      'Optimize Media',
      'Stream Setup',
      'Avatar Tune',
      'Ads & Analytics',
      'Run Tests'
    ];
    
    for (const cardName of expectedCards) {
      const card = page.locator('.admin-card').filter({ hasText: cardName });
      await expect(card).toBeVisible();
    }
  });
  
  test('should execute admin actions', async ({ page }) => {
    await page.goto('/wp-admin/admin.php?page=youtune-admin');
    
    // Test cache flush action
    const flushButton = page.locator('[data-action="flush"]');
    await flushButton.click();
    
    // Wait for action to complete
    await expect(page.locator('#log-status')).toContainText('Ready', { timeout: 10000 });
    
    // Check if log shows activity
    const activityLog = page.locator('#activity-log');
    await expect(activityLog).not.toBeEmpty();
  });
});

test.describe('Custom Post Types Admin', () => {
  test.skip(skipAdminTests, 'Admin credentials not provided');
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/wp-admin');
    await page.fill('#user_login', adminUser);
    await page.fill('#user_pass', adminPass);
    await page.click('#wp-submit');
    await page.waitForURL(/wp-admin/);
  });
  
  test('should have Games CPT in admin menu', async ({ page }) => {
    const gamesMenuItem = page.locator('#menu-posts-game');
    await expect(gamesMenuItem).toBeVisible();
  });
  
  test('should have Streams CPT in admin menu', async ({ page }) => {
    const streamsMenuItem = page.locator('#menu-posts-stream');
    await expect(streamsMenuItem).toBeVisible();
  });
  
  test('should have Avatars CPT in admin menu', async ({ page }) => {
    const avatarsMenuItem = page.locator('#menu-posts-avatar');
    await expect(avatarsMenuItem).toBeVisible();
  });
  
  test('should create new game post', async ({ page }) => {
    await page.goto('/wp-admin/post-new.php?post_type=game');
    
    // Fill out game details
    await page.fill('#title', 'Test Game');
    
    // Check if game-specific meta boxes are present
    const gameDetails = page.locator('#game_details');
    await expect(gameDetails).toBeVisible();
  });
});