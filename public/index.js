import { clientsContainer, logsContainer, docsContainer, clientForm, downloadBtn, newClientBox, updateClientBox, clientFormInputs, docSwitch, dateInput, serialInput, clientSearchInput, logSearchInput, getDocsContainerElements, getInvoiceLineElements, getTotalsElements } from './base.js';
import { addClient, useClient, updateClient, populateClientForm, clientSearch } from './clients.js';
import { renderMarkup, showNotification, clearEl, getValues, getInvLinesValues, getDate, getSerial } from './utils/utils.js';
import { agreementMarkup, invoiceMarkup, serviceMarkup, expenseMarkup } from './markup.js';
import { saveInvData, useInvData, getPDFdata, logsSearch } from './docs.js';

// STATE
let cardId;


const handleClientFormCheckbox = (e) => {  
  if (e.target.name === "add-new" && e.target.checked) {
    updateClientBox.checked = false;
  };
  
  if (e.target.name === "update" && e.target.checked) {
    newClientBox.checked = false;
  };
}

//Fill default form values on initial pageload
dateInput.value = getDate();
serialInput.value = getSerial('invoice');


const switchForm = () => {
  if (docSwitch.checked === true) {
    clearEl(docsContainer);
    renderMarkup(docsContainer, agreementMarkup);
  } else {
    clearEl(docsContainer);
    renderMarkup(docsContainer, invoiceMarkup);
    addDOMobserver();
  }
};

const handleSidebarClient = async (e) => {
  if (e.target.closest('.client-card') !== null && !e.target.classList.contains("delete-client")) {
    cardId = e.target.closest('.client-card').id;

    const data = await useClient(cardId, "get");
    populateClientForm(data);

    updateClientBox.disabled = false;
    newClientBox.checked = false;

    return;
  }

  if (e.target.classList.contains("delete-client")) {
    const cardId = e.target.parentElement.id;
    await useClient(cardId, "delete"); // wait for data before reloading
    return window.location.reload(true);
  }
};

const handleMainForm = async (e) => {
  let docFormInputs;
  let invoiceTableData;
  
  
  if (docSwitch.checked === false) {
    const docInfo = document.querySelectorAll('.docs-container form .inv-info input[type="text"]');
    const srvTotal = document.querySelector('.total_srv span');
    const expTotal = document.querySelector('.total_exp span');
    const total = document.querySelector('.total span');
    
    docFormInputs = [...docInfo, srvTotal, expTotal, total];
  } else {
    docFormInputs = document.querySelectorAll('.docs-container form.agreement-form [type="text"]');
  }
  
  const [clientData, docData] = getValues(clientFormInputs, docFormInputs);
  
  
  if (newClientBox.checked) {
    const newClientId = await addClient(clientData); // returns new ID
    clientData._id = newClientId;
    showNotification('Client added');
  } else {
    clientData._id = cardId;
  };


  if (updateClientBox.checked) {
    updateClient(clientData); 
    showNotification('Client updated');
  }
    
  // save invoice data
  if (docSwitch.checked === false) {
    docData.type = 'Sąskaita';
    docData.date = getDate();
    docData.clientID = clientData._id;
    docData.clientTitle = clientData.title;
    saveInvData(docData);

    // services/expenses data
    invoiceTableData = getInvLinesValues();
      
  } else {
    docData.type = 'Sutartis';
  }
  
  const allDocData = { clientData, docData, invoiceTableData };

  // use fetch function to generate PDF.
  getPDFdata(allDocData);

  setTimeout(() => {
    window.location.assign('pdf');
  }, 2500);
  
};


const handleInvoiceLogs = async (e) => {
  if (e.target.classList.contains("delete-invoice")) {
    const cardId = e.target.parentElement.id;
    await useInvData(cardId, "delete"); // wait for data before reloading
    return window.location.reload(true);
  }
};


// Add srv or exp line
const addLine = (e) => {
  
  // select dynamically gererated DOM elements
  let { servicesContainer, expensesContainer } = getDocsContainerElements();
  
  if(e.target.classList.contains("add-service")) renderMarkup(servicesContainer, serviceMarkup);
  
  if (e.target.classList.contains("add-expense")) renderMarkup(expensesContainer, expenseMarkup);
};


//Calculates and sets invoice total values
const handleTotals = () => {
  const addValues = (prev, cur) => (prev + cur);
  let { totalSrv, totalExp, total } = getTotalsElements(); //selects DOM elements

  
  let srvTotals = Array
  .from(document.querySelectorAll('.service-line [name="total"]'))
  .map(el => parseFloat(el.value) || 0)
  .reduce(addValues);
  
  let expTotals = Array
  .from(document.querySelectorAll('.expense-line [name="total"]'))
  .map(el => parseFloat(el.value) || 0)
  .reduce(addValues);
  
  totalSrv.innerText = srvTotals || 0;
  totalExp.innerText = expTotals || 0;
  total.innerText = ((srvTotals || 0) + (expTotals || 0)).toFixed(2); 
};


//Sum single service/expense line in the invoice
const sumInvLine = (e) => {
  let [ , quantity, price, total ] = Array.from(e.currentTarget.children);
  
  total.value ? total.value = ((parseFloat(quantity.value.replace(/,/g, '.')) || 0) * (parseFloat(price.value.replace(/,/g, '.')) || 0)).toFixed(2) : total.value = 0;
  
  handleTotals();
};




// EVENT HANDLING //
clientForm.addEventListener('click', handleClientFormCheckbox);
downloadBtn.addEventListener('click', handleMainForm);
clientsContainer.addEventListener('click', handleSidebarClient);
logsContainer.addEventListener('click', handleInvoiceLogs);
docSwitch.addEventListener('change', switchForm);
docsContainer.addEventListener('click', (e) => {
  e.preventDefault();
  addLine(e);
  getInvoiceLineElements().forEach((el) => el.addEventListener('input', sumInvLine ));
});
clientSearchInput.addEventListener('input', () => {
  clientSearch(clientSearchInput.value);
});
logSearchInput.addEventListener('input', () => {
  logsSearch(logSearchInput.value);
});



//DOM mutation observer - with custom event
//Src: https://medium.com/allenhwkim/dom-changed-event-using-mutationobserver-a2b2834dded6

// Updates invoice totals after new invoice line is added/removed
const addDOMobserver = () => {
  const observer = new MutationObserver(list => {
    const e = new CustomEvent('dom-changed', { detail: list });
    document.querySelector('form.invoice-form').dispatchEvent(e)
  });
  observer.observe(document.querySelector('form.invoice-form'), { attributes: true, childList: true, subtree: true });
  
  document.querySelector('form.invoice-form').addEventListener('dom-changed', handleTotals);
};

//Initial load
addDOMobserver();