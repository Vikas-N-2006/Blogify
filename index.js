const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
const userRoute = require('./routes/user');
const connectMongoDb = require('./connection');
require('dotenv').config();

connectMongoDb("mongodb://127.0.0.1:27017/blogDb")
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    })

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.get('/', (req, res) => {
    return res.render("homepage");
})

app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoute);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})