import fs from 'fs';
import open from 'open';
import puppeteer from 'puppeteer';
import {startFlow} from 'lighthouse/lighthouse-core/fraggle-rock/api.js'

async function captureReport() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
  
    const flow = await startFlow(page, {name: 'Squoosh snapshots'});
  
    await page.goto('https://squoosh.app/', {waitUntil: 'networkidle0'});
  
    // Wait for first demo-image button, then open it.
    const demoImageSelector = 'ul[class*="demos"] button';
    await page.waitForSelector(demoImageSelector);
    await flow.snapshot({stepName: 'Page loaded'});
    await page.click(demoImageSelector);
  
    // Wait for advanced settings button in UI, then open them.
    const advancedSettingsSelector = 'form label[class*="option-reveal"]';
    await page.waitForSelector(advancedSettingsSelector);
    await flow.snapshot({stepName: 'Demo loaded'});
    await page.click(advancedSettingsSelector);
  
    await flow.snapshot({stepName: 'Advanced settings opened'});
  
    browser.close();
  
    const report = await flow.generateReport();
    fs.writeFileSync('snapshotflow.report.html', report);
    open('snapshotflow.report.html', {wait: false});
  }
  
  captureReport();