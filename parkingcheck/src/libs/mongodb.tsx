import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.CLUSTER || 'mongodb+srv://parker:avocato@parkingcheck.q8rss.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function run() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");
    return client;
  } catch (error) {
    console.error("Error al conectar con MongoDB", error);
    throw error;
  }
}