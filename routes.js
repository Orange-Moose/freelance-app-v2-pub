import { login } from './controllers/authController.js';
import { registerForm, loginForm, register, validateRegister, logout } from './controllers/userController.js';
import { getHomepage, saveClient, useClient, editClient, searchClients, getClients } from './controllers/clientController.js';
import { getLogs, saveDocumentLog, useDocumentLog, searchDocumentLogs } from './controllers/documentController.js';
import { getPdfText } from './PDF/pdfContent.js';
import { createPdf, downloadPdf } from './PDF/pdf.js';



import express from 'express';
const router = express.Router();


// REGISTER
router.get('/register', registerForm);
router.post('/register',
  validateRegister, // middleware (userController)
  register, // middleware (userController)
  login // login the user (authController);
);

// LOG IN
router.get('/login', loginForm);
router.post('/login', login);
router.get('/logout', logout);



///// CLIENT ROUTES /////
router.get('/', getHomepage);
router.get('/clients', getClients);
router.post('/new-client', saveClient);
router.post('/client/:action', useClient);
router.post('/update-client', editClient);

///// HISTORY LOG ROUTES /////
router.get('/logs', getLogs);
router.post('/save-log', saveDocumentLog);
router.post('/invoice-log/:action', useDocumentLog);


///// PDF ROUTES /////

router.post('/pdf', getPdfText, createPdf);
router.get('/pdf', downloadPdf);

///// SEARCH ROUTES /////
router.get('/search', searchClients);
router.get('/search-logs', searchDocumentLogs);

export default router;


