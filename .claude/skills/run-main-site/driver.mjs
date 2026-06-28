#!/usr/bin/env node
/**
 * Driver for main-site (Next.js). Launches headless Chromium via Playwright.
 *
 * Usage:
 *   node driver.mjs [command] [args...]
 *
 * Commands:
 *   screenshot [url] [outfile]   Navigate to url and screenshot. Defaults:
 *                                url=http://localhost:3000, outfile=/tmp/shots/main-site.png
 *   smoke                        Run smoke test across key routes
 *   nav <url>                    Navigate and screenshot to /tmp/shots/shot.png
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';

const SHOTS_DIR = '/tmp/shots';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

await mkdir(SHOTS_DIR, { recursive: true });

const [, , cmd = 'screenshot', ...args] = process.argv;

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

async function shot(url, outFile) {
  outFile = outFile || path.join(SHOTS_DIR, 'main-site.png');
  console.log(`nav ${url} → ${outFile}`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: outFile, fullPage: false });
  console.log(`screenshot saved: ${outFile}`);
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  if (errs.length) console.warn('console errors:', errs);
}

if (cmd === 'screenshot') {
  const url = args[0] || BASE_URL;
  const outFile = args[1] || path.join(SHOTS_DIR, 'main-site.png');
  await shot(url, outFile);
} else if (cmd === 'nav') {
  await shot(args[0] || BASE_URL, path.join(SHOTS_DIR, 'shot.png'));
} else if (cmd === 'smoke') {
  const routes = [
    ['/', 'home.png'],
    ['/marketplace', 'marketplace.png'],
    ['/samples/barbershop', 'samples-barbershop.png'],
    ['/samples/plumbing', 'samples-plumbing.png'],
    ['/contact', 'contact.png'],
  ];
  for (const [route, file] of routes) {
    await shot(BASE_URL + route, path.join(SHOTS_DIR, file));
  }
  console.log('smoke done — screenshots in', SHOTS_DIR);
} else {
  console.error(`unknown command: ${cmd}`);
  process.exit(1);
}

await browser.close();
