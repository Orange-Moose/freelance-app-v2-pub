import { appDatabase, ObjectId } from '../start.js';

//Used in AJAX seach
const getLogs = async (req, res) => {
  if (!res.locals.user) {
    res.render('login', { title: "Login" });
    return;
  }

  const cursor = await appDatabase.collection('invoices').find({ userID: res.locals.user.id });
  const logsArr = await cursor.toArray() || null;
  const logs = await logsArr.reverse();

  res.json(logs);
};


const saveDocumentLog = (req, res) => {
  req.body.userID = res.locals.user.id;
  req.body.username = res.locals.user.username;

  // save req.body to "invoices" collection
  appDatabase.collection('invoices')
    .insertOne(req.body)
    .then(result => result) // Here you can add some functionalyty to inform user that data was saved; load some UI etc.
    .catch(err => console.error(err));
  
  res.sendStatus(200);
};

const useDocumentLog = async (req, res) => {
  if (req.params.action === "delete") {
    await appDatabase.collection('invoices').findOneAndDelete({ "_id": new ObjectId(req.body.id) }).catch(err => console.error(err));
    res.sendStatus(200);
  }
}

const searchDocumentLogs = async (req, res) => {
  const index = [
    {
      '$search': {
        'index': 'Invoice Logs all',
        'text': {
          'query': req.query.log,
          'path': {
            'wildcard': '*'
          }
        }
      }
    }
  ];

  const searchCursor = await appDatabase.collection('invoices').aggregate(index);
  const logsArr = await searchCursor.toArray();
  const logs = await logsArr.filter(obj => obj.username == res.locals.user.username);

  res.json(logs);
};

export { getLogs, saveDocumentLog, useDocumentLog, searchDocumentLogs };