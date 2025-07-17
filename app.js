require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

const connectMongoDb = require('./connection');
const cookieParser = require('cookie-parser');
const { checkForAuth } = require('./middlewaress/authentication');
const Blog = require("./models/blog");


const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

connectMongoDb(process.env.MONGO_URL)
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

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})