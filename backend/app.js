const express = require("express");
const app = express();
var morgan = require("morgan");

const {
  mongoose
} = require("./db/mongoose");

const bodyParser = require("body-parser");

/* MIDDLEWARE  */

// chargement middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
  );

  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );

  next();
});
/* FIN MIDDLEWARE  */

/* ROUTES */
app.use('/', require('./routes/utilisateur'));
app.use('/listes', require('./routes/liste'));

app.listen(3000, () => {
  console.log("Le serveur écoute sur le port 3000");
});