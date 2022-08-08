const addClient = async (data) => {
  const clientData = await fetch('/new-client', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
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
  
  return clientData;
};


const useClient = async (id, action) => {
  const clientData = await fetch(`client/${action}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
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
  return clientData;
};


const updateClient = async (data) => {
  const result = await fetch(`/update-client`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
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
  return result;  
};


const populateClientForm = (data) => {
  const inputs = Array.from(document.querySelectorAll('.client-form input'));
  inputs.forEach(input => {
    if (input.type === "text") input.value = data[input.name];
  });
};


const clientSearch = async (query) => {
  // if input field is empty, refresh client list with '/clients' url
  let url;
  !query.length ? url = `/clients` : url = `/search?cli=${query}`;
  
  await fetch(url)
  .then(res => {
    if (res.ok) return res.json();
    return Promise.reject({
      status: response.status,
      statusText: response.statusText
    })
  }).then(data => {
    if(data.length) {
      const resultsHtml = data.map(client => {
        return `
        <div id="${client._id}" class="client-card">
        <div class="client-info">
        <h4 class="client-title">${client.title}</h4>
        <div class="card-content">
        <p class="client-phone">${client.phone}</p>
        <p class="client-email">${client.email}</p>
        </div>
        </div>
        <button class="delete-client">&times</button>
        </div>
        `;  
      }).join('');
      document.querySelector('.saved-clients').innerHTML = resultsHtml;
    }    
  })
  .catch(err => {
    if (err.status === 404) {
      console.log(err);
    }
  });
};

export { addClient, useClient, updateClient, populateClientForm, clientSearch };


