import Head from "next/head";
import Link from "next/link";

const FRONTEND_STACK = [
  { label: "React 18", color: "#61dafb" },
  { label: "React Router", color: "#ca4245" },
  { label: "Axios", color: "#5a29e4" },
  { label: "Stripe React", color: "#635bff" },
  { label: "CSS Custom", color: "#38bdf8" },
];

const BACKEND_STACK = [
  { label: "Node.js", color: "#339933" },
  { label: "Express", color: "#ffffff" },
  { label: "MySQL2", color: "#00758f" },
  { label: "JWT", color: "#f59e0b" },
  { label: "Bcrypt", color: "#6366f1" },
  { label: "Stripe API", color: "#635bff" },
  { label: "CORS", color: "#10b981" },
];

const FEATURES = [
  {
    icon: "🛒",
    title: "Catalogue & panier",
    desc: "Catalogue dynamique avec filtres par catégorie, niveau et recherche textuelle. Panier interactif avec gestion temps réel des stocks et calcul automatique du total.",
  },
  {
    icon: "🔐",
    title: "Authentification JWT",
    desc: "Système d'inscription/connexion sécurisé. Tokens JWT avec expiration 24h. Mots de passe hashés en Bcrypt (10 rounds). Gestion des sessions côté client.",
  },
  {
    icon: "💳",
    title: "Paiement Stripe",
    desc: "Intégration Stripe en mode test. Création de PaymentIntent côté serveur, confirmation côté client. Compatible 3DS (Strong Customer Authentication).",
  },
  {
    icon: "⚙️",
    title: "Interface admin",
    desc: "Back-office complet accessible aux comptes admin. CRUD produits (création, édition, suppression). Gestion des stocks en temps réel. Contrôle d'accès par rôle (client/admin).",
  },
  {
    icon: "📦",
    title: "Gestion des commandes",
    desc: "Création de commandes à la validation du paiement. Historique des commandes par utilisateur. Confirmation de paiement, annulation, et suivi des statuts.",
  },
  {
    icon: "🔒",
    title: "Sécurité API",
    desc: "Middleware d'authentification JWT sur routes protégées. CORS configuré. Prévention des injections SQL avec requêtes préparées. Validation des données serveur.",
  },
];

const API_ROUTES = [
  { method: "POST", path: "/api/auth/register", desc: "Inscription", color: "#10b981" },
  { method: "POST", path: "/api/auth/login", desc: "Connexion", color: "#10b981" },
  { method: "GET", path: "/api/products", desc: "Catalogue (filtres)", color: "#3b82f6" },
  { method: "GET", path: "/api/products/:id", desc: "Détail produit", color: "#3b82f6" },
  { method: "POST", path: "/api/products", desc: "Créer produit (admin)", color: "#10b981" },
  { method: "PUT", path: "/api/products/:id", desc: "Modifier produit (admin)", color: "#f59e0b" },
  { method: "DELETE", path: "/api/products/:id", desc: "Supprimer produit (admin)", color: "#ef4444" },
  { method: "GET", path: "/api/cart", desc: "Voir le panier", color: "#3b82f6" },
  { method: "POST", path: "/api/cart", desc: "Ajouter au panier", color: "#10b981" },
  { method: "DELETE", path: "/api/cart/:id", desc: "Retirer du panier", color: "#ef4444" },
  { method: "POST", path: "/api/orders", desc: "Créer une commande", color: "#10b981" },
  { method: "GET", path: "/api/orders", desc: "Mes commandes", color: "#3b82f6" },
  { method: "POST", path: "/api/orders/confirm-payment", desc: "Confirmer paiement Stripe", color: "#635bff" },
];

const DB_TABLES = [
  { name: "users", desc: "Comptes, rôles, infos personnelles" },
  { name: "products", desc: "Catalogue, prix, stock, catégorie" },
  { name: "categories", desc: "Catégories produits" },
  { name: "cart", desc: "Paniers actifs par utilisateur" },
  { name: "orders", desc: "Commandes et statuts" },
  { name: "order_items", desc: "Lignes de commande détaillées" },
  { name: "reviews", desc: "Avis et notations produits" },
  { name: "addresses", desc: "Adresses de livraison" },
];

