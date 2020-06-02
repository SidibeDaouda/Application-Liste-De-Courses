const mongoose = require("mongoose");
// permettant de filtrer, manipuler des object javascript facilement et de façon performante
const _ = require("lodash");
// token générés par un serveur lors de l’authentification d’un utilisateur sur une application Web, et qui sont ensuite transmis au client
// Ils seront renvoyés avec chaque requête HTTP au serveur, ce qui lui permettra d’identifier l’utilisateur
const jwt = require("jsonwebtoken");
// fournit une fonctionnalité de hachage, de chiffrement, de déchiffrement, de signature et de vérification d'OpenSSL.
const crypto = require("crypto");
// fonction de hachage, crypter des mdp
const bcrypt = require("bcryptjs");

// JWT Secret
const jwtSecret = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

const UtilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    minlength: 1,
  },
  prenom: {
    type: String,
    required: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  mdp: {
    type: String,
    required: true,
    minlength: 8,
  },
  sessions: [{
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
  }, ],
});

// *** Instance methodes ***

UtilisateurSchema.methods.toJSON = function () {
  const utilisateur = this;
  const objetUtilisateur = utilisateur.toObject();
  // retourne le document sauf le mdp et les sessions
  return _.omit(objetUtilisateur, ["mdp", "sessions"]);
};

UtilisateurSchema.methods.generateAccessAuthToken = function () {
  const utilisateur = this;
  return new Promise((resolve, reject) => {
    // Créer un token json et le renvoi
    jwt.sign({
        _id: utilisateur._id.toHexString(),
      },
      jwtSecret, {
        expiresIn: "15m",
      },
      (err, token) => {
        // (Asynchrone) Si un rappel est fourni, le rappel est appelé avec le err ou le token
        if (!err) {
          resolve(token);
        } else {
          // s'il ya une erreur
          reject();
        }
      }
    );
  });
};

UtilisateurSchema.methods.generateRefreshAuthToken = function () {
  // Cette méthode génère  une chaîne hexadécimale de 64 octets - elle ne l'enregistre pas dans la base de données. saveSessionToDatabase () s'en occupe.
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (!err) {
        // pas d'erreur
        let token = buf.toString("hex");
        return resolve(token);
      }
    });
  });
};

UtilisateurSchema.methods.creerSession = function () {
  let utilisateur = this;

  return utilisateur
    .generateRefreshAuthToken()
    .then((actualisationToken) => {
      return saveSessionToDatabase(utilisateur, actualisationToken);
    })
    .then((actualisationToken) => {
      // enregistré dans la base de données avec succès
      // retourne le token d'actualisation
      return actualisationToken;
    })
    .catch((e) => {
      return Promise.reject(
        "Impossible d'enregistrer la session dans la base de données.\n" + e
      );
    });
};

/* MODEL METHODES (static methodes) */

UtilisateurSchema.statics.getJWTSecret = () => {
  return jwtSecret;
};

UtilisateurSchema.statics.trouverParIdEtToken = function (_id, token) {
  // trouve l'utilisateur par id et token
  // utilisé dans le middleware d'authentification (verifierSession)

  const Utilisateur = this;

  return Utilisateur.findOne({
    _id,
    "sessions.token": token,
  });
};

UtilisateurSchema.statics.trouverParIdentifiant = function (email, mdp) {
  let Utilisateur = this;
  return Utilisateur.findOne({
    email,
  }).then((utilisateur) => {
    if (!utilisateur) return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(mdp, utilisateur.mdp, (err, res) => {
        if (res) {
          resolve(utilisateur);
        } else {
          reject();
        }
      });
    });
  });
};

UtilisateurSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondesDepuisLepoque = Date.now() / 1000;
  if (expiresAt > secondesDepuisLepoque) {
    // n'a pas expiré
    return false;
  } else {
    // a pas expiré
    return true;
  }
};

/* MIDDLEWARE */
//  Avant l'enregistrement d'un utilisateur, ce code s'exécute
UtilisateurSchema.pre("save", function (next) {
  let utilisateur = this;

  if (utilisateur.isModified("mdp")) {
    // si le champ mdp a été modifié / modifié, exécute ce code.
    // genere et hash le mdp
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(utilisateur.mdp, salt, (err, hash) => {
        utilisateur.mdp = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/* MÉTHODES D'AIDE */
let saveSessionToDatabase = (utilisateur, actualisationToken) => {
  // enregistre la session dans la bdd
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();

    utilisateur.sessions.push({
      token: actualisationToken,
      expiresAt,
    });

    utilisateur
      .save()
      .then(() => {
        // session enregistrée avec succès
        return resolve(actualisationToken);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

let generateRefreshTokenExpiryTime = () => {
  // jours jusqu'à expiration
  let joursExpiration = "10";
  let secondeExpiration = joursExpiration * 24 * 60 * 60;
  return Date.now() / 1000 + secondeExpiration;
};

const Utilisateur = mongoose.model("Utilisateur", UtilisateurSchema);

module.exports = {
  Utilisateur,
};