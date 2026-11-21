# Vigieau Card

Une carte Lovelace personnalisée pour Home Assistant affichant les données de restriction d'eau (sécheresse) françaises de l'intégration [kamaradclimber/vigieau](https://github.com/kamaradclimber/vigieau).

## Aperçu

La carte affiche le niveau d'alerte actuel (avec code couleur), la liste des restrictions par catégorie d'usage, et une barre de progression du niveau d'alerte. Elle s'intègre nativement à l'éditeur d'interface de Home Assistant.

## Fonctionnalités

- 🚨 **Niveau d'alerte** : affichage coloré du niveau actuel (vert / jaune / orange / rouge)
- 💧 **Grille de restrictions** : toutes les catégories d'usage avec bordures colorées
- 📊 **Barre de progression** : niveau d'alerte sur une échelle 0 à 4
- 👆 **Actions au clic et au clavier** : ouvre la fenêtre « Plus d'infos » de Home Assistant (clic ou Entrée/Espace)
- 📱 **Responsive** : fonctionne sur mobile et desktop
- 🇫🇷🇬🇧 **Traductions** : français et anglais intégrés
- ⚙️ **Éditeur UI** : configuration visuelle complète dans Home Assistant
- 🕒 **Horodatage** : affiche la dernière mise à jour de l'entité niveau d'alerte
- 📐 **Taille compacte** : affichage réduit pour les petits tableaux de bord
- 🔍 **Filtre** : masque les catégories sans restriction active

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
   npm install
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
   - **Code ville / slug** (optionnel) : code INSEE ou slug de la ville (ex. `35322` ou `thorigne_fouillard`). Génère automatiquement les entités si elles ne sont pas saisies.
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

### Configuration complète (avec toutes les options)

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
  - sensor.voiries_trottoirs_restrictions_thorigne_fouillard
  - sensor.toitures_facades_restrictions_thorigne_fouillard
  - sensor.plans_deau_restrictions_thorigne_fouillard
show_alert_level: true
show_restrictions: true
show_progress: false
show_last_updated: true
compact: false
hide_no_restriction: false
```

## Options

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| `type` | string | **Requis** | `custom:vigieau-card` |
| `city_code` | string | — | Code INSEE ou slug de la ville (génère automatiquement les entity IDs) |
| `alert_level_entity` | string | — | Entity ID du sensor de niveau d'alerte |
| `alert_level_numeric_entity` | string | — | Entity ID du sensor de niveau numérique 0-4 (optionnel) |
| `restriction_entities` | string[] | — | Liste des Entity ID des sensors de restrictions |
| `show_alert_level` | boolean | `true` | Affiche la bannière de niveau d'alerte |
| `show_restrictions` | boolean | `true` | Affiche la grille des restrictions par catégorie |
| `show_progress` | boolean | `false` | Affiche la barre de progression numérique (0-4) |
| `show_last_updated` | boolean | `false` | Affiche l'horodatage de la dernière mise à jour |
| `compact` | boolean | `false` | Affiche la carte en taille compacte (padding réduit) |
| `hide_no_restriction` | boolean | `false` | Masque les catégories sans restriction active (niveau « aucune restriction » / « vigilance ») |

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
compact: true
```

### Vue complète (avec niveau numérique et horodatage)

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
show_progress: true
show_last_updated: true
```

### Filtrer uniquement les restrictions actives

```yaml
type: custom:vigieau-card
alert_level_entity: sensor.alert_level_in_thorigne_fouillard
restriction_entities:
  - sensor.alimentation_des_fontaines_restrictions_thorigne_fouillard
  - sensor.jardins_potagers_restrictions_thorigne_fouillard
  - sensor.pelouses_restrictions_thorigne_fouillard
hide_no_restriction: true
```

## Dépannage

### La carte est vide ou affiche « Veuillez configurer les entités »

Vérifiez qu'au moins une entité est configurée (niveau d'alerte ou restrictions). Si vous utilisez le `city_code`, assurez-vous que les entités correspondantes existent dans Home Assistant.

### Une entité affiche « Entité indisponible » ou « État inconnu »

L'entité existe mais n'a pas d'état valide pour le moment. Cela peut arriver si le service vigieau est temporairement indisponible ou si l'intégration n'a pas encore récupéré les données. La carte affiche une couleur grise dans ce cas.

### Une restriction ne s'affiche pas

Vérifiez que l'entity ID est correct et que l'entité existe dans **Paramètres** → **Appareils et services** → **Entités**. Si vous utilisez `hide_no_restriction: true`, les catégories au niveau « aucune restriction » ou « vigilance » sont masquées.

### La carte ne se met pas à jour

Vérifiez que l'entité configurée change bien d'état dans Home Assistant. La carte réagit aux changements d'état des entités configurées.

## Développement

```bash
# Installer les dépendances
npm install

# Construire la carte
npm run build

# Linter
npm run lint

# Vérifier les types TypeScript
npm run typecheck

# Exécuter les tests
npm test

# Reconstruire à la volée pendant le développement
npm run watch
```

## Contribuer

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour la convention de commit et le processus de contribution.

## Licence

MIT
