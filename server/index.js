const express = require("express");
const app = express();
const cors = require("cors");
const CommentsModel = require("./Models/Comments");
const CanvasStateModel = require("./Models/CanvasState");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

//Save canvas state
app.post("/saveCanvas", async (req, res) => {
    const canvas = new CanvasStateModel({ canvasData: canvasState });

    try {
        await canvas.save();
        res.send('Canvas state saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving canvas state');
    }
});


app.listen(5000, () => {
    console.log("Server is running on port " + PORT)
});