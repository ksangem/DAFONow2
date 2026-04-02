import { test, expect } from '@playwright/test'

const BASE = '/#'

// ==========================================
// 1. SIDEBAR NAVIGATION
// ==========================================
test.describe('Sidebar', () => {
  test('sidebar is visible with correct width', async ({ page }) => {
    await page.goto(BASE + '/')
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
    const box = await sidebar.boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(195)
    expect(box.width).toBeLessThanOrEqual(210)
  })

  test('all 6 nav items visible', async ({ page }) => {
    await page.goto(BASE + '/')
    for (const label of ['Dashboard', 'Orders', 'Patients', 'Drafts', 'Tracking', 'Help']) {
      await expect(page.locator(`aside >> text="${label}"`)).toBeVisible()
    }
  })

  test('New Order button visible in sidebar', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('aside >> text="New Order"')).toBeVisible()
  })

  test('DAFONow logo text visible', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('aside >> text="DAFONow"')).toBeVisible()
  })

  test('user profile visible in sidebar footer', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('aside >> text="Dr. Rebecca Lin"')).toBeVisible()
  })

  test('nav links navigate correctly', async ({ page }) => {
    await page.goto(BASE + '/')
    for (const [label, hash] of [
      ['Orders', '/orders'],
      ['Patients', '/patients'],
      ['Drafts', '/drafts'],
      ['Tracking', '/tracking'],
      ['Help', '/help'],
    ]) {
      await page.locator(`aside >> text="${label}"`).click()
      await expect(page).toHaveURL(new RegExp(hash))
    }
  })
})

// ==========================================
// 2. HEADER
// ==========================================
test.describe('Header', () => {
  test('search bar visible with placeholder', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('header >> text="Search patient, order, or job #"')).toBeVisible()
  })

  test('notification bell visible', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('button[aria-label="Notifications"]')).toBeVisible()
  })

  test('clicking search bar opens global search', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.locator('header >> text="Search patient, order, or job #"').click()
    await expect(page.locator('input[placeholder*="Search patient"]')).toBeVisible()
  })
})

// ==========================================
// 3. AWARENESS STRIP
// ==========================================
test.describe('Awareness Strip', () => {
  test('draft awareness strip visible with link', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('text="View Drafts"')).toBeVisible()
  })

  test('View Drafts link works', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.locator('text="View Drafts"').click()
    await expect(page).toHaveURL(/#\/drafts/)
  })
})

// ==========================================
// 4. DASHBOARD
// ==========================================
test.describe('Dashboard', () => {
  test('welcome message visible', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('h1 >> text="Dashboard"')).toBeVisible()
  })

  test('4 stat cards visible', async ({ page }) => {
    await page.goto(BASE + '/')
    for (const label of ['Active Orders', 'Drafts', 'In Transit', 'Patients']) {
      await expect(page.locator(`text="${label}"`).first()).toBeVisible()
    }
  })

  test('recent orders table visible', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('text="Recent Orders"')).toBeVisible()
    await expect(page.locator('text="ORD-4521"').first()).toBeVisible()
  })

  test('tracking section visible', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('text="Active Tracking"')).toBeVisible()
  })

  test('quick actions visible', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('text="Quick Actions"')).toBeVisible()
  })

  test('resume drafts section visible', async ({ page }) => {
    await page.goto(BASE + '/')
    await expect(page.locator('text="Resume Drafts"')).toBeVisible()
  })

  test('content not clipped behind sidebar', async ({ page }) => {
    await page.goto(BASE + '/')
    const main = page.locator('main')
    const box = await main.boundingBox()
    expect(box.x).toBeGreaterThanOrEqual(195)
  })
})

