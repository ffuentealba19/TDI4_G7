
//const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = process.env.CLUSTER || 'mongodb+srv://parker:avocato@parkingcheck.q8rss.mongodb.net/?retryWrites=true&w=majority'

//const client = new MongoClient(uri, {
  //serverApi: {
  //  version: ServerApiVersion.v1,
  //  strict: true,
  //  deprecationErrors: true,
  //}
//});
//export async function run() {
 

  //  await client.connect();

  //  await client.db("admin").command({ ping: 1 });
  //  console.log("Se ha conectado con MongoDB");

//}//

import mongoose from "mongoose";

const connectMongoDB = () => {
  try{
    mongoose.connect('mongodb+srv://parker:avocato@parkingcheck.q8rss.mongodb.net/ParkingCheckIntegra?retryWrites=true&w=majority');
    console.log("Se ha conectado con MongoDB");
  }
  catch{
    console.log("no se ha conectado con MongoDB");
  }
}

export default connectMongoDB;