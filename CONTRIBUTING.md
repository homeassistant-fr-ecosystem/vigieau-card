# Contribuer à vigieau-card

Les contributions sont les bienvenues ! Ce document explique comment contribuer au projet.

## Convention de commit

Ce projet utilise [Conventional Commits](https://www.conventionalcommits.org/) pour le versionnage automatique (semantic-release). Chaque message de commit doit suivre ce format :

```
<type>(<scope>): <description>
```

Exemples :
- `feat(card): ajouter l'option taille compacte`
- `fix(card): gérer les entités indisponibles`
- `docs(readme): mettre à jour l'installation HACS`
- `test(card): ajouter les tests de couleur de restriction`
- `chore(deps): mettre à jour lit vers la v3.3`

Types autorisés : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`, `revert`.

## Processus de contribution

1. **Forkez le dépôt** et créez une branche à partir de `main` :
   ```bash
   git checkout -b feature/mon-amelioration
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```

3. **Faites vos modifications** dans le dossier `src/`.

4. **Ajoutez ou mettez à jour les tests** si vous modifiez la logique :
   ```bash
   npm test
   ```

5. **Vérifiez le lint et le typecheck** :
   ```bash
   npm run lint
   npm run typecheck
   ```

6. **Construisez la carte** :
   ```bash
   npm run build
   ```

7. **Commitez** en respectant la convention de commit ci-dessus, puis ouvrez une Pull Request.

## Traductions

Les fichiers de traduction se trouvent dans `src/fr.json` et `src/en.json`. Toute nouvelle chaîne affichée dans l'interface doit être ajoutée aux deux fichiers avec la même clé.

## Versions

Les versions sont publiées automatiquement via [semantic-release](https://semantic-release.gitbook.io/) à chaque push sur `main`. Pas besoin de bump manuel.

## Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT, identique au projet.
