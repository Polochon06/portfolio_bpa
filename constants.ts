export const METADATA = {
  title: "Portfolio | Paul Blanc",
  description:
    "Développeur créatif full-stack & motion designer basé en Normandie. Je conçois et développe des expériences web modernes.",
  siteUrl: "https://paulblanc.dev/",
};

export const MENULINKS = [
  { name: "Accueil", ref: "home" },
  { name: "Projets", ref: "works" },
  { name: "Stack", ref: "skills" },
  { name: "Parcours", ref: "timeline" },
  { name: "Contact", ref: "contact" },
];

export const TYPED_STRINGS = [
  "Je conçois et développe des choses",
  "Je crée des interfaces web modernes",
  "Je développe des expériences utilisateur",
  "Je conçois et anime en motion design",
];

export const EMAIL = "zebi6073@gmail.com";

export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com",
  github: "https://github.com/Polochon06",
};

export interface IProject {
  name: string;
  image: string;
  blurImage: string;
  description: string;
  gradient: [string, string];
  url: string;
  tech: string[];
  details?: {
    period: string;
    stack: string;
    features: string[];
  };
}

export const PROJECTS: IProject[] = [
  {
    name: "MT-Congés",
    image: "/projects/mt-conges.webp",
    blurImage: "/projects/blur/mt-conges-blur.webp",
    description:
      "Système RH Java 17 — authentification RBAC admin / manager / employé, workflow de validation multi-niveaux, dashboard avec exports PDF & CSV.",
    gradient: ["#7B2D00", "#FF5F3F"],
    url: "#",
    tech: ["javascript", "html", "css", "git"],
    details: {
      period: "2024 — Projet BTS SIO SLAM",
      stack: "Java 17 · Spring Boot · MySQL · JavaScript · HTML/CSS · Git",
      features: [
        "Authentification RBAC avec 3 rôles : admin, manager, employé",
        "Workflow de validation multi-niveaux pour les demandes de congés",
        "Dashboard administrateur avec exports PDF & CSV",
        "Gestion automatique des soldes et historique des demandes",
        "Interface responsive HTML/CSS/JS vanilla",
      ],
    },
  },
  {
    name: "Gymnova",
    image: "/projects/gymnova.webp",
    blurImage: "/projects/blur/gymnova-blur.webp",
    description:
      "Plateforme e-commerce premium — catalogue filtrable 50+ articles, paiement Stripe 3DS, back-office analytique complet.",
    gradient: ["#1e1b4b", "#6366F1"],
    url: "#",
    tech: ["react", "next", "tailwind", "javascript"],
    details: {
      period: "2024 — Projet BTS SIO SLAM",
      stack: "React 18 · Node.js · Express · MySQL · Tailwind CSS · Stripe API",
      features: [
        "Catalogue e-commerce avec filtres et recherche (50+ articles)",
        "Paiement sécurisé Stripe avec authentification 3DS",
        "Back-office analytique : chiffre d'affaires, stocks, commandes",
        "Authentification JWT et gestion des comptes clients",
        "Interface admin complète pour la gestion du catalogue",
      ],
    },
  },
];

export const SKILLS = {
  frontend: [
    "javascript",
    "react",
    "next",
    "gsap",
    "tailwind",
    "html",
    "css",
    "sass",
  ],
  userInterface: ["figma", "aftereffects", "photoshop", "illustrator"],
  other: ["git"],
};

export enum Branch {
  LEFT = "leftSide",
  RIGHT = "rightSide",
}

export enum NodeTypes {
  CONVERGE = "converge",
  DIVERGE = "diverge",
  CHECKPOINT = "checkpoint",
}

export enum ItemSize {
  SMALL = "small",
  LARGE = "large",
}

export const TIMELINE: Array<TimelineNodeV2> = [
  {
    type: NodeTypes.CHECKPOINT,
    title: "2025",
    size: ItemSize.LARGE,
    shouldDrawLine: false,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "En cours d'obtention du BTS SIO SLAM 🎓",
    size: ItemSize.SMALL,
    subtitle:
      "Dernière année du BTS Services Informatiques aux Organisations option SLAM — spécialisation développement logiciel et web.",
    slideImage: "/projects/gymnova.webp",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "2024",
    size: ItemSize.LARGE,
    shouldDrawLine: false,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.DIVERGE,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "Gymnova — E-Commerce",
    size: ItemSize.SMALL,
    subtitle:
      "Plateforme e-commerce fullstack avec React 18, Node.js et paiement Stripe 3DS 🛒",
    slideImage: "/projects/gymnova.webp",
    shouldDrawLine: true,
    alignment: Branch.RIGHT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "MT-Congés — Système RH",
    size: ItemSize.SMALL,
    subtitle:
      "Application Java 17 · Spring Boot avec RBAC multi-rôles, workflow de validation et exports PDF 🚀",
    slideImage: "/projects/mt-conges.webp",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CONVERGE,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "2023",
    size: ItemSize.LARGE,
    shouldDrawLine: false,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "Début BTS SIO SLAM",
    size: ItemSize.SMALL,
    subtitle:
      "Apprentissage des fondamentaux : Java, SQL, HTML/CSS/JS, architecture MVC, bases de données relationnelles.",
    slideImage: "/projects/mt-conges.webp",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
  {
    type: NodeTypes.CHECKPOINT,
    title: "Motion Design & VFX",
    size: ItemSize.SMALL,
    subtitle:
      "Développement des compétences créatives : After Effects, Element 3D, Trapcode, compositing vidéo 🎬",
    slideImage: "/projects/gymnova.webp",
    shouldDrawLine: true,
    alignment: Branch.LEFT,
  },
];

export type TimelineNodeV2 = CheckpointNode | BranchNode;

export interface CheckpointNode {
  type: NodeTypes.CHECKPOINT;
  title: string;
  subtitle?: string;
  size: ItemSize;
  image?: string;
  slideImage?: string;
  shouldDrawLine: boolean;
  alignment: Branch;
}

export interface BranchNode {
  type: NodeTypes.CONVERGE | NodeTypes.DIVERGE;
}

export const GTAG = "";
