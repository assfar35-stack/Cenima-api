export const films = [
{ id: 1, titre: "Les Ailes du désir", duree: 128, genre: "drame" },
{ id: 2, titre: "Coco", duree: 105, genre: "animation" },
{ id: 3, titre: "Inception", duree: 148, genre: "science-fiction" }
];
export const seances = [
{ id: 1, filmId: 1, date: "2026-12-05", heure: "18:00", salle: "A", places: 40 },
{ id: 2, filmId: 2, date: "2026-12-05", heure: "14:00", salle: "B", places: 3 },
{ id: 3, filmId: 3, date: "2026-12-06", heure: "20:30", salle: "A", places: 40 }
];

export const reservations = [];


// Fonction pour calculer les places restantes
export function placesRestantes(seance) {

  // On cherche toutes les réservations de cette séance
  const reservationsSeance = reservations.filter(
    reservation => reservation.seanceId === seance.id
  );

  // On additionne le nombre de places réservées
  const placesReservees = reservationsSeance.reduce(
    (total, reservation) => total + reservation.nbPlaces,
    0
  );

  // On retourne les places disponibles
  return seance.places - placesReservees;
}


// Fonction pour générer automatiquement un nouvel ID
export function prochainId(liste) {

  // Si le tableau est vide, le premier ID sera 1
  if (liste.length === 0) {
    return 1;
  }

  // On récupère le plus grand ID du tableau
  const maxId = Math.max(...liste.map(element => element.id));

  // On retourne le prochain ID
  return maxId + 1;
}
