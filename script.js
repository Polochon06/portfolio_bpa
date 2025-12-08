// ===== Gymnast Emoji Particles System =====
class GymnastParticle {
    constructor() {
        this.emojis = ['🤸', '🤸‍♂️', '🏅', '🥇', '🥈', '🥉', '🏆', '⭐'];
        this.particles = [];
        this.maxParticles = 20;
        this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = 'gymnast-particles';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);
        this.container = container;
    }

    create(x, y) {
        if (this.particles.length >= this.maxParticles) return;

        const particle = document.createElement('div');
        const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];

        particle.textContent = emoji;
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 30 + 20}px;
            pointer-events: none;
            user-select: none;
            animation: gymnastFloat ${Math.random() * 2 + 2}s ease-out forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);

        setTimeout(() => {
            particle.remove();
            this.particles = this.particles.filter(p => p !== particle);
        }, 4000);
    }
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes gymnastFloat {
        0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-200px) rotate(720deg) scale(0.5);
        }
    }

    @keyframes gymnastFlip {
        0%, 100% { transform: rotateY(0deg); }
        50% { transform: rotateY(180deg); }
    }

    @keyframes ringPulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.2); opacity: 1; }
    }
`;
document.head.appendChild(style);

const gymnastParticles = new GymnastParticle();

// Create particles on scroll
let lastScrollParticle = 0;
window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollParticle > 500) {
        const x = Math.random() * window.innerWidth;
        const y = window.scrollY + Math.random() * window.innerHeight;
        gymnastParticles.create(x, y);
        lastScrollParticle = now;
    }
});

// ===== Olympic Rings Background Animation =====
function createOlympicRings() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const ringsContainer = document.createElement('div');
    ringsContainer.style.cssText = `
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 0;
        opacity: 0.15;
    `;

    const rings = [
        { color: '#0077be', left: '0', top: '0' },      // Blue
        { color: '#000000', left: '80px', top: '0' },    // Black
        { color: '#e63946', left: '160px', top: '0' },   // Red
        { color: '#ffd700', left: '40px', top: '45px' }, // Yellow/Gold
        { color: '#00a35c', left: '120px', top: '45px' } // Green
    ];

    rings.forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.style.cssText = `
            position: absolute;
            width: 60px;
            height: 60px;
            border: 8px solid ${ring.color};
            border-radius: 50%;
            left: ${ring.left};
            top: ${ring.top};
            animation: ringPulse ${3 + index * 0.5}s ease-in-out infinite;
        `;
        ringsContainer.appendChild(ringDiv);
    });

    hero.insertBefore(ringsContainer, hero.firstChild);
}

// ===== Navigation Scroll Effect with Gymnast Animation =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Enhanced shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.3)';
    } else {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero-content');
    if (hero && currentScroll < window.innerHeight) {
        hero.style.transform = `translateY(${currentScroll * 0.5}px)`;
        hero.style.opacity = 1 - (currentScroll / window.innerHeight);
    }

    lastScroll = currentScroll;
});

// ===== Mobile Navigation Toggle with Animation =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger with flip effect
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';

        // Create particle burst
        const rect = hamburger.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                gymnastParticles.create(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );
            }, i * 100);
        }
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking on a link with particle effect
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';

        // Create particles at click position
        const rect = e.target.getBoundingClientRect();
        gymnastParticles.create(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

// ===== Smooth Scroll with Gymnast Trail =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;

            // Create particle trail during scroll
            let scrollInterval = setInterval(() => {
                gymnastParticles.create(
                    Math.random() * window.innerWidth,
                    window.scrollY + window.innerHeight / 2
                );
            }, 100);

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            setTimeout(() => clearInterval(scrollInterval), 1000);
        }
    });
});

// ===== Active Navigation Link with Medal Effect =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===== Scroll Reveal Animation with Gymnast Flip =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateX(0deg)';

                // Create celebration particles
                const rect = entry.target.getBoundingClientRect();
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        gymnastParticles.create(
                            rect.left + Math.random() * rect.width,
                            rect.top + window.scrollY
                        );
                    }, i * 200);
                }
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all sections with gymnast flip animation
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px) rotateX(-15deg)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

// ===== Skill Cards Interactive Animation =====
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        gymnastParticles.create(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    // 3D tilt effect on mouse move
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ===== Project Cards Animation =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                gymnastParticles.create(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 150);
        }
    });
});

// ===== Education Items Medal Animation =====
document.querySelectorAll('.education-item').forEach((item, index) => {
    item.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        const medals = ['🥇', '🥈', '🥉'];

        // Create specific medal particle
        const particle = document.createElement('div');
        particle.textContent = medals[index] || '🏅';
        particle.style.cssText = `
            position: fixed;
            left: ${rect.right - 50}px;
            top: ${rect.top + 20}px;
            font-size: 50px;
            pointer-events: none;
            z-index: 10000;
            animation: medalSpin 1s ease-out forwards;
        `;
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    });
});

// Medal spin animation
const medalStyle = document.createElement('style');
medalStyle.textContent = `
    @keyframes medalSpin {
        0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(medalStyle);

// ===== Buttons Ripple Effect =====
document.querySelectorAll('.btn, .btn-details').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Create gymnast particles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                gymnastParticles.create(
                    rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
                    rect.top + rect.height / 2 + (Math.random() - 0.5) * 100
                );
            }, i * 80);
        }
    });
});

// Ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% { width: 20px; height: 20px; opacity: 1; }
        100% { width: 300px; height: 300px; opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

// ===== Project Modal with Gymnast Entrance =====
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const detailsButtons = document.querySelectorAll('.btn-details');

// Project details data
const projectDetails = {
    'mt-conges': {
        title: 'MT-Congés - Application de Gestion des Congés',
        content: `
            <div style="padding: 1rem;">
                <h2 style="color: var(--primary); margin-bottom: 1rem;">🏆 Projet MT-Congés</h2>

                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid #ffd700;">
                    <h3 style="color: #1e3a5f; margin-bottom: 0.75rem;">📋 Contexte & Objectif</h3>
                    <p style="color: #64748b; line-height: 1.7;">
                        <strong>Type :</strong> Projet scolaire BTS SIO (3 mois - 2024)<br>
                        Développer une application complète de gestion des congés avec validation hiérarchique
                        (Employé → Responsable → Admin) et protection renforcée des données sensibles.
                    </p>
                </div>

                <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(255,215,0,0.2);">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">💻 Stack Technique</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ffd700;">
                            <strong style="color: #1e3a5f;">Java 17</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Langage de programmation</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ffd700;">
                            <strong style="color: #1e3a5f;">Swing</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Interface graphique bureau</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ffd700;">
                            <strong style="color: #1e3a5f;">MySQL</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Base de données relationnelle</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ffd700;">
                            <strong style="color: #1e3a5f;">Git</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Gestion de versions</span>
                        </div>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">🏗️ Architecture MVC</h3>
                    <p style="color: #64748b; margin-bottom: 1rem; font-style: italic;">
                        Séparation de l'application en 3 couches distinctes pour faciliter la maintenance
                    </p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.5rem; background: white; margin-bottom: 0.5rem; border-radius: 6px;">
                            🥇 <strong style="color: #1e3a5f;">Model :</strong>
                            <span style="color: #64748b;">Données (POJO + DAO)</span>
                        </li>
                        <li style="padding: 0.5rem; background: white; margin-bottom: 0.5rem; border-radius: 6px;">
                            🥈 <strong style="color: #1e3a5f;">View :</strong>
                            <span style="color: #64748b;">Interface utilisateur Swing</span>
                        </li>
                        <li style="padding: 0.5rem; background: white; margin-bottom: 0.5rem; border-radius: 6px;">
                            🥉 <strong style="color: #1e3a5f;">Controller :</strong>
                            <span style="color: #64748b;">Logique métier</span>
                        </li>
                    </ul>
                </div>

                <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(255,215,0,0.15);">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">✨ Fonctionnalités Clés</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <h4 style="color: #ffd700; margin-bottom: 0.5rem;">🔐 Authentification sécurisée</h4>
                            <p style="color: #64748b; margin: 0;">
                                Login sécurisé · Blocage après 3 tentatives · Réinitialisation mot de passe
                            </p>
                        </div>
                        <div>
                            <h4 style="color: #ffd700; margin-bottom: 0.5rem;">👥 Gestion multi-niveaux</h4>
                            <p style="color: #64748b; margin: 0;">
                                <strong>Admin</strong> : Gestion complète ·
                                <strong>Responsable</strong> : Validation équipe ·
                                <strong>Employé</strong> : Demandes congés
                            </p>
                        </div>
                        <div>
                            <h4 style="color: #ffd700; margin-bottom: 0.5rem;">📋 Cycle de validation</h4>
                            <p style="color: #64748b; margin: 0;">
                                Demande → Approbation manager → Historique · Notifications en temps réel
                            </p>
                        </div>
                        <div>
                            <h4 style="color: #ffd700; margin-bottom: 0.5rem;">📊 Traçabilité RGPD</h4>
                            <p style="color: #64748b; margin: 0;">
                                Journalisation des actions · Protection données personnelles dès la conception
                            </p>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #fff4ed, #ffe8d6); padding: 1.5rem; border-radius: 12px; border: 3px solid #ffd700;">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">🔒 Mesures de Sécurité</h3>
                    <ul style="color: #64748b; line-height: 1.8;">
                        <li><strong>Anti-injection SQL</strong> : Utilisation de PreparedStatement pour prévenir les attaques</li>
                        <li><strong>Cryptage BCrypt</strong> : Algorithme de hachage unidirectionnel pour les mots de passe</li>
                        <li><strong>Validation des saisies</strong> : Contrôle strict de toutes les entrées utilisateur</li>
                        <li><strong>RGPD</strong> : Conformité avec le règlement européen de protection des données</li>
                    </ul>
                </div>
            </div>
        `
    },
    'vfx': {
        title: 'VFX & Création de Contenu',
        content: `
            <div style="padding: 1rem;">
                <h2 style="color: #ff6b35; margin-bottom: 1rem;">🎬 VFX & Création de Contenu</h2>

                <div style="background: linear-gradient(135deg, #fff4ed, #ffe8d6); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border: 3px solid #ff6b35;">
                    <h3 style="color: #1e3a5f; margin-bottom: 0.75rem;">🎬 Contexte</h3>
                    <p style="color: #64748b; line-height: 1.7;">
                        <strong>Type :</strong> Projet personnel - Chaîne YouTube<br>
                        Production complète de contenu vidéo avec workflow professionnel de post-production
                        et effets visuels avancés de qualité broadcast.
                    </p>
                </div>

                <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(255,107,53,0.2);">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">🛠️ Outils & Plugins Professionnels</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ff6b35;">
                            <strong style="color: #ff6b35;">After Effects</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Compositing & VFX</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ff6b35;">
                            <strong style="color: #ff6b35;">Première Pro</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Montage vidéo</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ff6b35;">
                            <strong style="color: #ff6b35;">Universe</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Transitions avancées</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ff6b35;">
                            <strong style="color: #ff6b35;">Element 3D</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Rendu 3D dans AE</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ff6b35;">
                            <strong style="color: #ff6b35;">Topaz</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Upscaling & amélioration</span>
                        </div>
                        <div style="background: linear-gradient(135deg, #f8fafc, #fff); padding: 1rem; border-radius: 8px; border: 2px solid #ff6b35;">
                            <strong style="color: #ff6b35;">Optical Flares</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Effets lumineux</span>
                        </div>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">🎨 VFX Breakdown</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.75rem; background: white; margin-bottom: 0.75rem; border-radius: 8px; border-left: 3px solid #ff6b35;">
                            🥇 <strong style="color: #ff6b35;">Compositing multi-calques</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">
                                Assemblage de plusieurs couches vidéo, effets et animations pour créer une composition finale
                            </span>
                        </li>
                        <li style="padding: 0.75rem; background: white; margin-bottom: 0.75rem; border-radius: 8px; border-left: 3px solid #ff6b35;">
                            🥈 <strong style="color: #ff6b35;">Keying & Rotoscoping</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">
                                Chroma key avancé, découpage précis image par image, et refinement des contours
                            </span>
                        </li>
                        <li style="padding: 0.75rem; background: white; border-radius: 8px; border-left: 3px solid #ff6b35;">
                            🥉 <strong style="color: #ff6b35;">Particle Systems</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">
                                Systèmes de particules pour effets dynamiques (fumée, pluie, étincelles, etc.)
                            </span>
                        </li>
                    </ul>
                </div>

                <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(255,107,53,0.15);">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">✨ Techniques de Compositing</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <h4 style="color: #ff6b35; margin-bottom: 0.5rem;">🎬 Keying & Masking</h4>
                            <p style="color: #64748b; margin: 0;">
                                Chroma key professionnel · Roto-masques précis · Edge refinement · Spill suppression
                            </p>
                        </div>
                        <div>
                            <h4 style="color: #ff6b35; margin-bottom: 0.5rem;">🎨 Color Correction</h4>
                            <p style="color: #64748b; margin: 0;">
                                Application de LUTs · Courbes RVB · Match color entre calques · Grading cinématique
                            </p>
                        </div>
                        <div>
                            <h4 style="color: #ff6b35; margin-bottom: 0.5rem;">🌟 Motion Graphics</h4>
                            <p style="color: #64748b; margin: 0;">
                                Lower thirds animés · Titres cinématiques · Transitions personnalisées · Logo animations
                            </p>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #fff4ed, #ffe8d6); padding: 1.5rem; border-radius: 12px; border: 3px solid #ff6b35;">
                    <h3 style="color: #1e3a5f; margin-bottom: 1rem;">🎯 Pipeline de Production</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: #ff6b35;">1. Pré-production 🎬</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Scénarisation · Storyboard · Planification</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: #ff6b35;">2. Montage - Première Pro ✂️</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Assemblage · Rythme · Montage multi-caméra</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: #ff6b35;">3. VFX - After Effects 🎨</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Effets visuels · Compositing · Motion design</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: #ff6b35;">4. Finalisation & Distribution 🚀</strong><br>
                            <span style="color: #64748b; font-size: 0.9rem;">Export optimisé · Compression · Upload YouTube</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
};

// Open modal with gymnast entrance
detailsButtons.forEach(button => {
    button.addEventListener('click', () => {
        const projectId = button.getAttribute('data-project');
        const project = projectDetails[projectId];

        if (project) {
            modalBody.innerHTML = project.content;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Create celebration particles
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    gymnastParticles.create(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight + window.scrollY
                    );
                }, i * 100);
            }
        }
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ===== Contact Icons Bounce Animation =====
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contact-icon');
        icon.style.animation = 'none';
        setTimeout(() => {
            icon.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);

        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                gymnastParticles.create(rect.left + rect.width / 2, rect.top);
            }, i * 100);
        }
    });
});

// ===== Hero Title Gymnast Animation =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    // Add bouncing letters effect on load
    const letters = heroTitle.textContent.split('');
    heroTitle.innerHTML = '';

    letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.display = 'inline-block';
        span.style.animation = `letterBounce 0.5s ease-out ${index * 0.05}s both`;
        heroTitle.appendChild(span);
    });
}

// Letter bounce animation
const letterStyle = document.createElement('style');
letterStyle.textContent = `
    @keyframes letterBounce {
        0% { transform: translateY(-100px) rotateZ(-180deg); opacity: 0; }
        50% { transform: translateY(10px) rotateZ(0deg); }
        100% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
    }
`;
document.head.appendChild(letterStyle);

// ===== Initialize Olympic Rings =====
createOlympicRings();

// ===== Cursor Trail Effect (Optional) =====
let cursorTrailEnabled = false;
document.addEventListener('keydown', (e) => {
    if (e.key === 'g' || e.key === 'G') {
        cursorTrailEnabled = !cursorTrailEnabled;
    }
});

document.addEventListener('mousemove', (e) => {
    if (cursorTrailEnabled && Math.random() > 0.9) {
        gymnastParticles.create(e.clientX, e.clientY + window.scrollY);
    }
});

// ===== Console Message with Gymnastics Theme =====
console.log('%c🤸 Portfolio de Paul Blanc - Thème Gymnastique! 🏅', 'font-size: 24px; font-weight: bold; color: #ffd700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c🥇 Champion du Code & VFX', 'font-size: 16px; color: #ff6b35; font-weight: bold;');
console.log('%c🏆 Développé avec passion et acrobatie digitale', 'font-size: 14px; color: #0077be;');
console.log('%c📧 Contact: paul.blc61@gmail.com', 'font-size: 12px; color: #64748b;');
console.log('%c💡 Astuce: Appuyez sur "G" pour activer/désactiver les particules au survol!', 'font-size: 12px; color: #34a853; font-style: italic;');

// ===== Performance Monitor (Development) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%c⚡ Mode Développement Activé', 'font-size: 12px; color: #e63946; font-weight: bold;');
}
