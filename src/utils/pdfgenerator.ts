// utils/pdfGenerator.ts
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';

export const generatePDFWithPuppeteer = async (instructorReportDetails: any): Promise<string> => {
  const templatePath = path.join(__dirname, '../templates/monthlyreport.ejs');
  const html: string = await ejs.renderFile(templatePath, {
    instructordetails: instructorReportDetails
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const fileName = `montly-report-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, `../reports/${fileName}`);
  console.log(filePath);

  await page.pdf({
    path: filePath,
    format: 'A4',
    printBackground: true
  });

  await browser.close();
  return filePath;
};