// ==========================================
// 5. ORDERS PAGE
// ==========================================
test.describe('Orders Page', () => {
  test('orders table visible with data', async ({ page }) => {
    await page.goto(BASE + '/orders')
    await expect(page.locator('text="ORD-4521"').first()).toBeVisible()
    await expect(page.locator('text="DAFO 3.5"').first()).toBeVisible()
  })

  test('filter buttons visible', async ({ page }) => {
    await page.goto(BASE + '/orders')
    await expect(page.locator('button >> text="All"').first()).toBeVisible()
  })

  test('clicking order navigates to detail', async ({ page }) => {
    await page.goto(BASE + '/orders')
    await page.locator('text="ORD-4521"').first().click()
    await expect(page).toHaveURL(/#\/orders\/ORD-4521/)
  })
})

// ==========================================
// 6. ORDER DETAIL
// ==========================================
test.describe('Order Detail', () => {
  test('order header info visible', async ({ page }) => {
    await page.goto(BASE + '/orders/ORD-4521')
    await expect(page.locator('h1 >> text="ORD-4521"')).toBeVisible()
  })

  test('tracking timeline visible', async ({ page }) => {
    await page.goto(BASE + '/orders/ORD-4521')
    await expect(page.locator('text="Order Tracking"')).toBeVisible()
    await expect(page.locator('text="Submitted"').first()).toBeVisible()
  })

  test('patient sidebar visible', async ({ page }) => {
    await page.goto(BASE + '/orders/ORD-4521')
    await expect(page.locator('text="Emma Thompson"').first()).toBeVisible()
  })

  test('back to orders link works', async ({ page }) => {
    await page.goto(BASE + '/orders/ORD-4521')
    await page.locator('text="Back to Orders"').click()
    await expect(page).toHaveURL(/#\/orders/)
  })
})

// ==========================================
// 7. NEW ORDER FLOW (5 STEPS)
// ==========================================
test.describe('New Order Flow', () => {
  test('step 1: patient selection visible', async ({ page }) => {
    await page.goto(BASE + '/orders/new')
    await expect(page.locator('text="Select Patient"')).toBeVisible()
    await expect(page.locator('text="Emma Thompson"').first()).toBeVisible()
  })

  test('step 1→2: select patient then continue', async ({ page }) => {
    await page.goto(BASE + '/orders/new')
    await page.locator('text="Emma Thompson"').first().click()
    await page.locator('text="Continue"').click()
    await expect(page.locator('text="Select DAFO Type"')).toBeVisible()
  })

  test('full 5-step flow to submit', async ({ page }) => {
    await page.goto(BASE + '/orders/new')
    // Step 1
    await page.locator('text="Emma Thompson"').first().click()
    await page.locator('text="Continue"').click()
    // Step 2
    await page.locator('text="DAFO 3.5"').first().click()
    await page.locator('text="Continue"').click()
    // Step 3
    await expect(page.locator('text="Customize Specifications"')).toBeVisible()
    await page.locator('text="Continue"').click()
    // Step 4
    await expect(page.locator('text="Review Your Order"')).toBeVisible()
    await page.locator('text="Proceed to Submit"').click()
    // Step 5
    await expect(page.locator('text="Ready to Submit"')).toBeVisible()
    await page.locator('text="Submit Order to Cascade"').click()
    // Success
    await expect(page.locator('text="Order Submitted"')).toBeVisible()
  })

  test('save draft available from step 3', async ({ page }) => {
    await page.goto(BASE + '/orders/new')
    await page.locator('text="Emma Thompson"').first().click()
    await page.locator('text="Continue"').click()
    await page.locator('text="DAFO 3.5"').first().click()
    await page.locator('text="Continue"').click()
    await expect(page.locator('text="Save Draft"')).toBeVisible()
  })

  test('discard draft modal works', async ({ page }) => {
    await page.goto(BASE + '/orders/new')
    await page.locator('text="Emma Thompson"').first().click()
    await page.locator('text="Continue"').click()
    await page.locator('text="DAFO 3.5"').first().click()
    await page.locator('text="Continue"').click()
    await page.locator('text="Discard Draft"').first().click()
    await expect(page.locator('text="Discard this draft?"')).toBeVisible()
    await page.locator('button >> text="Cancel"').click()
  })
})

// ==========================================
// 8. PATIENTS PAGE
// ==========================================
test.describe('Patients Page', () => {
  test('patient table visible', async ({ page }) => {
    await page.goto(BASE + '/patients')
    await expect(page.locator('h1 >> text="Patients"')).toBeVisible()
    await expect(page.locator('text="Emma Thompson"').first()).toBeVisible()
    await expect(page.locator('text="Liam Chen"').first()).toBeVisible()
  })

  test('patient click navigates to detail', async ({ page }) => {
    await page.goto(BASE + '/patients')
    await page.locator('text="Emma Thompson"').first().click()
    await expect(page).toHaveURL(/#\/patients\/P-1001/)
  })
})

// ==========================================
// 9. PATIENT DETAIL
// ==========================================
test.describe('Patient Detail', () => {
  test('patient info and order history visible', async ({ page }) => {
    await page.goto(BASE + '/patients/P-1001')
    await expect(page.locator('h1 >> text="Emma Thompson"')).toBeVisible()
    await expect(page.locator('text=/Order History/')).toBeVisible()
  })
})

// ==========================================
// 10. DRAFTS PAGE
// ==========================================
test.describe('Drafts Page', () => {
  test('drafts list visible', async ({ page }) => {
    await page.goto(BASE + '/drafts')
    await expect(page.locator('h1 >> text="Drafts"')).toBeVisible()
    await expect(page.locator('text="Resume"').first()).toBeVisible()
  })

  test('discard button triggers modal', async ({ page }) => {
    await page.goto(BASE + '/drafts')
    await page.locator('text="Discard"').first().click()
    await expect(page.locator('text="Discard this draft?"')).toBeVisible()
  })
})

// ==========================================
// 11. TRACKING PAGE
// ==========================================
test.describe('Tracking Page', () => {
  test('tracking page visible with orders', async ({ page }) => {
    await page.goto(BASE + '/tracking')
    await expect(page.locator('h1 >> text="Order Tracking"')).toBeVisible()
    await expect(page.locator('text="ORD-4521"').first()).toBeVisible()
  })
})

// ==========================================
// 12. HELP PAGE
// ==========================================
test.describe('Help Page', () => {
  test('help page content visible', async ({ page }) => {
    await page.goto(BASE + '/help')
    await expect(page.locator('text="Help & Support"')).toBeVisible()
    await expect(page.locator('text="Phone"').first()).toBeVisible()
    await expect(page.locator('text="Email"').first()).toBeVisible()
  })

  test('FAQ section visible', async ({ page }) => {
    await page.goto(BASE + '/help')
    await expect(page.locator('text="Frequently Asked Questions"')).toBeVisible()
  })
})

// ==========================================
// 13. GLOBAL SEARCH (via click, not keyboard)
// ==========================================
test.describe('Global Search', () => {
  test('search opens and finds patients', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.locator('header >> text="Search patient, order, or job #"').click()
    await page.locator('input[placeholder*="Search patient"]').fill('Emma')
    await expect(page.locator('text="Emma Thompson"').first()).toBeVisible()
  })

  test('search finds orders', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.locator('header >> text="Search patient, order, or job #"').click()
    await page.locator('input[placeholder*="Search patient"]').fill('ORD-4521')
    await expect(page.locator('text="ORD-4521"').first()).toBeVisible()
  })
})

// ==========================================
// 14. VISUAL / LAYOUT CHECKS
// ==========================================
test.describe('Layout Integrity', () => {
  test('no horizontal overflow on dashboard', async ({ page }) => {
    await page.goto(BASE + '/')
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
  })

  test('all pages load without JS errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    const routes = ['/', '/orders', '/patients', '/drafts', '/tracking', '/help', '/orders/new', '/orders/ORD-4521', '/patients/P-1001']
    for (const route of routes) {
      await page.goto(BASE + route)
      await page.waitForTimeout(300)
    }
    expect(errors).toEqual([])
  })
})
