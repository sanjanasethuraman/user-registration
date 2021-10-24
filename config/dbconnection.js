//imort node_modules packages
import Mongoose from "mongoose";
import {} from "dotenv/config.js";

//Establish MongoDB connection for saving entered data
Mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, res) {
        try {
            console.log('Connected to Database');
        } catch (err) {
            throw err;
        }
    }
);

//ES6 module requires final verification for MongoDB connection
const connection= Mongoose.connection;
connection.once('open', () => {
    console.log("mongodb connection");
})
connection.on('error', console.error.bind(console, 'connection error:'));