# kevinahiavee.com

Site personnel de Kevin Ahiavee, publié avec GitHub Pages.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | La page d'accueil en français |
| `en/index.html`, `es/index.html` | Les versions anglaise et espagnole |
| `assets/lang.js` | Le choix automatique de la langue selon l'appareil du visiteur |
| `assets/style.css` | Les styles |
| `assets/main.js` | Les animations et les interactions |
| `assets/img/` | Les photos et l'image de partage sur les réseaux (`og-image.jpg`) |
| `data/linkedin.json` | Les publications LinkedIn affichées sur le site |
| `404.html` | La page affichée pour une adresse introuvable (par exemple un ancien article Blogger) |
| `CNAME` | Le nom de domaine (www.kevinahiavee.com) |
| `robots.txt`, `sitemap.xml` | Les fichiers pour Google |
| `.well-known/security.txt` | Le contact pour signaler une faille de sécurité |

## Mettre le site en ligne

1. Créez un dépôt GitHub, par exemple `kevinahiavee.com`, et envoyez-y tout le contenu de ce dossier. Les fichiers doivent être à la racine du dépôt.
2. Dans le dépôt, ouvrez **Settings > Pages**, puis choisissez **Deploy from a branch**, la branche `main` et le dossier `/ (root)`.
3. Dans **Custom domain**, saisissez `www.kevinahiavee.com`, puis cochez **Enforce HTTPS** dès que l'option est disponible.
4. Dans Blogger, ouvrez **Paramètres > Domaine personnalisé** et retirez kevinahiavee.com, pour libérer le domaine.
5. Chez votre registraire de domaine, modifiez les enregistrements DNS :
   - `CNAME` : `www` → `VOTRE-NOM-GITHUB.github.io`
   - `A` : `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

   La prise en compte peut prendre jusqu'à 24 h.
6. Dans [Google Search Console](https://search.google.com/search-console), ajoutez le domaine, puis envoyez `https://www.kevinahiavee.com/sitemap.xml`.

## Ajouter une publication LinkedIn

Ouvrez `data/linkedin.json` sur GitHub (icône crayon), puis copiez un bloc et collez-le en haut de la liste :

```json
{
  "date": "2026-11-20",
  "titre": "Titre de votre post",
  "texte": "Le début de votre post…",
  "url": "https://www.linkedin.com/posts/...",
  "image": ""
}
```

Supprimez les trois blocs marqués `"exemple": true`, puis enregistrez avec **Commit changes**. Le site se met à jour en une à deux minutes.

## Langues

À la première visite, le site s'affiche dans la langue de l'appareil : le français pour un appareil en français, l'espagnol pour un appareil en espagnol, et l'anglais pour toutes les autres langues. Le bouton FR · EN · ES du menu permet de changer de langue, et le site garde ce choix pour les visites suivantes. Les robots de Google ne sont jamais redirigés : ils indexent les trois versions séparément grâce aux balises hreflang et au plan du site.

Pour modifier un texte, changez-le dans les trois fichiers : `index.html`, `en/index.html` et `es/index.html`. Les posts LinkedIn (`data/linkedin.json`) sont communs aux trois langues.

## Sécurité

Le site est statique : pas de base de données, pas de formulaire, pas de mot de passe à pirater. En plus :

- une politique de sécurité (CSP) n'autorise que les scripts du site, de cdnjs et de jsDelivr, sans aucun script en ligne ;
- les liens externes s'ouvrent sans donner accès à la page d'origine ;
- l'e-mail est reconstitué en JavaScript, pour le cacher aux robots de spam.

Le point le plus important reste votre compte GitHub : activez la **double authentification** (Settings > Password and authentication).
