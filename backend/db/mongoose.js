// Ce fichier gérera la connexion à la base de données MongoDB
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chefing', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connecté à MongoDB avec succèss :)");
}).catch((e) => {
    console.log("Erreur de connexion à MongoDB");
    console.log(e);
});

// Pour éviter les avertissements de privation (à partir du pilote natif MongoDB)
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


module.exports = {
    mongoose
};