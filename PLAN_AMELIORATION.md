# Plan d'amélioration — vigieau-card

**Objet :** Liste priorisée des améliorations à apporter à la carte Lovelace Vigieau.
**Statut :** À traiter — ordre par priorité (P0 = bloquant, P3 = nice-to-have).

---

## 1. Critique (P0) — À faire en premier

### P0-1 : Ajouter une suite de tests
Le projet n'a **aucun test**. C'est le plus gros risque de régression.

- [ ] Ajouter **Vitest** (ou Jest) + `@testing-library` pour tester la logique pure (`_getRestrictionColor`, `_getCategoryDisplayName`, `_buildEntityIdsFromCityCode`, parsage d'entités).
- [ ] Ajouter un test de rendu Lit (via `lit/testing` ou `@web/test-runner`) pour vérifier que le card affiche bien les sections selon la config.
- [ ] Ajouter une étape `test` dans `.github/workflows/ci.yml` (après lint, avant build).
- [ ] Cible : **≥ 80 % de couverture** sur le code non-DOM.

### P0-2 : Automatisation des releases (semantic-release)
Aujourd'hui la release est manuelle (`manual-release.yaml`) et le versionnage est fait à la main.

- [ ] Installer `semantic-release` + `@semantic-release/github` + `conventional-changelog`.
- [ ] Configurer GitHub Actions pour publier automatiquement sur push vers `main` (conventional commits requis).
- [ ] Générer automatiquement le `CHANGELOG.md` et les releases GitHub avec artefacts `dist/`.
- [ ] Supprimer ou simplifier `manual-release.yaml`.

### P0-3 : Mises à jour de dépendances automatisées
Aucun outil ne surveille les dépendances (lit, rollup, typescript, custom-card-helpers…).

- [ ] Ajouter **Dependabot** (`.github/dependabot.yml`) ou **Renovate** avec revue hebdomadaire.
- [ ] Mettre à jour les actions GitHub (`actions/checkout@v4`, `setup-node@v4` → dernières versions stables).

---

## 2. Haute priorité (P1) — Qualité du code et cohérence

### P1-1 : Factoriser les traductions (éviter la duplication)
`_getCategoryDisplayName` dans `vigieau-card.ts` contient des traductions **en dur** (FR/EN) qui dupliquent déjà `src/fr.json` et `src/en.json`. Risque d'incohérence.

- [ ] Remplacer la map `translations` inline par des appels à `localizeCommon(key, lang)`.
- [ ] Ajouter les clés manquantes aux fichiers JSON (noms de catégories, icônes éventuellement).
- [ ] Supprimer la fonction `localizeFace` inutilisée dans `localize.ts`.

### P1-2 : Gestion des états d'erreur et entités indisponibles
Quand une entité configurée n'existe pas ou est `unavailable`/`unknown`, le card affiche silencieusement rien ou une valeur par défaut.

- [ ] Ajouter un état visuel « entité introuvable / indisponible » (icône d'alerte + message traduisible).
- [ ] Traiter le cas `state === 'unavailable'` ou `state === 'unknown'` dans `_getRestrictionColor` (couleur grise par exemple).
- [ ] Ajouter une clé de traduction `entity_unavailable` / `entity_not_found`.

### P1-3 : Robustesse du parsage d'entités
`_updateEntities` extrait la catégorie de l'`entity_id` avec des regex fragiles (`sensor.{cat}_restrictions_{ville}`, `binary_sensor.vigieau-{cat}-…`).

- [ ] Préférer l'attribut de l'entité (si l'intégration vigieau expose la catégorie) plutôt que le parsage de l'`entity_id`.
- [ ] Ajouter un fallback robuste et journaliser en console (ou ignorer silencieusement) si la catégorie ne peut pas être extraite.

### P1-4 : Double rendu potentiel
`_updateEntities()` est appelé depuis `updated()` et appelle `this.requestUpdate()`, ce qui peut provoquer un double cycle de rendu à chaque changement de `hass` ou `_config`.

- [ ] Vérifier que `shouldUpdate` filtre efficacement pour éviter les rendus inutiles.
- [ ] Envisager de mettre à jour `_entities` dans `shouldUpdate` / avant le render plutôt qu'en `updated`.

### P1-5 : ESLint / TypeScript plus strict
- [ ] Activer `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` dans `tsconfig.json`.
- [ ] Ajouter une règle eslint pour interdire `any` et imposer le typage de retour.
- [ ] Corriger les avertissements actuels si `tsc --noEmit` en signale.

---

## 3. Priorité moyenne (P2) — Fonctionnalités et UX

### P2-1 : Accessibilité (a11y)
- [ ] Ajouter des `aria-label` / `aria-labelledby` sur les éléments cliquables (niveau d'alerte, items de restriction).
- [ ] S'assurer que les items de restriction sont focusables au clavier (`tabindex="0"`, gestion `Enter`/`Espace`).
- [ ] Ne pas se fier uniquement à la couleur pour l'alerte : ajouter une icône ou un texte de contexte (déjà partiellement fait, à compléter).

### P2-2 : Informations supplémentaires
- [ ] Afficher l'horodatage de la dernière mise à jour (`last_updated` / `last_changed` de l'entité niveau d'alerte).
- [ ] Option « afficher uniquement les catégories en restriction » (filtrer le niveau `aucune restriction` / `vigilance`).
- [ ] Option de tri des restrictions (alphabétique, par sévérité, par ordre de config).

### P2-3 : Thème et apparence
- [ ] Vérifier le rendu en mode sombre (les couleurs de bordure utilisent déjà les variables HA, c'est bon — à confirmer visuellement).
- [ ] Ajouter une option de taille compacte (réduire le padding et la taille des items).
- [ ] Ajouter une option de couleurs personnalisées par niveau (override CSS).

### P2-4 : Actions et interactions
- [ ] Clic sur l'icône d'une restriction → ouvrir le « Plus d'infos » (déjà fait via `@click`, à confirmer sur tous les items).
- [ ] Ajouter un bouton de rafraîchissement manuel (recharger les états des entités).

---

## 4. Priorité basse (P3) — Documentation, packaging, finitions

### P3-1 : Documentation
- [ ] Ajouter `CONTRIBUTING.md` (comment contribuer, conventions de commit, processus de PR).
- [ ] Ajouter `CODEOWNERS` pour assigner les revues.
- [ ] Ajouter `SECURITY.md` (politique de sécurité / divulgation).
- [ ] Compléter le `README.md` :
  - Captures d'écran (mobile + desktop).
  - Section « Dépannage » (entité introuvable, carte vide, niveaux de couleur).
  - Section « Changelog » ou lien vers les releases GitHub.
  - Liste complète des entités vigieau supportées.

### P3-2 : Packaging / distribution
- [ ] Vérifier que `dist/` n'est pas inutilement commitée (ajouter à `.gitignore` si c'est un artefact de build, ou la garder si HACS en a besoin — à décider).
- [ ] Ajouter le champ `files` dans `package.json` pour limiter ce qui est publié sur npm.
- [ ] Ajouter une icône de carte (`icon.png` ou SVG) pour l'affichage dans l'éditeur Lovelace.

### P3-3 : Internationalisation
- [ ] Ajouter d'autres langues (es, de, it…) si des contributeurs se manifestent.
- [ ] Garder `en.json` comme source de vérité et automatiser la vérification des clés (déjà fait dans `translation-check`, à maintenir).

### P3-4 : Performance / bundle
- [ ] Surveiller la taille du bundle (déjà dans CI, seuil 1 Mo — à confirmer que c'est bien en dessous).
- [ ] Envisager le code-splitting de l'éditeur si le bundle grossit (déjà `inlineDynamicImports: true`, à maintenir).

---

## 5. Planning suggéré (4 sprints)

| Sprint | Thème | Tickets |
|--------|-------|---------|
| **Sprint 1** | Fondations | P0-1 (tests), P0-2 (semantic-release), P0-3 (dependabot) |
| **Sprint 2** | Qualité code | P1-1 (traductions), P1-2 (états d'erreur), P1-3 (parsage entités), P1-5 (lint/TS strict) |
| **Sprint 3** | UX / Fonctions | P2-1 (a11y), P2-2 (horodatage, filtre, tri), P2-3 (thème compact) |
| **Sprint 4** | Documentation / release | P3-1 (docs), P3-2 (packaging), P3-3 (i18n), P3-4 (bundle) |

---

## 6. Critères de succès (Definition of Done)

- [ ] CI verte sur `push` et `PR` (lint + typecheck + tests + build + traduction + taille bundle).
- [ ] Couverture de tests ≥ 80 %.
- [ ] Au moins un release automatisé via semantic-release avec changelog généré.
- [ ] README mis à jour avec captures d'écran et dépannage.
- [ ] Aucun `console.log` ni `TODO` restant dans `src/` (déjà vérifié par CI).

---

## Annexe : fichiers du projet concernés

- `src/vigieau-card.ts` — logique principale, rendu, parsage entités, couleurs
- `src/vigieau-card-editor.ts` — éditeur UI
- `src/localize.ts`, `src/fr.json`, `src/en.json` — traductions
- `tsconfig.json` — config TypeScript
- `eslint.config.js` — config lint
- `rollup.config.mjs` — build
- `package.json` — dépendances et scripts
- `.github/workflows/ci.yml` — CI
- `.github/workflows/manual-release.yaml` — release manuelle
- `.github/workflows/validate.yml` — validation HACS
- `README.md` — documentation utilisateur
- `hacs.json` — déclaration HACS
