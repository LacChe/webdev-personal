const mongoose = require("mongoose");
require("dotenv").config();

const mongoDb = process.env.MONGO_DB_STRING;

mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));