
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.CLUSTER || 'mongodb+srv://parker:avocato@parkingcheck.q8rss.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
export async function run() {
 

    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Sea conectado con MongoDB");

}