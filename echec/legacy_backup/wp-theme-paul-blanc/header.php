<!DOCTYPE html>
<html <?php language_attributes(); ?> class="lenis-smooth">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

    <!-- Geometric Background Elements -->
    <div class="geo-shapes">
        <div class="shape-circle"></div>
        <div class="shape-line"></div>
        <div class="shape-asterisk">✻</div>
    </div>

    <!-- Noise -->
    <div class="noise"></div>

    <!-- Nav -->
    <nav class="nav">
        <div class="nav-container">
            <div class="nav-left">
                <a href="<?php echo home_url(); ?>" class="nav-logo"><?php bloginfo('name'); ?><span class="copyright">©24</span></a>
            </div>
            <div class="nav-right">
                <div class="nav-links">
                    <a href="#about" class="nav-link">Profil</a>
                    <a href="#work" class="nav-link">Travaux</a>
                    <a href="#contact" class="nav-link">Contact</a>
                </div>
            </div>
        </div>
    </nav>
    <main>
