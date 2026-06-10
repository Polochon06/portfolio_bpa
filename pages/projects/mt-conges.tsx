import Head from "next/head";
import Link from "next/link";

const STACK = [
  { label: "Java 17", color: "#f89820" },
  { label: "JavaFX / Swing", color: "#5382a1" },
  { label: "Maven", color: "#c71a36" },
  { label: "MySQL", color: "#00758f" },
  { label: "JDBC", color: "#5382a1" },
  { label: "Bcrypt", color: "#6366f1" },
  { label: "MVC", color: "#10b981" },
  { label: "Git", color: "#f05032" },
];

const FEATURES = [
  {
    icon: "🔐",
    title: "Authentification RBAC",
    desc: "Quatre niveaux d'accès : Super-Admin, Admin, Manager, Employé. Chaque rôle dispose de permissions distinctes sur les demandes, les utilisateurs et les projets.",
  },
  {
    icon: "📋",
    title: "Gestion des demandes de congés",
    desc: "Workflow de validation multi-niveaux : l'employé soumet une demande, le manager valide ou refuse, l'admin supervise l'ensemble. Statuts : En attente, Validée, Refusée.",
  },
  {
    icon: "👥",
    title: "Gestion des utilisateurs",
    desc: "CRUD complet sur les comptes employés. Suivi des soldes de congés (jours restants / annuels), assignation aux projets, gestion des rôles.",
  },
  {
    icon: "📁",
    title: "Gestion de projets",
    desc: "Suivi des projets d'entreprise (ex : CNP, Cyber). Association employés/projets avec désignation de responsable de projet.",
  },
  {
    icon: "🔔",
    title: "Système de notifications",
    desc: "Alertes internes pour les nouvelles demandes, validations et événements. Gestion des statuts lu/non-lu par utilisateur.",
  },
  {
    icon: "📅",
    title: "Événements d'entreprise",
    desc: "Calendrier partagé des événements impactant la planification des congés. Visibilité globale pour les managers et admins.",
  },
];

const DB_TABLES = [
  { name: "utilisateur", desc: "Comptes, rôles, soldes de congés" },
  { name: "demandeconge", desc: "Demandes avec statut et période" },
  { name: "projet", desc: "Projets d'entreprise" },
  { name: "projet_utilisateur", desc: "Affectations et responsables" },
  { name: "role", desc: "4 niveaux de permission" },
  { name: "notification", desc: "Alertes lu/non-lu" },
  { name: "evenement", desc: "Événements planifiés" },
];

export default function MTCongesPage() {
  return (
    <>
      <Head>
        <title>MT-Congés — Paul Blanc</title>
        <meta name="description" content="Application Java de gestion des congés avec RBAC multi-rôles, workflow de validation et base de données MySQL." />
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
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(123,45,0,0.4) 0%, rgba(255,95,63,0.15) 60%, transparent 100%)" }} />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,95,63,0.12) 0%, transparent 70%)" }} />
          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(255,95,63,0.15)", border: "1px solid rgba(255,95,63,0.3)", color: "#ff5f3f" }}>
              <span>●</span> Projet BTS SIO SLAM
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4" style={{ lineHeight: 1.05 }}>
              MT-Congés
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl" style={{ color: "#9ca3af", lineHeight: 1.6 }}>
              Application desktop Java de gestion des ressources humaines — suivi des congés, validation multi-niveaux et contrôle d&rsquo;accès par rôles.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Polochon06/mt-conges"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7b2d00,#ff5f3f)", color: "#fff" }}
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
            <div className="flex flex-wrap gap-3">
              {STACK.map(({ label, color }) => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
                >
                  {label}
                </span>
              ))}
            </div>
          </section>

          {/* Architecture */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Architecture</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { layer: "Model", items: ["Entités Java (POJO)", "DAO / Repository", "Connexion JDBC", "Schéma MySQL"], color: "#f89820" },
                { layer: "View", items: ["Interfaces JavaFX/Swing", "Formulaires de demande", "Tableaux de bord", "Icônes personnalisées"], color: "#ff5f3f" },
                { layer: "Controller", items: ["Logique métier", "Validation des données", "Gestion des rôles RBAC", "Notifications"], color: "#10b981" },
              ].map(({ layer, items, color }) => (
                <div key={layer} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-lg font-bold mb-3" style={{ color }}>{layer}</div>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="text-sm flex items-start gap-2" style={{ color: "#9ca3af" }}>
                        <span style={{ color, marginTop: 2 }}>›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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

          {/* Base de données */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Schéma de base de données</h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-5 py-3" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-sm font-mono" style={{ color: "#9ca3af" }}>MySQL — 7 tables</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {DB_TABLES.map(({ name, desc }) => (
                  <div key={name} className="flex items-center justify-between px-5 py-4">
                    <code className="text-sm font-mono font-semibold" style={{ color: "#ff5f3f" }}>{name}</code>
                    <span className="text-sm" style={{ color: "#6b7280" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Rôles */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Hiérarchie des rôles</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { role: "Super-Admin", perms: "Accès total + paramétrage système", level: 4 },
                { role: "Admin", perms: "Gestion des utilisateurs et projets", level: 3 },
                { role: "Manager", perms: "Validation des demandes d'équipe", level: 2 },
                { role: "Employé", perms: "Soumission et suivi de demandes", level: 1 },
              ].map(({ role, perms, level }) => (
                <div key={role} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>Niveau {level}</div>
                  <div className="font-bold mb-2" style={{ color: "#f3f4f6" }}>{role}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>{perms}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Objectifs pédagogiques */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>Compétences BTS SIO démontrées</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {[
                "Conception d'une base de données relationnelle normalisée",
                "Architecture MVC en langage orienté objet (Java)",
                "Gestion des accès et authentification RBAC",
                "Conception d'interfaces utilisateur desktop",
                "Requêtes SQL avancées avec jointures multiples",
                "Hashage des mots de passe et sécurité des données",
                "Gestion de version avec Git",
                "Documentation technique et fonctionnelle",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#d1d5db" }}>
                  <span style={{ color: "#ff5f3f", flexShrink: 0 }}>✓</span>
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
