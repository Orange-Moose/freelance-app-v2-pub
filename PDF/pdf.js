
let fonts = {
  Roboto: {
    thin: './fonts/Roboto-Thin.ttf',
    light: './fonts/Roboto-Light.ttf',
    normal: './fonts/Roboto-Regular.ttf',
    medium: './fonts/Roboto-Medium.ttf',
    bold: './fonts/Roboto-Bold.ttf',
    italic: './fonts/Roboto-Italic.ttf',
    lightItalic: './fonts/Roboto-LightItalic.ttf'
  }
};

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import Pdfmake from 'pdfmake'; 
let pdfmake = new Pdfmake(fonts);


const __dirname = path.dirname(fileURLToPath(import.meta.url));



const createPdf = async (req, res) => {

  let docDefinition = await req.pdfText; // req.pdfText comes from pdfContent.js middleware
  let pdfDoc = await pdfmake.createPdfKitDocument(docDefinition);
  
  const absPath = path.join(__dirname, 'downloads');
  const filenames = fs.readdirSync(absPath);
  const pathToFile = path.join(__dirname, 'downloads', filenames[0] || '');
  
  // clear /downloads folder before creating new PDF document
  if(filenames.length) {
    try {
      fs.unlinkSync(pathToFile);
    } catch (err) {
      throw err;
    }
  }
  
  pdfDoc.pipe(fs.createWriteStream(`${absPath}/${req.body.docData.type + " " + req.body.docData.serial || "empty"}.pdf`));
  pdfDoc.end();   
};

const downloadPdf = (req, res) => {
  const absPath = path.join(__dirname, '..', 'PDF/downloads')
  const filename = fs.readdirSync(absPath);
  
  res.download(`${absPath}/${filename}`);
};

export { createPdf, downloadPdf };