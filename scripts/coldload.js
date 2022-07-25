import fs from 'fs';
import open from 'open';
import puppeteer from 'puppeteer';
import {startFlow} from 'lighthouse/lighthouse-core/fraggle-rock/api.js';

async function captureReport() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  const flow = await startFlow(page, {name: 'Single Navigation'});
  await flow.navigate('https://web.dev/performance-scoring/');

  await browser.close();

  const report = await flow.generateReport();
  fs.writeFileSync('coldload.flow.report.html', report);
  open('flow.report.html', {wait: false});
}

captureReport();