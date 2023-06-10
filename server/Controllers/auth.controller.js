const config = require("../Config/auth.config");
const db = require("../Models");
const User = db.UserModel;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });

      user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
      })
};
