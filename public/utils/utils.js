import { getInvoiceLineElements } from "../base.js";

const renderMarkup = (container, markup) => {
  container.insertAdjacentHTML('beforeend', markup);
};

const showNotification = (text) => {
  const notif = document.querySelector('.notification');
  notif.innerHTML = `<p>${text}</p>`;
  notif.classList.add('visible');

  setTimeout(() => {
    notif.classList.remove('visible');
  }, 5000);

}


const clearEl = (el) => {
  el.innerHTML = "";
};

//Accepts Nodelist. Gets Client form and Inv/Agr form non-dymanic (excl. srv/exp lines) values and totals.
const getValues = (client, doc) => {
  const arr = [client, doc];
  const data = [];

  arr.forEach(item => {
    if(item) {
      const obj = Array
        .from(item)
        .reduce((obj, el) => {
          return {
            ...obj,
            [`${el.name || el.parentElement.className}`]: el.value || el.textContent
          }
        }, {});
      data.push(obj);
    }
  });
  return data;
};



// Gets Invoice services and expenses values
const getInvLinesValues = () => {

  let srvInputs = [];
  let expInputs = [];
  let lines = getInvoiceLineElements();

  lines.forEach(line => {

    line.classList.contains('service-line') ? srvInputs.push(Array.from(line.children)) : expInputs.push(Array.from(line.children));

  });

  let allInputs = { services: srvInputs, expenses: expInputs };

  let srvVals = [];
  let expVals = [];

  allInputs.services.forEach(line => {
    let obj = { service: 0, quantity: 0, price: 0, total: 0 };
    line.map((input, i) => {
      obj[Object.keys(obj)[i]] = input.value;
    });
    srvVals.push(obj);
  });

  allInputs.expenses.forEach(line => {
    let obj = { expense: 0, quantity: 0, price: 0, total: 0 };
    line.map((input, i) => {
      obj[Object.keys(obj)[i]] = input.value;
    });
    expVals.push(obj);
  });

  /* console.log([...srvVals, ...expVals]); 
  Returns Array of objects for each line in the invoice 
  [ 
    0: {service: 'E-shopas', quantity: '3', price: '10', total: '30.00'}
    1: { service: 'Kasimas', quantity: '2', price: '150', total: '300.00' }
    2: { expense: 'ADW BU', quantity: '2', price: '153', total: '306.00' }
    3: { expense: 'islaida ads', quantity: '1', price: '680', total: '680.00' } 
  ] */
  
  return [...srvVals, ...expVals];
};


const getDate = () => {
  const date = new Date();
  let [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  //format date
  if (month < 10 && day < 10) {
    month = `0${month}`;
    day = `0${day}`;
  } else if (month < 10) {
    month = `0${month}`;
  } else if (day < 10) {
    day = `0${day}`;
  }

  return [year, month, day].join(" ").toString();
};

const getSerial = (docType) => {
  
  const prefix = (docType === 'invoice') ? 'SF':'SUT';
  
  const serialNum = `${prefix}${getDate()}-${new Date().getMinutes().toString()}`;

  return serialNum.replace(/ /g, "");
};



export { renderMarkup, showNotification, clearEl, getValues, getInvLinesValues, getDate, getSerial };