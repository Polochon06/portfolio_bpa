// ===== Treasure Particle System =====
class TreasureParticles {
    constructor() {
        this.particles = [];
        this.emojis = ['💎', '💰', '🏆', '⭐', '✨', '🌟', '💫', '🔱'];
        this.maxParticles = 15;
        this.createContainer();
    }

    createContainer() {
        if (document.getElementById('treasure-particles')) return;

        const container = document.createElement('div');
        container.id = 'treasure-particles';
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
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 3 + 2;

        particle.textContent = emoji;
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${Math.random() * 20 + 20}px;
            pointer-events: none;
            user-select: none;
            animation: treasureFloat ${Math.random() * 1 + 1.5}s ease-out forwards;
            --angle: ${angle};
            --velocity: ${velocity};
        `;

        this.container.appendChild(particle);
        this.particles.push(particle);

        setTimeout(() => {
            particle.remove();
            this.particles = this.particles.filter(p => p !== particle);
        }, 2000);
    }

    burst(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.create(
                    x + (Math.random() - 0.5) * 50,
                    y + (Math.random() - 0.5) * 50
                );
            }, i * 50);
        }
    }
}

// Add particle animations
const treasureStyle = document.createElement('style');
treasureStyle.textContent = `
    @keyframes treasureFloat {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.5) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translate(
                calc(cos(var(--angle)) * var(--velocity) * 100px),
                calc(sin(var(--angle)) * var(--velocity) * -100px)
            ) scale(1) rotate(360deg);
        }
    }

    @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(treasureStyle);

const treasureParticles = new TreasureParticles();

// ===== Navigation =====
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation
const sections = document.querySelectorAll('section[id]');

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

// ===== Treasure Chest Interactions =====
const treasureChests = document.querySelectorAll('.treasure-chest');

treasureChests.forEach(chest => {
    let isOpened = false;

    chest.addEventListener('click', function() {
        if (!isOpened) {
            // Add opened class
            this.classList.add('opened');
            isOpened = true;

            // Create treasure burst
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            treasureParticles.burst(centerX, centerY, 12);

            // Play sound effect (if you want to add one)
            // new Audio('treasure-sound.mp3').play();

            setTimeout(() => {
                this.classList.remove('opened');
                isOpened = false;
            }, 600);
        }
    });

    // Hover effect
    chest.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        treasureParticles.create(
            rect.left + rect.width / 2,
            rect.top + 20
        );
    });
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Create treasure particles on reveal
                const rect = entry.target.getBoundingClientRect();
                if (window.innerWidth > 768) {
                    treasureParticles.create(
                        rect.left + Math.random() * rect.width,
                        rect.top + window.scrollY
                    );
                }
            }, index * 100);
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// ===== Project Cards =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        treasureParticles.burst(
            rect.left + rect.width / 2,
            rect.top + 50,
            4
        );
    });
});

// ===== Project Modal =====
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const detailsButtons = document.querySelectorAll('.btn-details');

