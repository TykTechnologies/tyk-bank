var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var setRoutes = require('./routes/routes');
var constants = require('./constants')

const fetch = require('node-fetch');
const userQueries = require('./queries/user')

// expose so other services can read it
exports.BANK_GRAPHQL_ID = "";

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set the routes
setRoutes(app);

// Get Bank GraphQL ID
setBankId();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  // render the error page
  res.status(err.status || 500).send('error')
});

// Fetch all users and find the BANK graphql_id
// so we can store it in memory
function setBankId() {
  console.log("fetching users from graphql server")
  fetch(constants.GRAPHQL_API_URI, {
    method: 'POST',
    body: JSON.stringify({
      query: userQueries.getAllUsers()
    }),
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => res.text())
    .then(body => {
      const BANK_USER = JSON.parse(body).data && JSON.parse(body).data.users.find(users => {
        return users.name == "BANK"
      })
      if (!BANK_USER) {
        console.log('Didn\'t find bank user in GraphQL Server!')
        console.log('Please make sure you create a GraphQL User with name \'BANK\'')
        console.log('exiting')
        process.exit(1)
      }
      this.BANK_GRAPHQL_ID = BANK_USER.id
      console.log("Found and set BANK ID - ready to approve loans!")
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    });
}

module.exports = app;
