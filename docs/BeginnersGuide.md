# Guide du projet pour débutants

Ce projet React permet d'annoter des façades en traçant des formes sur une image.
Il a été créé avec **Create React App** et utilise plusieurs bibliothèques pour
simplifier le développement :

- **React 19** pour construire l'interface utilisateur.
- **Fabric.js** pour le dessin sur un `<canvas>` HTML.
- **react-image-crop** pour recadrer les images avant l'annotation.
- **Tailwind CSS** pour la mise en forme rapide des composants.
- **lucide-react** pour afficher des icônes vectorielles.

## Structure générale
Le point d'entrée se trouve dans `src/App.js` qui affiche le composant
`AnnotationCanvas`. Celui‑ci orchestre l'ensemble de l'application.

```text
src/
├─ App.js               → charge `AnnotationCanvas`
└─ components/
   ├─ AnnotationCanvas.js
   ├─ CanvasWithGrid.js
   ├─ CropModal.js
   ├─ ScaleModal.js
   ├─ Sidebar.js
   ├─ Toolbox.js
   └─ TopBar.js
```

## Composants principaux
### `AnnotationCanvas`
Composant central qui :
- initialise l'objet `fabric.Canvas` pour dessiner ;
- gère l'état des différents modes (rectangle, polygone, échelle, etc.) via
  `useState` et `useRef` ;
- maintient l'historique pour `undo`/`redo` ;
- contrôle l'affichage des calques (`fenetre`, `porte`, `facade`, etc.) ;
- propose la découpe d'image (`CropModal`) et la définition d'une échelle
  (`ScaleModal`).

### `CanvasWithGrid`
Encapsule le `<canvas>` de Fabric dans un conteneur qui dessine une grille.
Les propriétés `width`, `height` et `gridSize` permettent de configurer la
surface de dessin et la taille des carreaux.

### `TopBar`
Barre d'outils horizontale offrant :
- la sélection du type d'annotation ;
- les boutons pour activer le mode rectangle, polygone ou échelle ;
- l'import d'une image et la sauvegarde des annotations.

### `Toolbox`
Panneau latéral contenant les actions `undo`/`redo` et des cases à cocher pour
activer ou cacher les différents calques de dessin.

### `Sidebar`
Deuxième panneau latéral pour choisir l'entité à annoter, démarrer ou arrêter
le dessin et exporter les annotations.

### `CropModal` et `ScaleModal`
Fenêtres modales utilisées respectivement pour recadrer l'image importée et
indiquer la longueur réelle d'un segment afin de calculer une échelle.

## Logique algorithmique
### Grille de dessin
`CanvasWithGrid` n'utilise pas de boucles pour tracer la grille. Deux
gradients CSS sont superposés : l'un pour les lignes verticales, l'autre
pour les horizontales. Le motif est répété tous les `gridSize` pixels, ce
qui permet d'agrandir ou de réduire les carreaux en changeant simplement
cette valeur.

### Historique d'annotations
`AnnotationCanvas` garde deux piles : `annotationsHistory` et `redoStack`.
- Lors d'un **undo**, la dernière annotation est retirée de la toile et
  déplacée de `annotationsHistory` vers `redoStack`.
- Lors d'un **redo**, l'opération inverse est effectuée.
Ce mécanisme de piles garantit un retour arrière facile sans recalculer
toute la scène.

### Polygones
Chaque clic de souris ajoute un point dans `currentPolygonPoints`. Lorsque
l'utilisateur ferme la forme, l'aire est calculée via la **formule de la
corde** ("shoelace formula") et le périmètre par la somme des distances entre
points successifs (`Math.hypot`). Ces valeurs peuvent ensuite être utilisées
pour afficher des mesures précises.
Les rectangles sont eux aussi exportés comme des polygones ; leur aire et leur
périmètre sont donc calculés de la même manière.

### Conversion géographique
La fonction `pixelToGeo` effectue une interpolation linéaire entre les
limites géographiques connues (`geoBounds`) pour transformer une position en
pixels en coordonnées latitude/longitude.

## Outils et règles React utiles
- Les composants sont écrits en **fonctionnel** et utilisent les **hooks**
  (`useState`, `useEffect`, `useRef`).
- Les hooks doivent toujours être appelés au **niveau supérieur** du composant
  (pas dans des conditions ou des boucles).
- L'état doit être **immutable** : on crée une nouvelle valeur plutôt que de
  modifier directement l'ancienne.
- Les noms de composants React commencent par une **majuscule**.
- Le JSX ressemble à du HTML mais reste du **JavaScript** : on utilise `className`
  au lieu de `class`, et `{}` pour insérer des expressions.

## Scripts npm
- `npm start` : lance l'application en développement.
- `npm test` : exécute les tests unitaires.
- `npm run build` : produit la version optimisée pour la production.

## Aller plus loin
- Lire la [documentation officielle de React](https://fr.reactjs.org/docs/getting-started.html).
- Expérimenter avec les composants existants en changeant les props ou le style.
- Ajouter de nouveaux outils de dessin pour pratiquer.
