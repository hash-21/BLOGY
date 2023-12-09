const express = require('express');
const app = express();
const {dbConnect} = require('./config/database');
const routes = require('./routes');

require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middleware 
app.use(express.json());

const blog = require('./routes/blog');

// mount 
app.use("/api/v1",routes);

dbConnect();

// Start Server 
app.listen(PORT,()=>{
    console.log("App is Running at the",PORT);
})

// Default Route 
app.get('/', (req,res) => {
    res.send(`<h1>HomePage</h1>`)
})