# Changelog

Tous les changements notables apportés à ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet respecte le [Versioning Sémantique](https://semver.org/lang/fr/).

## [Unreleased]

### Ajouté
- Les entités de restriction introuvables sont maintenant affichées avec un état visuel d'erreur (icône et texte grisés, classe `entity-not-found`) au lieu d'être masquées silencieusement, afin de signaler clairement un `entity_id` incorrect ou une entité absente de Home Assistant.

### Modifié
- Retrait de l'option `show_timestamp` / `last_updated` (affichage de la date de mise à jour dans l'en-tête) et de sa traduction associée.
- Le badge du niveau d'alerte a été retravaillé (fond, bordure, rayon de coins, effet de survol) pour une meilleure lisibilité.
- Les items de restriction affichent désormais une légère ombre portée pour mieux se détacher de la carte.

### Corrigé
- Correction d'un bug où les restrictions configurées mais dont l'entité n'était pas encore présente dans `hass.states` étaient totalement absentes du rendu (carte vide ou « Aucune donnée »).

## [1.0.0-B1] - 2026-11-22

### Ajouté
- Première version bublique de la carte Vigieau pour Home Assistant.
- Affichage du niveau d'alerte avec code couleur.
- Grille de restrictions par catégorie d'usage avec bordures colorées.
- Barre de progression du niveau d'alerte (échelle 0 à 4).
- Éditeur UI complet dans Lovelace.
- Traductions français et anglais.
- Options : taille compacte, filtre « masquer sans restriction », tri (config / alpha / sévérité), affichage ville, rafraîchissement manuel.
- Gestion des états d'erreur : entité indisponible, état inconnu, entité introuvable.
