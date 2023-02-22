const express = require("express");
const app = express();
const mongoose = require("mongoose");

//MongoDB connection

//Port this is running on
const PORT = 5000;


app.listen(5000, () => {
    console.log("Server is running on port " + PORT)
});