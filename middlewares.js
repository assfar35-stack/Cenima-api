export function afficherRequete(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

export function validerId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erreur: "ID invalide" });
  }

  req.id = id;
  next();
}