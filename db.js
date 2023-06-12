const DB_USER = "demo-chaitanya"
const DB_PWD = "demo-chaitanya"
const DB_URL = "cluster0.dti8akd.mongodb.net"
const DB_NAME = "demo-chaitanya";
// const DB_COLLECTION_NAME = "";
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://" + DB_USER + ":" + DB_PWD + "@" + DB_URL + "/?retryWrites=true&w=majority";
const uri="mongodb+srv://chaitu:chaitanya7@cluster0.ramv0xn.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true });
module.exports = async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected to the database successfully');

    // Access the specified database
    const db = client.db(DB_NAME);

    // Return the database connection
    return db;
  } catch (error) {
    console.log('Error connecting to the database:', error);
    throw error;
  }
};
