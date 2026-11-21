# Vigieau Card

Une carte Lovelace personnalisée pour Home Assistant affichant les données de restriction d'eau (sécheresse) françaises de l'intégration [kamaradclimber/vigieau](https://github.com/kamaradclimber/vigieau).

## Fonctionnalités

- 🚨 **Niveau d'alerte** : affichage coloré du niveau actuel (vert / jaune / orange / rouge)
- 💧 **Grille de restrictions** : toutes les catégories d'usage avec bordures colorées
- 📊 **Barre de progression** : niveau d'alerte sur une échelle 0 à 4
- 👆 **Actions au clic** : ouvre la fenêtre « Plus d'infos » de Home Assistant pour le détail
- 📱 **Responsive** : fonctionne sur mobile et desktop
- 🇫🇷🇬🇧 **Traductions** : français et anglais intégrés
- ⚙️ **Éditeur UI** : configuration visuelle complète dans Home Assistant

## Installation

### HACS (recommandé)

1. Ouvrez HACS
2. Allez dans **Frontend**
3. Cliquez sur le menu (trois points) en haut à droite
4. Sélectionnez **Dépôts personnalisés**
5. Ajoutez l'URL de ce dépôt et choisissez la catégorie **Lovelace**
6. Cliquez sur **Installer**
7. Rafraîchissez votre navigateur

### Installation manuelle

1. Construisez la carte :
   ```bash
   cd vigieau-card
   npm run build
   ```
2. Copiez `dist/vigieau-card.js` dans le dossier `www/` de votre configuration Home Assistant, par exemple `<config>/www/community/vigieau-card/`
3. Ajoutez la carte aux ressources Lovelace :

```yaml
url: /local/community/vigieau-card/vigieau-card.js
type: module
```

## Ajout au tableau de bord

### Éditeur visuel UI (recommandé)

1. Allez sur votre tableau de bord
2. Cliquez sur le menu ⋮ → « Modifier le tableau de bord »
3. Cliquez sur **+ AJOUTER UNE CARTE**
4. Descendez dans la section « Personnalisé » et sélectionnez **Vigieau Card**
5. Remplissez la configuration :
   - **Code INSEE de la ville** (requis)
   - Options d'affichage selon vos besoins
6. Cliquez sur **ENREGISTRER**

### Configuration YAML

Vous pouvez aussi configurer la carte directement en YAML :

## Configuration

### Configuration de base

```yaml
type: custom:vigieau-card
city_code: "75056"
```

### Configuration complète

```yaml
type: custom:vigieau-card
city_code: "75056"
show_alert_level: true
show_restrictions: true
show_progress: false
```

## Options

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| `type` | string | **Requis** | `custom:vigieau-card` |
| `city_code` | string | **Requis** | Code INSEE de la commune (ex. `75056` pour Paris, `35238` pour Rennes) |
| `show_alert_level` | boolean | `true` | Affiche la bannière de niveau d'alerte |
| `show_restrictions` | boolean | `true` | Affiche la grille des restrictions par catégorie |
| `show_progress` | boolean | `false` | Affiche la barre de progression numérique (0-4) |

## Trouver votre code INSEE

Le code INSEE est le code officiel géographique de votre commune française. Vous pouvez le trouver :

- Sur [Wikipédia – Code officiel géographique](https://fr.wikipedia.org/wiki/Code_officiel_g%C3%A9ographique#Code_commune)
- Dans Home Assistant : **Paramètres** → **Appareils et services** → **Intégrations** → Vigieau
- Via le texte d'aide de l'éditeur de carte (ex. `75056` pour Paris, `35238` pour Rennes)

## Entités requises

La carte attend les entités suivantes (où `{city_code}` est votre code INSEE configuré) :

- `sensor.vigieau_alert_level_in_{city_code}` — Niveau d'alerte actuel
- `sensor.vigieau_alert_level_numeric_{city_code}` — Niveau numérique (0 à 4)
- `sensor.vigieau_{categorie}_restrictions_{city_code}` — Restrictions par catégorie (fontaines, jardins, pelouses, lavage_vehicules, piscines, routes, toits, etangs)

Ces entités sont créées automatiquement par l'intégration vigieau pour votre commune.

## Exemples d'utilisation

### Ville unique

```yaml
type: custom:vigieau-card
city_code: "75056"
```

![vigieau-card](assets/sample.png)

### Vue compacte (niveau d'alerte seulement)

```yaml
type: custom:vigieau-card
city_code: "35238"
show_restrictions: false
show_progress: false
```

### Vue complète

```yaml
type: custom:vigieau-card
city_code: "75056"
show_alert_level: true
show_restrictions: true
show_progress: false
```

## Développement

```bash
# Installer les dépendances
npm install

# Construire la carte
npm run build

# Linter
npm run lint

# Reconstruire à la volée pendant le développement
npm run watch
```

## Contribuer

Les contributions sont les bienvenues ! Ouvrez une issue ou une pull request pour proposer une amélioration, une correction de bug ou une nouvelle traduction.

## Licence

MIT
