const express = require("express");
const app = express();
const cors = require("cors");
const CommentsModel = require("./Models/Comments");
const mongoose = require("mongoose");

//MongoDB connection
mongoose.connect("mongodb+srv://admin:8FoswwcRH2zINbIK@kollabcluster.lfup9j5.mongodb.net/kollab?retryWrites=true&w=majority");

//Port this is running on
const PORT = 5000;

//Used to parse the JSON
app.use(express.json());
app.use(cors());

//GET Request
app.get('/', (req, res) => {
    CommentsModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result)
        }
    });
});

//POST Request
app.post('/addComment', async (req, res) => {
    const comment = req.body
    const newComment = new CommentsModel(comment);
    await newComment.save();

    res.json(comment);
});


app.listen(5000, () => {
    console.log("Server is running on port " + PORT)
});