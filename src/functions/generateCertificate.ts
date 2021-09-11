import path from 'path';
import fs from 'fs';

import chromium  from 'chrome-aws-lambda';
import { document } from '../utils/dynamoDbClient';
import * as Handlebars from 'handlebars';
import dayjs from 'dayjs';
import { S3 } from 'aws-sdk';

interface ICreateCertificate {
  id: string;
  name: string;
  grade: string;
}

interface ITemplate {
  id: string;
  name: string;
  grade: string;
  date: string;
  medal: string;
}

const compile = async (data: ITemplate) => {
  const filePath = path.join(process.cwd(), 'src', 'template', 'certificate.hbs');
  const html = fs.readFileSync(filePath, 'utf-8');

  return Handlebars.compile(html)(data);
}

export const handle = async (event) => {
  const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate;
  console.log('test1', process.env.IS_OFFLINE)

  await document.put({
    TableName: "users_certificates",
    Item: {
      id,
      name,
      grade,
    }
  }).promise();

  console.log('test2')
  const medalPath = path.join(process.cwd(), 'src', 'teplates', 'selo.png');
  const medal = fs.readFileSync(medalPath, 'base64');

  const data: ITemplate = {
    id,
    name,
    grade,
    date: dayjs().format('DD/MM/YYYY'),
    medal,
  };

  const content = await compile(data);

  const browser = await chromium.puppeteer.launch({
    headless: true,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
  });

  const page = await browser.newPage();

  await page.setContent(content);

  const PDF = await page.pdf({
    format: 'a4',
    landscape: true,
    path: process.env.IS_OFFLINE ? "certificate.pdf" : null,
    printBackground: true,
    preferCSSPageSize: true,
  });

  browser.close();

  const s3 = new S3();

  await s3.putObject({
    Bucket: 'srvless-ignite-certificate',
    Key: `${id}.pdf`,
    ACL: 'public-read',
    Body: PDF,
    ContentType: "application/pdf"
  })
  .promise();
  
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Certificate Created!"
    }),
    headers: {
      "Content-Type": "application/json"
    },
  };
}
