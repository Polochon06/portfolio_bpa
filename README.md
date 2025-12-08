# 🚀 Portfolio Paul Blanc

Portfolio web moderne et professionnel développé avec HTML, CSS et JavaScript.

## 📁 Structure du Projet

```
portfolio/
│
├── index.html       # Page principale
├── style.css        # Styles CSS
├── script.js        # JavaScript interactif
└── README.md        # Ce fichier
```

## 🎨 Fonctionnalités

✅ **Design Moderne** : Interface élégante avec animations fluides
✅ **Responsive** : Adaptation parfaite mobile, tablette et desktop
✅ **Navigation Smooth** : Défilement fluide entre sections
✅ **Modals Interactives** : Détails des projets en popup
✅ **Animations au Scroll** : Effets visuels lors du défilement
✅ **Menu Mobile** : Hamburger menu pour petits écrans

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Animations, flexbox, grid
- **JavaScript Vanilla** : Aucune dépendance externe
- **Google Fonts** : Typographie Poppins & JetBrains Mono

## 🚀 Installation & Utilisation

### Méthode 1 : Ouverture Simple
1. Télécharge les 3 fichiers (index.html, style.css, script.js)
2. Place-les dans le même dossier
3. Double-clique sur `index.html`

### Méthode 2 : VS Code + Live Server
1. Ouvre VS Code
2. Installe l'extension "Live Server"
3. Ouvre le dossier du portfolio
4. Clic droit sur `index.html` → "Open with Live Server"

### Méthode 3 : Hébergement en Ligne

#### GitHub Pages (Gratuit)
1. Crée un dépôt GitHub
2. Upload les fichiers
3. Va dans Settings → Pages
4. Sélectionne la branche "main" et Save
5. Ton site sera accessible sur `username.github.io/repo-name`

#### Netlify (Gratuit)
1. Va sur [netlify.com](https://netlify.com)
2. Drag & drop ton dossier
3. Site en ligne instantanément !

#### Vercel (Gratuit)
1. Va sur [vercel.com](https://vercel.com)
2. Importe depuis GitHub ou upload direct
3. Déploiement automatique !

## 📝 Personnalisation

### Modifier les Couleurs
Dans `style.css`, ligne 2-9 :
```css
:root {
    --primary: #1e3a5f;        /* Couleur principale (bleu) */
    --accent: #ff6b35;         /* Couleur d'accent (orange) */
    --text: #2c3e50;           /* Texte principal */
    /* ... */
}
```

### Modifier le Contenu
- **Informations personnelles** : Édite `index.html`
- **Projets** : Modifie la section `#projets` dans `index.html`
- **Détails des projets** : Édite `script.js` lignes 100-300 (objet `projectDetails`)

### Ajouter une Nouvelle Section
1. Dans `index.html`, ajoute :
```html
<section id="nouvelle-section" class="section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Titre</h2>
            <div class="section-underline"></div>
        </div>
        <!-- Ton contenu -->
    </div>
</section>
```

2. Dans la navigation, ajoute :
```html
<li><a href="#nouvelle-section" class="nav-link">Nouvelle Section</a></li>
```

## 🎯 Sections du Portfolio

1. **🏠 Accueil** : Hero section avec présentation
2. **👤 À Propos** : Informations personnelles
3. **🎓 Formation** : Parcours académique
4. **💻 Compétences** : Technologies maîtrisées
5. **🚀 Projets** : Réalisations détaillées
6. **📬 Contact** : Coordonnées

## 📱 Responsive Design

Le site s'adapte automatiquement :
- **Desktop** : 1200px et plus
- **Tablette** : 768px - 1199px
- **Mobile** : Moins de 768px

## 🐛 Résolution de Problèmes

### Les styles ne s'appliquent pas
- Vérifie que `style.css` est dans le même dossier que `index.html`
- Vérifie l'orthographe : `<link rel="stylesheet" href="style.css">`

### Le JavaScript ne fonctionne pas
- Vérifie que `script.js` est dans le même dossier
- Ouvre la Console (F12) pour voir les erreurs
- Vérifie l'orthographe : `<script src="script.js"></script>`

### Le menu mobile ne s'affiche pas
- Réduis la largeur de ta fenêtre sous 768px
- Vérifie que le JavaScript est bien chargé

## 💡 Conseils d'Utilisation dans VS Code

### Extensions Recommandées
1. **Live Server** : Aperçu en temps réel
2. **Prettier** : Formatage automatique du code
3. **Auto Rename Tag** : Renomme les balises HTML automatiquement
4. **CSS Peek** : Visualise les CSS depuis HTML

### Raccourcis Utiles
- `Ctrl + /` : Commenter/décommenter
- `Alt + Shift + F` : Formater le code
- `Ctrl + D` : Sélectionner l'occurrence suivante
- `Ctrl + Space` : Autocomplétion

## 🎨 Personnalisation Avancée

### Changer les Animations
Dans `style.css`, cherche `@keyframes` et modifie :
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

### Ajouter des Effets
Dans `script.js`, ajoute tes propres fonctions JavaScript !

## 📊 Performance

- ✅ Pas de librairies externes lourdes
- ✅ CSS et JS optimisés
- ✅ Images web-optimisées recommandées
- ✅ Chargement rapide

## 🤝 Support

Questions ? Contacte Paul Blanc :
- 📧 Email : paul.blc61@gmail.com
- 📱 Téléphone : 06-72-07-65-13

## 📜 Licence

Ce projet est libre d'utilisation pour ton portfolio personnel.

---

**Créé avec ❤️ par Paul Blanc**
**Dernière mise à jour : Décembre 2024**
