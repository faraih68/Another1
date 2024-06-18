const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// setup middleware
app.use(cors());
app.use(express.json());

// db connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// import routes files and use them
const nodesRouter = require('./routes/nodes');
app.use('/nodes', nodesRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
