require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser : true, useUnifiedTopology : true});
    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('Database Connected');
    })
}


module.exports = connectDB;