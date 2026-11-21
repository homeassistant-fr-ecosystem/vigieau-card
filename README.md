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
   - **Entité niveau d'alerte** : sélectionnez le sensor de niveau d'alerte (ex. `sensor.alert_level_in_thorigne_fouillard`)
   - **Entité niveau numérique** (optionnel) : sélectionnez le sensor numérique (ex. `sensor.alert_level_numeric_thorigne_fouillard`)
   - **Entités de restrictions** : sélectionnez un ou plusieurs sensors de restrictions (ex. `sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard`)
   - Options d'affichage selon vos besoins
6. Cliquez sur **ENREGISTRER**

### Configuration YAML

Vous pouvez aussi configurer la carte directement en YAML :

## Configuration

### Configuration de base

```yaml
type: custom:vigieau-card
alert_level_entity: sensor.alert_level_in_thorigne_fouillard
restriction_entities:
  - sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard
  - sensor.jardins_potagers_restrictions_thorigne_fouillard
  - sensor.pelouses_restrictions_thorigne_fouillard
show_alert_level: true
show_restrictions: true
show_progress: false
```

### Configuration complète (avec niveau numérique)

```yaml
type: custom:vigieau-card
alert_level_entity: sensor.alert_level_in_thorigne_fouillard
alert_level_numeric_entity: sensor.alert_level_numeric_thorigne_fouillard
restriction_entities:
  - sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard
  - sensor.jardins_potagers_restrictions_thorigne_fouillard
  - sensor.pelouses_restrictions_thorigne_fouillard
  - sensor.lavage_des_vehicules_restrictions_thorigne_fouillard
  - sensor.piscines_restrictions_thorigne_fouillard
show_alert_level: true
show_restrictions: true
show_progress: false
```

## Options

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| `type` | string | **Requis** | `custom:vigieau-card` |
| `alert_level_entity` | string | — | Entity ID du sensor de niveau d'alerte (ex. `sensor.alert_level_in_thorigne_fouillard`) |
| `alert_level_numeric_entity` | string | — | Entity ID du sensor de niveau numérique 0-4 (optionnel) |
| `restriction_entities` | string[] | — | Liste des Entity ID des sensors de restrictions |
| `show_alert_level` | boolean | `true` | Affiche la bannière de niveau d'alerte |
| `show_restrictions` | boolean | `true` | Affiche la grille des restrictions par catégorie |
| `show_progress` | boolean | `false` | Affiche la barre de progression numérique (0-4) |

## Entités requises

La carte utilise les entités créées par l'intégration [kamaradclimber/vigieau](https://github.com/kamaradclimber/vigieau) pour votre commune. Sélectionnez-les explicitement dans l'éditeur de carte :

- **Niveau d'alerte** : `sensor.alert_level_in_{ville_slug}` (ex. `sensor.alert_level_in_thorigne_fouillard`)
- **Niveau numérique** : `sensor.alert_level_numeric_{ville_slug}` (optionnel, ex. `sensor.alert_level_numeric_thorigne_fouillard`)
- **Restrictions par catégorie** : `sensor.{categorie}_restrictions_{ville_slug}` (ex. `sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard`)

Ces entités sont créées automatiquement par l'intégration vigieau pour votre commune. Vous les trouverez dans **Paramètres** → **Appareils et services** → **Entités**.

## Exemples d'utilisation

### Ville unique (Thorigne-Fouillard)

```yaml
type: custom:vigieau-card
alert_level_entity: sensor.alert_level_in_thorigne_fouillard
restriction_entities:
  - sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard
  - sensor.jardins_potagers_restrictions_thorigne_fouillard
  - sensor.pelouses_restrictions_thorigne_fouillard
show_alert_level: true
show_restrictions: true
show_progress: false
```

### Vue compacte (niveau d'alerte seulement)

```yaml
type: custom:vigieau-card
alert_level_entity: sensor.alert_level_in_thorigne_fouillard
show_restrictions: false
show_progress: false
```

### Vue complète (avec niveau numérique)

```yaml
type: custom:vigieau-card
alert_level_entity: sensor.alert_level_in_thorigne_fouillard
alert_level_numeric_entity: sensor.alert_level_numeric_thorigne_fouillard
restriction_entities:
  - sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard
  - sensor.jardins_potagers_restrictions_thorigne_fouillard
  - sensor.pelouses_restrictions_thorigne_fouillard
  - sensor.lavage_des_vehicules_restrictions_thorigne_fouillard
  - sensor.piscines_restrictions_thorigne_fouillard
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
