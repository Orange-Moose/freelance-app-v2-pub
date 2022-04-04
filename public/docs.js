const saveInvData = (data) => {
  fetch('/save-log', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => { // promisse
    if (res.ok) return res.json();
    return Promise.reject({
      status: response.status,
      statusText: response.statusText
    })
  }).then(data => data).catch(err => {
    if (err.status === 404) {
      console.log(err);
    }
  });
};


const useInvData = async (id, action) => {
  const invData = await fetch(`invoice-log/${action}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  }).then(res => {
    if (res.ok) return res.json();
    return Promise.reject({
      status: response.status,
      statusText: response.statusText
    })
  }).then(data => {
    return data;
  }).catch(err => {
    if (err.status === 404) {
      console.log(err);
    }
  });
  return invData;
};


const getPDFdata = async (data) => {
  const ddData = await fetch('/pdf', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => { // promisse
    if (res.ok) return res.json();
    return Promise.reject({
      status: response.status,
      statusText: response.statusText
    })
  }).then(data => data).catch(err => {
    if (err.status === 404) {
      console.log(err);
    }
  });
  return ddData;
};


const logsSearch = async (query) => {
  // if input field is empty, refresh logs list with '/logs' url
  let url;
  !query.length ? url = `/logs` : url = `/search-logs?log=${query}`;

  await fetch(url)
    .then(res => {
      if (res.ok) return res.json();
      return Promise.reject({
        status: response.status,
        statusText: response.statusText
      })
    }).then(data => {
      if (data.length) {
        const resultsHtml = data.map(invoice => {
          return `
          <div id="${invoice._id}" class="invoice-card">
            <div class="invoice-log">
              <h3 class="client">${invoice.clientTitle}</h3>
              <p class="date">Data: ${invoice.date}</p>
            </div>
            <div class="log-content">
              <p class="serial">Nr. ${invoice.serial}</p>
              <p class="total-srv">Paslaugos: ${invoice.total_srv} €</p>
              <p class="total-exp">Išlaidos: ${invoice.total_exp} €</p>
              <p class="total">Iš viso: ${invoice.total} €</p>
            </div>
            <button class="delete-invoice">&times</button>
          </div>
        `;
        }).join('');
        document.querySelector('.logs').innerHTML = resultsHtml;
      }
    })
    .catch(err => {
      if (err.status === 404) {
        console.log(err);
      }
    });
};


export { saveInvData, useInvData, getPDFdata, logsSearch };


