const express = require("express");
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const CommentsModel = require("./Models/Comments");
const CanvasStateModel = require("./Models/CanvasState");
const UserModel = require("./Models/UserModel");

//const db = require("./Models");
//const User = db.UserModel;

//MongoDB connection
mongoose.connect("mongodb+srv://admin:8FoswwcRH2zINbIK@kollabcluster.lfup9j5.mongodb.net/kollab?retryWrites=true&w=majority");

//Port this is running on
const PORT = 5000;

//Used to parse the JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({limit: '10000mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10000mb', extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(
    cookieSession({
      name: "cookie-session",
      secret: "COOKIE_SECRET",
      httpOnly: true
    })
  );

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
    const userCredentials = req.body;
    const user = new UserModel(userCredentials);
  
    try {
      await user.save();
      res.send(`User ${user.username} created successfully`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating user');
    }
  });

// POST to login a user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  //user.findOne({})

  try {
    const user = await UserModel.findOne({ email, password });

    if (!user) {
      // User not found
      return res.status(404).send('Invalid email or password');
    }

    res.send('Login successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
  
    
});

// POST route for logging a user out
app.post("/logout", async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
});


app.listen(5000, () => {
    console.log("Server is running on port " + PORT)
});