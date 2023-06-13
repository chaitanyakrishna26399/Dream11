const express = require('express');
const app = express();
var bodyParser = require('body-parser')
const connectToDatabase = require('./db.js')
const port = 3000;
const indexControllers = require('./indexController.js')
let data = require('./jsonData.js')
const validation = require('./validations.js')




const DB_COLLECTION_NAME = "demo-chaitanya";
app.use(bodyParser.json());
// Sample create document
exports.sampleCreate = async function() {
  const result = connectToDatabase()
    .then((db) => {
      const PlayersCollection = db.collection('demo-chaitanya');
      return PlayersCollection.find({})
      .toArray(
        (err, documents) => {
          if (err) {
            console.error('Failed to retrieve documents:', err);
            return;
          }
          return documents
        }
      )
    })
  return result

}
app.get('/', async (req, res) => {
  var data = await exports.sampleCreate();
  console.log(data)
  res.send(data)

  // res.send({ status: 1, message: "demo" });
})
app.get('/process-result', indexControllers.playersList)
app.get('/demo', async (req, res) => {
    let plData = await data.readJson()
    const result = connectToDatabase()
      .then((db) => {
        const PlayersCollection = db.collection('demo-chaitanya');
        return PlayersCollection.insertMany(plData)
      })
    res.send(result)
  
  });
app.post('/add-team',validation.selectPlayers,indexControllers.selectPlayers)
app.get('/team-result', indexControllers.teamResult)

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