export default function GymovaPage() {
  return (
    <>
      <Head>
        <title>Gymnova Shop — Paul Blanc</title>
        <meta name="description" content="Plateforme e-commerce fullstack React/Node.js pour la vente de matériel de gymnastique professionnel avec paiement Stripe." />
      </Head>

      <main className="min-h-screen" style={{ background: "#0d0d0d", color: "#e5e7eb" }}>

        {/* Back nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4" style={{ background: "rgba(13,13,13,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/">
            <a className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70" style={{ color: "#9ca3af" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Retour au portfolio
            </a>
          </Link>
          <span className="ml-auto text-xs font-mono" style={{ color: "#6b7280" }}>BTS SIO SLAM — 2024</span>
        </nav>

        {/* Hero */}
        <header className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(99,102,241,0.2) 60%, transparent 100%)" }} />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", color: "#818cf8" }}>
              <span>●</span> Projet BTS SIO SLAM
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4" style={{ lineHeight: 1.05 }}>
              Gymnova Shop
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl" style={{ color: "#9ca3af", lineHeight: 1.6 }}>
              Plateforme e-commerce fullstack pour la vente de matériel de gymnastique professionnel — catalogue filtrable, paiement Stripe et back-office admin.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Polochon06/gymnova"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#1e1b4b,#6366f1)", color: "#fff" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                Voir le code source
              </a>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 pb-24 space-y-20">

          {/* Stack technique */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Stack Technique</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-sm font-semibold mb-4" style={{ color: "#818cf8" }}>Frontend</div>
                <div className="flex flex-wrap gap-2">
                  {FRONTEND_STACK.map(({ label, color }) => (
                    <span key={label} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: `${color}1a`, border: `1px solid ${color}33`, color }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-sm font-semibold mb-4" style={{ color: "#34d399" }}>Backend</div>
                <div className="flex flex-wrap gap-2">
                  {BACKEND_STACK.map(({ label, color }) => (
                    <span key={label} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: `${color}1a`, border: `1px solid ${color}33`, color }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Fonctionnalités */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Fonctionnalités</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {FEATURES.map(({ icon, title, desc }) => (
                <div key={title} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-2xl mb-3">{icon}</div>
                  <h3 className="font-semibold mb-2" style={{ color: "#f3f4f6" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* API Endpoints */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>API REST — Endpoints principaux</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-5 py-3" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-sm font-mono" style={{ color: "#9ca3af" }}>Express — {API_ROUTES.length} routes</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {API_ROUTES.map(({ method, path, desc, color }) => (
                  <div key={path} className="flex items-center gap-4 px-5 py-3">
                    <span className="text-xs font-bold font-mono w-16 flex-shrink-0" style={{ color }}>{method}</span>
                    <code className="text-sm font-mono flex-1" style={{ color: "#e5e7eb" }}>{path}</code>
                    <span className="text-xs hidden md:block" style={{ color: "#6b7280" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Base de données */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Schéma de base de données</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-5 py-3" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-sm font-mono" style={{ color: "#9ca3af" }}>MySQL — 8 tables normalisées</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {DB_TABLES.map(({ name, desc }) => (
                  <div key={name} className="flex items-center justify-between px-5 py-4">
                    <code className="text-sm font-mono font-semibold" style={{ color: "#818cf8" }}>{name}</code>
                    <span className="text-sm" style={{ color: "#6b7280" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Sécurité & bonnes pratiques</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { title: "Bcrypt (10 rounds)", desc: "Hashage des mots de passe — aucun mot de passe stocké en clair" },
                { title: "JWT 24h", desc: "Tokens signés côté serveur, vérifiés sur chaque route protégée" },
                { title: "Requêtes préparées", desc: "Prévention des injections SQL via MySQL2 avec paramètres échappés" },
                { title: "CORS configuré", desc: "Origines autorisées explicitement — frontends non-autorisés bloqués" },
                { title: "Stripe mode test", desc: "Aucune donnée de paiement réelle — intégration conforme PCI DSS" },
                { title: "Rôles utilisateurs", desc: "Endpoints admin protégés — middleware vérifie le rôle dans le JWT" },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-xl px-4 py-3 flex items-start gap-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "#6366f1", flexShrink: 0, marginTop: 2 }}>🛡</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#f3f4f6" }}>{title}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Objectifs pédagogiques */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Compétences BTS SIO démontrées</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {[
                "Développement d'une API RESTful complète (20+ endpoints)",
                "Architecture fullstack React / Node.js / MySQL",
                "Authentification et autorisation JWT",
                "Intégration d'un service tiers (Stripe)",
                "Gestion de base de données relationnelle normalisée",
                "Design responsive et expérience utilisateur moderne",
                "Contrôle d'accès par rôle (RBAC client/admin)",
                "Déploiement et gestion de variables d'environnement",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#d1d5db" }}>
                  <span style={{ color: "#6366f1", flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

        </div>
      </main>
    </>
  );
}
