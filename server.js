
// Importer Express
import express from "express";
import { afficherRequete } from "./middlewares.js";

// Importer les trois routes
import filmRouter from "./routes/film.js";
import seancesRouter from "./routes/seances.js";
import reservationsRouter from "./routes/reservations.js";

// Créer l'application Express
const app = express();

// Permet à Express de comprendre les données JSON
// envoyées dans le corps des requêtes POST
app.use(express.json());


// Afficher la méthode HTTP et l'URL
app.use(afficherRequete);

// Toutes les routes qui commencent par /films
app.use("/films", filmRouter);

// Toutes les routes qui commencent par /seances
app.use("/seances", seancesRouter);

// Toutes les routes qui commencent par /reservations
app.use("/reservations", reservationsRouter);

// Si aucune route précédente ne correspond,
// retourner une erreur 404
app.use((req, res) => {

  res.status(404).json({
    erreur: "Route inconnue"
  });

});


const port = Number(process.env.PORT || 7777);

// Le serveur écoute sur le port configuré par l'hébergeur ou sur 7777 en local
app.listen(port, () => {
  console.log(`Serveur sur le port ${port}`);

});
