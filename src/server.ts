import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expressHandler } from '@genkit-ai/express';
import { genImgFlow , optionGenFlow, contentGenFlow, productDescGenFlow, imageCaptionGen, imageCaptionGenFlow} from './flows';
import { readFile } from 'node:fs';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
// const fileUpload = require('express-fileupload');
const fs = require('fs');
const multer = require('multer');

const app = express();
app.use(express.json());
// app.use(fileUpload())
const angularApp = new AngularNodeAppEngine();


app.post('/genImgFlow', expressHandler(genImgFlow));
app.post('/optionGenFlow', expressHandler(optionGenFlow));
app.post('/contentGenFlow', expressHandler(contentGenFlow))
app.post('/productDescGenFlow', expressHandler(productDescGenFlow))
// app.post('/imageCaptionGen', expressHandler(imageCaptionGen))/

const storage = multer.memoryStorage(); // Store the file in memory as a buffer
const upload = multer({ storage: storage });

app.post('/imageCaptionGen', upload.single('file'), async (req:any, res)=>{
  res.status(200).send({ message: await imageCaptionGenFlow(req) });
})

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
