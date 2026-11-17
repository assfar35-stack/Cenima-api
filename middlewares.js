// Affiche la méthode HTTP et l'URL de chaque requête.
export function afficherRequete(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

// Vérifie que l'identifiant reçu dans l'URL est un entier positif.
export function validerId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erreur: "ID invalide" });
  }

  // Rend l'identifiant converti disponible aux routes suivantes.
  req.id = id;
  next();
}