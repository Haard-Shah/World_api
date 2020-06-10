var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource User page');
});


/* User Register route*/
router.post("/register", (req, res, next) => {
  // 1. reterive email and password from req.body
  const email = req.body.email;
  const password = req.body.password;

  // 1.1 check if components were actually provided
  if (!email || !password) { //TODO: check email validity
    res.status(400).json({
      'error': true,
      'message': "Incomplete Body - email and password are required"
    })
    return;
  } else {
    // 2. Determine if user already exists in table
    const queryUsers = req.db.from('users').select('*').where('email', '=', email)
    queryUsers
      .then((users) => {
        if (users.length > 0) {
          console.log("User already exists");
          return;
        } else {
          // 2.1 If not create a user
          console.log("No Matching users");
          const saltRounds = 10;
          const hash = bcrypt.hashSync(password, saltRounds);

          return req.db.from('users').insert({
            email,
            hash
          });
        }
      })
      .then(() => {
        console.log('User created!');
        res.status(201).json({
          success: true,
          message: "User created"
        })
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Could not create users."
        })
      })
  }
})

/* User Login route */
router.post("/login", (req, res, next) => {
  // 1. reterive email and password from req.body
  const email = req.body.email;
  const password = req.body.password;

  // 1.1 check if components were actually provided
  if (!email || !password) { //TODO: check email validity
    res.status(400).json({
      'error': true,
      'message': "Incomplete Body - email and password are required"
    })
    return;
  } else {
    // 2. Determine if user already exists in table
    const queryUsers = req.db.from('users').select('*').where('email', '=', email)
    queryUsers
      .then((users) => {
        if (users.length === 0) {
          console.log("User does not exist");
          res.status(400).json({
            error: true,
            message: "Records do not match."
          });
          return;
        } else {
          // 2.1 if user does exist, verify if password match
          const user = users[0];
          console.log("password check");
          return bcrypt.compare(password, user.hash);
        }
        // 2.2 If user does not exist, return error response
      })
      .then((match) => {
        // 2.1.2 if passwords do not match, return error response
        if (!match) {
          console.log("Passwords do not match");
          res.status(400).json({
            error: true,
            message: "Records do not match."
          });
          return;
        } else {
          // 2.1.1 if password match, return JWT token
          // create JWT token
          const secretKey = "2aisuhdfhu9834njsdfhuihiasdf09234";
          const expires_in = 60 * 60 * 24; // 1 Day
          const exp = Date.now() + expires_in * 1000;
          const token = jwt.sign({
            email,
            exp
          }, secretKey)

          res.json({
            token_type: "Bearer",
            token,
            expires_in
          })
        }
      })
      .catch((err) => {
        // console.log(err);
        res.status(500).json({
          error: true,
          message: "Authentication Error."
        });
      });
  }
})

module.exports = router;