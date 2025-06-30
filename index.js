const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

const connectMongoDb = require('./connection');
const cookieParser = require('cookie-parser');
const { checkForAuth } = require('./middlewaress/authentication');
const Blog = require("./models/blog");
require('dotenv').config();

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

connectMongoDb("mongodb://127.0.0.1:27017/blogDb")
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    })

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuth);

app.use('/user', userRoute);
app.use('/blog', blogRoute);



app.use(express.static(path.resolve("./public/")));


app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("homepage", {
        user: req.user,
        blogs: allBlogs
    });

});

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})