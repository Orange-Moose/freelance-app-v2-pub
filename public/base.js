const clientsContainer = document.querySelector('.clients-container');
const logsContainer = document.querySelector('.logs-container');
const docsContainer = document.querySelector('.docs-container');
const clientForm = document.querySelector('.client-form');
const downloadBtn = document.querySelector('button.download-pdf');
const newClientBox = document.querySelector('.client-form input[type="checkbox"][name="add-new"]');
const updateClientBox = document.querySelector('.client-form input[type="checkbox"][name="update"]');
const docSwitch = document.querySelector('.switch-container input[name="switch"]');
const clientFormInputs = document.querySelectorAll('.client-form input[type="text"]');
const dateInput = docsContainer.querySelector('input[name="date"]');
const serialInput = docsContainer.querySelector('input[name="serial"]');
const clientSearchInput = document.querySelector('.client-search');
const logSearchInput = document.querySelector('.invoice-search');


const getDocsContainerElements = () => {
  return  {
    servicesContainer: document.querySelector('.services'),
    expensesContainer: document.querySelector('.expenses'),
  };
}

const getInvoiceLineElements = () => {
  const serviceLines = Array.from(document.querySelectorAll('.service-line'));
  const expenseLines = Array.from(document.querySelectorAll('.expense-line'));
  return [...serviceLines, ...expenseLines];
}


const getTotalsElements = () => {
  return {
    totalSrv: document.querySelector('.total_srv span'),
    totalExp: document.querySelector('.total_exp span'),
    total: document.querySelector('.total span')
  };
}


export { clientsContainer, logsContainer, docsContainer, clientForm, downloadBtn, newClientBox, updateClientBox, clientFormInputs, docSwitch, dateInput, serialInput, clientSearchInput, logSearchInput, getDocsContainerElements, getInvoiceLineElements, getTotalsElements };