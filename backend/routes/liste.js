const express = require("express");
const router = express.Router();
const app = express();

const jwt = require("jsonwebtoken");

const {
    mongoose
} = require("./../db/mongoose");

const {
    Liste,
    Piece,
    Utilisateur
} = require("./../db/models");

// vérifier si la demande a un token d'accès JWT valide
let authentifier = (req, res, next) => {
    let token = req.header("x-access-token");
    // verifier JWT
    jwt.verify(token, Utilisateur.getJWTSecret(), (err, decode) => {
        if (err) {
            // jwt n'est pas valide - * NE PAS AUTHENTIFIER *
            res.status(401).send(err);
        } else {
            // jwt valide
            req.utilisateur_id = decode._id;
            next();
        }
    });
};

/**
 * GET /listes
 * Obtenir toutes les listes
 */
router.get("/", authentifier, (req, res) => {
    // retourne un tableau de tous les états qui appartiennent à l'utilisateur authentifié

    Liste.find({
            _idUtilisateur: req.utilisateur_id,
        })
        .then((listes) => {
            res.send(listes);
        })
        .catch((e) => {
            res.send(e);
        });
});

/**
 * POST /listes
 * Creer une liste
 */
router.post("/", authentifier, (req, res) => {
    //créer une nouvelle liste et renvoyer le nouveau document de liste à l'utilisateur (qui inclut l'identifiant)
    // Les informations de liste (champs) seront transmises via le corps de requête JSON
    let titre = req.body.titre;

    let nouvelleListe = new Liste({
        titre,
        _idUtilisateur: req.utilisateur_id,
    });
    nouvelleListe.save().then((listeDoc) => {
        // le document complet de la liste est retourné (incl. id)
        res.send(listeDoc);
    });
});

/**
 * PATCH /listes/:id
 * Mettre à jour une liste spécifiée
 */
router.patch("/:id", authentifier, (req, res) => {
    // mettre à jour la liste spécifiée (document de liste avec id dans l'URL) avec les nouvelles valeurs spécifiées dans le corps JSON de la requête
    Liste.findOneAndUpdate({
        _id: req.params.id,
        _idUtilisateur: req.utilisateur_id,
    }, {
        $set: req.body,
    }).then(() => {
        res.send({
            message: "Mis à jour avec succés",
        });
    });
});

/**
 * DELETE /listes/:id
 * Supprimer a liste
 */
router.delete("/:id", authentifier, (req, res) => {
    // supprimer la liste spécifiée (document avec id dans l'URL)
    Liste.findOneAndRemove({
        _id: req.params.id,
        _idUtilisateur: req.utilisateur_id,
    }).then((supprimerDocListe) => {
        res.send(supprimerDocListe);

        // supprime toutes les pieces (produits) qui se trouvent dans la liste supprimée
        supprimerPieceDeLaListe(supprimerDocListe._id);
    });
});

/**
 * GET /listes/:listeId/pieces
 * Obtenir toutes les pieces dans une liste spécifique
 */
router.get("/:listeId/pieces", authentifier, (req, res) => {
    //  retourner toutes les pièces qui appartiennent à une liste spécifique (spécifiée par listeId)
    Piece.find({
        _listeId: req.params.listeId,
    }).then((pieces) => {
        res.send(pieces);
    });
});

/**
 * POST /listes/:listeId/pieces
 * Créer une nouvelle piece dans une liste spécifique
 */
router.post("/:listeId/pieces", authentifier, (req, res) => {
    // Créer une nouvelle piece dans une liste spécifiée par listeId
    Liste.findOne({
            _id: req.params.listeId,
            _idUtilisateur: req.utilisateur_id,
        })
        .then((liste) => {
            if (liste) {
                // un objet liste avec les conditions spécifiées a été trouvé
                // donc l'utilisateur actuellement authentifié peut créer de nouvelles pièces
                return true;
            }

            // sinon l'objet liste n'est pas défini
            return false;
        })
        .then((peutCreerUnePiece) => {
            if (peutCreerUnePiece) {
                let nouvellePiece = new Piece({
                    titre: req.body.titre,
                    _listeId: req.params.listeId,
                });
                nouvellePiece.save().then((nouveauDocPiece) => {
                    res.send(nouveauDocPiece);
                });
            } else {
                res.sendStatus(404);
            }
        });
});

/**
 * PATCH /listes/:listeId/pieces/:pieceId
 * Mettre à jour une piece existante
 */
router.patch("/:listeId/pieces/:pieceId", authentifier, (req, res) => {
    // mettre à jour une piece existante (spécifiée par pieceId)
    Liste.findOne({
            _id: req.params.listeId,
            _idUtilisateur: req.utilisateur_id,
        })
        .then((liste) => {
            if (liste) {
                // un objet liste avec les conditions spécifiées a été trouvé
                // donc l'utilisateur actuellement authentifié peut mettre à jour les pièces de cette liste
                return true;
            }
            //  l'objet liste n'est pas défini
            return false;
        })
        .then((peutMettreAjours) => {
            if (peutMettreAjours) {
                // l'utilisateur actuellement authentifié peut mettre à jour des pieces
                Piece.findOneAndUpdate({
                    _id: req.params.pieceId,
                    _listeId: req.params.listeId,
                }, {
                    $set: req.body,
                }).then(() => {
                    res.send({
                        message: "Mis à jour avec succés.",
                    });
                });
            } else {
                res.sendStatus(404);
            }
        });
});

/**
 * DELETE /listes/:listeId/pieces/:pieceId
 * Supprimer une piece
 */
router.delete("/:listeId/pieces/:pieceId", authentifier, (req, res) => {
    Liste.findOne({
            _id: req.params.listeId,
            _idUtilisateur: req.utilisateur_id,
        })
        .then((liste) => {
            if (liste) {
                // un objet liste avec les conditions spécifiées a été trouvé
                // donc l'utilisateur actuellement authentifié peut mettre à jour les pièces de cette liste
                return true;
            }

            // sinon l'objet liste n'est pas défini
            return false;
        })
        .then((peutSupprimerUnePiece) => {
            if (peutSupprimerUnePiece) {
                Piece.findOneAndRemove({
                    _id: req.params.pieceId,
                    _listeId: req.params.listeId,
                }).then((supprimerPieceDoc) => {
                    res.send(supprimerPieceDoc);
                });
            } else {
                res.sendStatus(404);
            }
        });
});

/* MÉTHODES D'AIDE */
let supprimerPieceDeLaListe = (_listeId) => {
    Piece.deleteMany({
        _listeId,
    }).then(() => {
        console.log("Pieces de la liste " + _listeId + " ont été supprimés !");
    });
};

module.exports = router;