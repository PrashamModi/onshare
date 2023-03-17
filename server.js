const express = require("express");
const app = express();
const path = require('path')

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

const connectDB = require("./config/db");
connectDB();

//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));  

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})