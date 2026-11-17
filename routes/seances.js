// Importer Express
import express from "express";
import { validerId } from "../middlewares.js";

// Importer les tableaux et les fonctions
import {
  films,
  seances,
  reservations,
  placesRestantes,
  prochainId,
} from "../data.js";

// Créer le routeur des séances
const router = express.Router();

// 1. POST /seances

router.post("/", (req, res) => {
  // Récupérer les informations envoyées
  const { filmId, date, heure, salle, places } = req.body;

  // Vérifier les champs obligatoires
  if (
    typeof date !== "string" ||
    date.trim() === "" ||
    typeof heure !== "string" ||
    heure.trim() === "" ||
    typeof salle !== "string" ||
    salle.trim() === "" ||
    !Number.isInteger(places) ||
    places < 1
  ) {
    return res.status(400).json({
      erreur: "Date, heure, salle et places valides obligatoires",
    });
  }

  // Vérifier si le film existe
  const film = films.find((f) => f.id === filmId);

  if (!film) {
    return res.status(404).json({
      erreur: "Film introuvable",
    });
  }

  // Créer la nouvelle séance
  const nouvelleSeance = {
    id: prochainId(seances),
    filmId,
    date,
    heure,
    salle,
    places,
  };

  // Ajouter la séance dans le tableau
  seances.push(nouvelleSeance);

  // Retourner la nouvelle séance avec le code 201
  res.status(201).json(nouvelleSeance);
});

// 2. GET /seances/:id

router.get("/:id", validerId, (req, res) => {
  // Chercher la séance
  const seance = seances.find((s) => s.id === req.id);

  // Vérifier si elle existe
  if (!seance) {
    return res.status(404).json({
      erreur: "Séance introuvable",
    });
  }

  // Créer une réponse avec les informations de la séance
  // et ajouter les places restantes calculées
  const resultat = {
    ...seance,
    placesRestantes: placesRestantes(seance),
  };

  // Retourner le résultat
  res.json(resultat);
});

// 3. GET /seances/:id/reservations

router.get("/:id/reservations", validerId, (req, res) => {
  // Vérifier si la séance existe
  const seance = seances.find((s) => s.id === req.id);

  if (!seance) {
    return res.status(404).json({
      erreur: "Séance introuvable",
    });
  }

  // Récupérer les réservations de cette séance
  const resultat = reservations.filter(
    (reservation) => reservation.seanceId === req.id,
  );

  // Retourner les réservations
  res.json(resultat);
});

// Exporter le routeur
export default router;
