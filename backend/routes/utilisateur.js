const express = require("express");
const router = express.Router();
const app = express();

const {
    mongoose
} = require("./../db/mongoose");


// chargement des models
const {
    Utilisateur
} = require("./../db/models");

// Vérifier le rafraîchissement du middleware de token (qui vérifiera la session)
let verifierSession = (req, res, next) => {
    //  récupère le token d'actualisation dans le header
    let actualisationToken = req.header("x-refresh-token");

    // récupère le _id de l'entete de la requête
    let _id = req.header("_id");

    Utilisateur.trouverParIdEtToken(_id, actualisationToken)
        .then((utilisateur) => {
            if (!utilisateur) {
                // utilisateur introuvable
                return Promise.reject({
                    error: "Utilisateur introuvable. s'assurer que le token d'actualisation et l'ID utilisateur sont corrects",
                });
            }
            // si le code arrive ici - l'utilisateur a été trouvé
            // donc le token d'actualisation existe dans la base de données - mais nous devons encore vérifier s'il a expiré ou non
            req.utilisateur_id = utilisateur._id;
            req.objetUtilisateur = utilisateur;
            req.actualisationToken = actualisationToken;

            let estSessionValide = false;

            utilisateur.sessions.forEach((session) => {
                if (session.token === actualisationToken) {
                    // vérifie si la session a expiré
                    if (
                        Utilisateur.hasRefreshTokenExpired(session.expiresAt) === false
                    ) {
                        // le token d'actualisation n'a pas expiré
                        estSessionValide = true;
                    }
                }
            });

            if (estSessionValide) {
                // la session est VALIDE - appelez next () pour continuer le traitement de cette demande Web
                next();
            } else {
                // la session n'est pas valide
                return Promise.reject({
                    error: "Le token d'actualisation a expiré ou la session n'est pas valide",
                });
            }
        })
        .catch((e) => {
            res.status(401).send(e);
        });
};

/* ROUTES Utilisateur */

/**
 * POST /utilisateurs
 * S'inscrire
 */
router.post("/utilisateurs", (req, res) => {
    // Utilisateur S'inscrire

    let body = req.body;
    let nouvelUtilisateur = new Utilisateur(body);
    // console.log("nouvelUtilisateur", nouvelUtilisateur)

    nouvelUtilisateur
        .save()
        .then(() => {
            return nouvelUtilisateur.creerSession();
        })
        .then((actualisationToken) => {
            // Session créée avec succès - jeton d'actualisation renvoyé.
            // maintenant nous générons un token d'authentification d'accès pour l'utilisateur
            return nouvelUtilisateur.generateAccessAuthToken().then((accessToken) => {
                // auth token généré avec succès, maintenant nous retournons un objet contenant les tokens d'auth
                return {
                    accessToken,
                    actualisationToken,
                };
            });
        })
        .then((authTokens) => {
            // Maintenant, nous construisons et envoyons la réponse à l'utilisateur avec ses jetons d'authentification dans l'entete et l'objet utilisateur dans le corps
            // console.log("nouvelUtilisateur", nouvelUtilisateur);
            res
                .header("x-refresh-token", authTokens.actualisationToken)
                .header("x-access-token", authTokens.accessToken)
                .send(nouvelUtilisateur);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

/**
 * POST /utilisateurs/login
 * Login
 */
router.post("/utilisateurs/login", (req, res) => {
    let email = req.body.email;
    let mdp = req.body.mdp;

    Utilisateur.trouverParIdentifiant(email, mdp)
        .then((utilisateur) => {
            return utilisateur
                .creerSession()
                .then((actualisationToken) => {
                    // Session créée avec succès - token d'actualisation renvoyé
                    // maintenant nous générons un token d'authentification d'accès pour l'utilisateur

                    return utilisateur.generateAccessAuthToken().then((accessToken) => {
                        // accès au token d'authentification généré avec succès, maintenant nous renvoyons un objet contenant les token d'authentification
                        return {
                            accessToken,
                            actualisationToken,
                        };
                    });
                })
                .then((authTokens) => {
                    // Maintenant, nous construisons et envoyons la réponse à l'utilisateur avec ses tokens d'authentification dans l'en-tête et l'objet utilisateur dans le corps
                    res
                        .header("x-refresh-token", authTokens.actualisationToken)
                        .header("x-access-token", authTokens.accessToken)
                        .send(utilisateur);
                });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

/**
 * GET /utilisateurs/me/access-token
 * génère et renvoie un token d'accès
 */
router.get("/utilisateurs/moi/access-token", verifierSession, (req, res) => {
    // L'utilisateur / l'appelant est authentifié et nous avons à disposition l'utilisateur._id et l'objet utilisateur
    req.objetUtilisateur
        .generateAccessAuthToken()
        .then((accessToken) => {
            res.header("x-access-token", accessToken).send({
                accessToken,
            });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

module.exports = router;