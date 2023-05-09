const express = require("express");
const app = express();
const cors = require("cors");
const CommentsModel = require("./Models/Comments");
const CanvasStateModel = require("./Models/CanvasState");
const UserModel = require("./Models/User");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

//MongoDB connection
mongoose.connect("mongodb+srv://admin:8FoswwcRH2zINbIK@kollabcluster.lfup9j5.mongodb.net/kollab?retryWrites=true&w=majority");

//Port this is running on
const PORT = 5000;

//Used to parse the JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({limit: '10000mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10000mb', extended: true}));

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

//POST Request to add a new comment
app.post('/addComment', async (req, res) => {
    const comment = req.body
    const newComment = new CommentsModel(comment);
    await newComment.save();

    res.json(comment);
});

//PUT request to update resolved state of comments
app.put('/updateComment/:id', async (req, res) => {
    //
    try {
        const commentId = req.params.id;
        const comment = await CommentsModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        comment.comment_resolved = !comment.comment_resolved;
        await comment.save();

        res.json(comment);

      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
});

// POST request to create a new user
app.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    const user = new UserModel({ email, password, username });
  
    try {
      await user.save();
      res.send('User created successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating user');
    }
  });

// Tentative
app.get('/saveCanvas', (req, res) => {
    CanvasStateModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result)
        }
    });
});

//Save canvas state
app.post("/saveCanvas", async (req, res) => {
    const { canvasData } = req.body
    const canvas = new CanvasStateModel({canvasData: canvasData});

    try {
        await canvas.save();
        res.send('Canvas state saved successfully');
    } catch (err) {
        //console.error(err);
        res.status(500).send('Error saving canvas state');
    }
})


app.listen(5000, () => {
    console.log("Server is running on port " + PORT)
});