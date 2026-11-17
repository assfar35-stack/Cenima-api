// Importer Express
import {Router} from "express";
import { validerId } from "../middlewares.js";

// Importer les données des films et des séances
import { films, seances } from "../data.js";

// Créer le routeur des films
const router = Router();

// 1. GET /films
router.get("/", (req, res) => {
  // Créer une copie du tableau des films
  let resultat = [...films];

  // Vérifier si l'utilisateur a envoyé un genre
  if (req.query.genre) {
    // Garder seulement les films de ce genre
    resultat = resultat.filter((film) => film.genre === req.query.genre);
  }

  // Vérifier si l'utilisateur demande un tri par durée
  if (req.query.tri === "duree") {
    // Trier les films du plus court au plus long
    resultat.sort((a, b) => a.duree - b.duree);
  }

  // Retourner la liste des films
  res.json(resultat);
});

// 2. GET /films/:id
router.get("/:id", validerId, (req, res) => {
  // Chercher le film avec l'ID demandé
  const film = films.find((f) => f.id === req.id);

  // Vérifier si le film existe
  if (!film) {
    return res.status(404).json({
      erreur: "Film introuvable",
    });
  }

  // Retourner le film
  res.json(film);
});

// 3. GET /films/:id/seances
router.get("/:id/seances", validerId, (req, res) => {
  // Vérifier si le film existe
  const film = films.find((f) => f.id === req.id);

  if (!film) {
    return res.status(404).json({
      erreur: "Film introuvable",
    });
  }

  // Chercher toutes les séances de ce film
  const resultat = seances.filter((seance) => seance.filmId === req.id);

  // Retourner les séances
  res.json(resultat);
});

// 4. POST /films
router.post("/", (req, res) => {
  // Récupérer les informations envoyées
  const { titre, genre, duree } = req.body;

  // Vérifier que les champs sont corrects
  if (
    typeof titre !== "string" ||
    titre.trim() === "" ||
    typeof genre !== "string" ||
    genre.trim() === "" ||
    typeof duree !== "number" ||
    !Number.isFinite(duree) ||
    duree <= 0
  ) {
    return res.status(400).json({
      erreur: "Titre, genre et durée valide obligatoires",
    });
  }

  // Vérifier si un film avec le même titre existe
  const existe = films.some(
    (film) => film.titre.toLowerCase() === titre.trim().toLowerCase(),
  );

  if (existe) {
    return res.status(409).json({
      erreur: "Ce film existe déjà",
    });
  }

  // Créer le nouveau film
  const nouveauFilm = {
    id: Math.max(0, ...films.map((f) => f.id)) + 1,
    titre: titre.trim(),
    genre: genre.trim(),
    duree: duree,
  };

  // Ajouter le film dans le tableau
  films.push(nouveauFilm);

  // Retourner le nouveau film avec le code 201
  res.status(201).json(nouveauFilm);
});

// 5. DELETE /films/:id

router.delete("/:id", validerId, (req, res) => {
  // Chercher l'index du film dans le tableau
  const index = films.findIndex((f) => f.id === req.id);

  // Vérifier si le film existe
  if (index === -1) {
    return res.status(404).json({
      erreur: "Film introuvable",
    });
  }

  // Vérifier si le film possède encore des séances
  const aDesSeances = seances.some((seance) => seance.filmId === req.id);

  // Si le film possède des séances, interdire la suppression
  if (aDesSeances) {
    return res.status(409).json({
      erreur: "Impossible de supprimer ce film : il possède des séances",
    });
  }

  // Supprimer le film avec splice()
  films.splice(index, 1);

  // Retourner le code 204 : suppression réussie
  res.status(204).end();
});

// Exporter le routeur
export default router;
