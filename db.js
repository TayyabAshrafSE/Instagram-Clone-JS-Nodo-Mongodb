import { MongoClient } from "mongodb";

// DB host
const DBuri = "mongodb://0.0.0.0:27017";

// Initialize client
const DBClient = new MongoClient(DBuri);

// Initializing database
const DB = DBClient.db('Air_Connect');

export default DB;