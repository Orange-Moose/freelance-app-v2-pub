import { appDatabase, ObjectId } from '../start.js';

const getHomepage = async (req, res) => {
  
  //Check if any user is logged in or using as a guest
  if(!res.locals.user) {
    res.render('login', { title: "Login" });
    return;
  }

  const cursor = await appDatabase.collection('clients').find({ userID: res.locals.user.id} );
  const clientsArr = await cursor.toArray() || null;
  const clients = await clientsArr.reverse();

  const docCursor = await appDatabase.collection('invoices').find({ userID: res.locals.user.id });
  const invoicesArr = await docCursor.toArray() || null;
  const invoices = await invoicesArr.reverse();

  
  res.render('index', { user: res.locals.user, clients, invoices, siteName: res.locals.h.siteName, adminEmail: res.locals.h.adminEmail });
};

//Used in AJAX seach
const getClients = async (req, res) => {
  if (!res.locals.user) {
    res.render('login', { title: "Login" });
    return;
  }

  const cursor = await appDatabase.collection('clients').find({ userID: res.locals.user.id });
  const clientsArr = await cursor.toArray() || null;
  const clients = await clientsArr.reverse();

  res.json(clients);
};

const saveClient = async (req, res) => {
  const newId = ObjectId();
  req.body._id = newId;
  req.body.userID = res.locals.user.id;
  req.body.username = res.locals.user.username; 

  await appDatabase.collection('clients')
    .insertOne(req.body)
    .then(result => result) // Here you can add some functionalyty to inform user that data was saved; load some UI etc.
    .catch(err => console.error(err));
  
  //Update clients arr in the User document  
  await appDatabase.collection('users')
    .updateOne({"_id": ObjectId(res.locals.user.id)},
    {
      $push: { clients: newId }
    })
    .then(result => result)
    .catch(err => console.error(err));

  
  res.json(newId);
};

const useClient = async (req, res) => {
  if (req.params.action === "delete") {
    await appDatabase.collection('clients').findOneAndDelete({ "_id": new ObjectId(req.body.id) }).catch(err => console.error(err));
    res.sendStatus(200);
  }
  
  if (req.params.action === "get") {
    const data = await appDatabase.collection('clients').findOne({ "_id": new ObjectId(req.body.id) }).catch(err => console.error(err));
    res.json(data);
    
  }      
};
  
const editClient = async (req, res) => {
  if (req.body._id) {
    await appDatabase.collection('clients').updateOne(
      { "_id": new ObjectId(req.body._id) }, {
      $set: {
          title: req.body.title,
          reg_code: req.body.reg_code,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email,
          ceo: req.body.ceo
      }
    });
    res.sendStatus(200);
  };
  
};

const searchClients = async (req, res) => {
  const index = [
    {
      '$search': {
        'index': 'Clients all',
        'text': {
          'query': req.query.cli,
          'path': {
            'wildcard': '*'
          }
        }
      }
    }
  ];

  const searchCursor = await appDatabase.collection('clients').aggregate(index);
  const clientsArr = await searchCursor.toArray();
  const clients = await clientsArr.filter(obj => obj.username == res.locals.user.username);
  
  res.json(clients);
};

export { getHomepage, saveClient, useClient, editClient, searchClients, getClients };