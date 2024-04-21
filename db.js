import { MongoClient } from "mongodb";

// DB host
const DBuri = "mongodb+srv://ammar5910s:Funnyb0y%401@cluster0.ky474lk.mongodb.net/";

// Initialize client
const DBClient = new MongoClient(DBuri);

// Initializing database
const DB = DBClient.db('Air_Connect');

export default DB;