<?php get_header(); ?>

    <!-- Hero with 'Weird' Typography -->
    <section class="hero" data-scroll-section>
        <div class="container relative">
            <div class="big-geo-char" data-speed="0.2">A</div>
            
            <h1 class="hero-title">
                <div class="line"><span class="word">Creative</span></div>
                <div class="line"><span class="word indent">Developer</span></div>
                <div class="line"><span class="word outline">& Visual</span></div>
                <div class="line"><span class="word italic">Designer</span></div>
            </h1>
            
            <div class="hero-footer">
                <div class="rotated-badge">
                    <span>Available for work</span>
                </div>
                <div class="hero-details">
                    <div class="detail-block">
                        <span class="label">Location</span>
                        <span class="value">Paris, FR</span>
                    </div>
                    <div class="detail-block">
                        <span class="label">Specialty</span>
                        <span class="value">Full-Stack / VFX</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About with Geometric Grid -->
    <section id="about" class="about" data-scroll-section>
        <div class="container">
            <div class="grid-layout">
                <div class="col-label">
                    <span class="section-number">01</span>
                </div>
                <div class="col-content">
                    <div class="big-statement">
                        Je sculpte le <span class="txt-it">code</span> et l'image pour créer des expériences <span class="txt-outline">d'impact</span>.
                    </div>
                    
                    <div class="geometric-separator"></div>

                    <div class="specs-grid">
                        <div class="spec-card">
                            <h3>Tech_Stack</h3>
                            <p>Java 17, Swing, MySQL</p>
                            <p>MVC Pattern, Git</p>
                            <div class="geo-icon">●</div>
                        </div>
                        <div class="spec-card">
                            <h3>Visual_Arts</h3>
                            <p>After Effects, Premiere</p>
                            <p>Element 3D, Motion</p>
                            <div class="geo-icon">■</div>
                        </div>
                        <div class="spec-card">
                            <h3>Formation</h3>
                            <p>BTS SIO (En cours)</p>
                            <p>Bac STI2D</p>
                            <div class="geo-icon">▲</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Work with Offset Layout -->
    <section id="work" class="work" data-scroll-section>
        <div class="container">
            <div class="grid-layout">
                <div class="col-label">
                    <span class="section-number">02</span>
                </div>
                <div class="work-list">
                    
                    <!-- Project 1 -->
                    <div class="project-item" data-img="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop">
                        <div class="project-header">
                            <span class="p-num">001</span>
                            <h2 class="p-title">MT-Congés</h2>
                        </div>
                        <div class="project-cats">
                            <span>Java</span>
                            <span>Swing</span>
                        </div>
                        <div class="project-geo-shape"></div>
                        
                        <!-- Hidden Data -->
                        <div class="hidden-data" style="display:none;">
                            <div class="data-title">MT-Congés</div>
                            <div class="data-tech">Desktop App • Java MVC</div>
                            <div class="data-desc">
                                <p>Application de gestion RH robuste. Architecture MVC stricte.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Project 2 -->
                    <div class="project-item offset" data-img="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop">
                        <div class="project-header">
                            <span class="p-num">002</span>
                            <h2 class="p-title">VFX_Lab</h2>
                        </div>
                        <div class="project-cats">
                            <span>Motion</span>
                            <span>3D</span>
                        </div>
                        <div class="project-geo-shape square"></div>

                        <!-- Hidden Data -->
                        <div class="hidden-data" style="display:none;">
                            <div class="data-title">VFX Lab</div>
                            <div class="data-tech">Motion Design • After Effects</div>
                            <div class="data-desc">
                                <p>Expérimentations visuelles et production de contenu.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="contact" data-scroll-section>
        <div class="container">
            <div class="marquee-container">
                <div class="marquee-text">Let's talk — Contact Me — Let's talk — Contact Me —</div>
            </div>
            
            <div class="contact-center">
                <a href="mailto:paul.blc61@gmail.com" class="big-mail">paul.blc61<br>@gmail.com</a>
            </div>
            
            <div class="footer-geo">
                <div class="f-line"></div>
                <div class="f-info">
                    <span>Paul Blanc ©2025</span>
                    <span>Full-Stack/VFX</span>
                </div>
            </div>
        </div>
    </section>

<?php get_footer(); ?>
