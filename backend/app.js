const path = require("path");
const express = require("express");
const {MongoClient} = require('mongodb');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user")

const app = express();

mongoose.connect("mongodb://localhost:27017/node-angular",{ useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to database!');
})
.catch(() => {
    console.log('Connection failed!');
});

/* let conn = null
new MongoClient.connect("mongodb://localhost:27017/node-angular", { useUnifiedTopology: true })
    .then(connection => (conn = connection, connection.db('node-angular')))
    .then(async db => {
        conn.close();
    })
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    }); 
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("images")));

app.use(cors({ origin: "*" }));

/* app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
        );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
}); */

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;