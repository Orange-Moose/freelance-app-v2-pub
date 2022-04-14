import { getDate, getSerial } from "./utils/utils.js";

const agreementMarkup = 
  `<div class="agreement">
    <h1>SUTARTIS</h1>
    <form class="agreement-form">
      <input name="serial" type="text" placeholder="Dokumento nr." value="${getSerial('agreement')}">
      <input name="date" type="text" placeholder="Data" value="${getDate()}">
      <textarea name="task" type="text" rows="1" placeholder="Atliekami darbai"></textarea>
      <input name="duration" type="text" placeholder="Darbų trukmė">
      <input name="price" type="text" placeholder="Kaina, €">
      <input name="adv_payment" type="text" placeholder="Avansas, %">
    </form>
  </div>`;


const invoiceMarkup =
  `<div class="invoice">
    <h1>SĄSKAITA</h1>
    <form class="invoice-form">
      <div class="inv-info">
        <input name="date" type="text" placeholder="Data" value="${getDate()}">
        <input name="serial" type="text" placeholder="Dokumento nr." value="${getSerial('invoice')}">
        <input name="due" type="text" placeholder="Apmokėjimo terminas" value="5 d.d.">
      </div>
      <h4 class="services-title">Suteiktos paslaugos</h4>
      <div class="services">
        <div class="service-line">
          <input name="service" type="text" placeholder="Paslaugos pavadinimas">
          <input name="quantity" type="text" placeholder="Kiekis">
          <input name="price" type="text" placeholder="Vnt. kaina, €">
          <input name="total" type="text" placeholder="Suma, €">
        </div>
      </div>
      <button class="add-service">+</button>
      <h4 class="expenses-title">Kliento išlaidos</h4>
      <div class="expenses">
        <div class="expense-line">
          <input name="expense" type="text" placeholder="Kliento išlaidos">
          <input name="quantity" type="text" placeholder="Kiekis">
          <input name="price" type="text" placeholder="Vnt. kaina, €">
          <input name="total" type="text" placeholder="Suma, €">
        </div>
      </div>
      <button class="add-expense">+</button>
    </form>
    <div class="totals">
      <h5 class="total_srv">Paslaugos: <span>0</span> €</h5>
      <h5 class="total_exp">Išlaidos: <span>0</span> €</h5>
      <h5 class="total">Iš viso: <span>0</span> €</h4>
    </div>
  </div>`;

const serviceMarkup = `
  <div class="service-line">
    <input name="service" type="text" placeholder="Paslaugos pavadinimas">
    <input name="quantity" type="text" placeholder="Kiekis">
    <input name="price" type="text" placeholder="Vnt. kaina, €">
    <input name="total" type="text" placeholder="Suma, €">
    <span class="delete-line" onclick="this.parentElement.remove()">&times</span>
  </div>
`;

const expenseMarkup = `
  <div class="expense-line">
    <input name="expense" type="text" placeholder="Kliento išlaidos">
    <input name="quantity" type="text" placeholder="Kiekis">
    <input name="price" type="text" placeholder="Vnt. kaina, €">
    <input name="total" type="text" placeholder="Suma, €">
    <span class="delete-line" onclick="this.parentElement.remove()">&times</span>
  </div>
`;

  export { agreementMarkup, invoiceMarkup, serviceMarkup, expenseMarkup };