const projectDetails = {
    'mt-conges': {
        title: 'MT-Congés - Gestion des Congés',
        content: `
            <div style="padding: 1rem;">
                <h2 style="color: var(--primary); margin-bottom: 2rem; font-size: 2.5rem;">🏆 MT-Congés</h2>

                <div style="background: var(--bg-secondary); padding: 2rem; border-radius: 15px; margin-bottom: 2rem; border-left: 4px solid var(--gold);">
                    <h3 style="color: var(--primary); margin-bottom: 1rem;">📋 Contexte du Projet</h3>
                    <p style="color: var(--text-light); line-height: 1.8;">
                        <strong>Type :</strong> Projet scolaire BTS SIO (3 mois - 2024)<br>
                        <strong>Objectif :</strong> Développer une application complète de gestion des congés avec
                        validation hiérarchique et protection renforcée des données sensibles.
                    </p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 15px; margin-bottom: 2rem; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                    <h3 style="color: var(--primary); margin-bottom: 1.5rem;">💻 Stack Technique</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">Java 17</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Langage de programmation</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">Swing</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Interface graphique</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">MySQL</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Base de données</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">Git</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Contrôle de version</span>
                        </div>
                    </div>
                </div>

                <div style="background: var(--bg-secondary); padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h3 style="color: var(--primary); margin-bottom: 1.5rem;">🏗️ Architecture MVC</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            💎 <strong style="color: var(--primary);">Model :</strong>
                            <span style="color: var(--text-light);">Données (POJO + DAO)</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            💎 <strong style="color: var(--primary);">View :</strong>
                            <span style="color: var(--text-light);">Interface Swing</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            💎 <strong style="color: var(--primary);">Controller :</strong>
                            <span style="color: var(--text-light);">Logique métier</span>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #f4e5c2, #d4af37); padding: 2rem; border-radius: 15px; border: 3px solid var(--gold);">
                    <h3 style="color: var(--primary); margin-bottom: 1.5rem;">🔒 Sécurité & RGPD</h3>
                    <ul style="color: var(--text); line-height: 2;">
                        <li><strong>Anti-injection SQL</strong> : PreparedStatement</li>
                        <li><strong>Cryptage BCrypt</strong> : Mots de passe sécurisés</li>
                        <li><strong>Validation stricte</strong> : Contrôle des entrées</li>
                        <li><strong>Conformité RGPD</strong> : Traçabilité complète</li>
                    </ul>
                </div>
            </div>
        `
    },
    'vfx': {
        title: 'VFX & Création de Contenu',
        content: `
            <div style="padding: 1rem;">
                <h2 style="color: var(--primary); margin-bottom: 2rem; font-size: 2.5rem;">🎬 VFX & Création</h2>

                <div style="background: linear-gradient(135deg, #f4e5c2, #d4af37); padding: 2rem; border-radius: 15px; margin-bottom: 2rem; border: 3px solid var(--gold);">
                    <h3 style="color: var(--primary); margin-bottom: 1rem;">🎬 Contexte</h3>
                    <p style="color: var(--text); line-height: 1.8;">
                        <strong>Type :</strong> Projet personnel - Chaîne YouTube<br>
                        <strong>Focus :</strong> Production complète de contenu vidéo avec workflow professionnel
                        et effets visuels de qualité broadcast.
                    </p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 15px; margin-bottom: 2rem; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                    <h3 style="color: var(--primary); margin-bottom: 1.5rem;">🛠️ Outils Professionnels</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">After Effects</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Compositing & VFX</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">Première Pro</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Montage vidéo</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">Universe</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Transitions avancées</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 10px; border: 2px solid var(--gold);">
                            <strong style="color: var(--primary);">Element 3D</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Rendu 3D</span>
                        </div>
                    </div>
                </div>

                <div style="background: var(--bg-secondary); padding: 2rem; border-radius: 15px; margin-bottom: 2rem;">
                    <h3 style="color: var(--primary); margin-bottom: 1.5rem;">✨ Techniques Maîtrisées</h3>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 0.5rem;">💎 Compositing Multi-calques</h4>
                            <p style="color: var(--text-light); margin: 0;">
                                Assemblage de plusieurs couches vidéo et effets pour créer des compositions complexes
                            </p>
                        </div>
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 0.5rem;">💎 Keying & Rotoscoping</h4>
                            <p style="color: var(--text-light); margin: 0;">
                                Chroma key avancé et découpage précis image par image
                            </p>
                        </div>
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 0.5rem;">💎 Motion Graphics</h4>
                            <p style="color: var(--text-light); margin: 0;">
                                Animations 2D/3D et titres cinématiques professionnels
                            </p>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #f4e5c2, #d4af37); padding: 2rem; border-radius: 15px; border: 3px solid var(--gold);">
                    <h3 style="color: var(--primary); margin-bottom: 1.5rem;">🎯 Pipeline de Production</h3>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: var(--primary);">1. Pré-production 📝</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Scénarisation · Storyboard · Planification</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: var(--primary);">2. Montage ✂️</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Assemblage · Rythme · Multi-caméra</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: var(--primary);">3. VFX & Motion 🎨</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Effets visuels · Compositing · Animations</span>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px;">
                            <strong style="color: var(--primary);">4. Finalisation 🚀</strong><br>
                            <span style="color: var(--text-light); font-size: 0.9rem;">Export · Compression · Distribution</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
};

// Open modal
detailsButtons.forEach(button => {
    button.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        const project = projectDetails[projectId];

        if (project) {
            modalBody.innerHTML = project.content;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';

            // Treasure burst on modal open
            treasureParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 15);
        }
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ===== Contact Items Animation =====
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        treasureParticles.burst(rect.left + rect.width / 2, rect.top, 3);
    });
});

// ===== Buttons Interactions =====
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        const rect = this.getBoundingClientRect();
        treasureParticles.burst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            6
        );
    });
});

// ===== Console Message =====
console.log('%c💎 Portfolio de Paul Blanc 💎', 'font-size: 24px; font-weight: bold; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c🏆 Développeur Full-Stack & Créateur VFX', 'font-size: 16px; color: #1a1a2e; font-weight: bold;');
console.log('%c✨ Site professionnel avec thème "Chasse au Trésor"', 'font-size: 14px; color: #7f8c8d;');
console.log('%c📧 Contact: paul.blc61@gmail.com', 'font-size: 12px; color: #2c3e50;');

// ===== Initialize =====
console.log('%c🎯 Portfolio chargé avec succès!', 'font-size: 12px; color: #27ae60; font-weight: bold;');
