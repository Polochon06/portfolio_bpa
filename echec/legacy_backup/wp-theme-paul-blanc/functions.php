<?php
function paulblanc_enqueue_scripts() {
    // Styles
    wp_enqueue_style('paulblanc-style', get_stylesheet_uri());

    // Scripts (GSAP & Lenis via CDN as in original project)
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), '3.12.2', true);
    wp_enqueue_script('gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), '3.12.2', true);
    wp_enqueue_script('lenis', 'https://unpkg.com/@studio-freight/lenis@1.0.29/dist/lenis.min.js', array(), '1.0.29', true);

    // Main Theme Script
    wp_enqueue_script('paulblanc-script', get_template_directory_uri() . '/assets/js/script.js', array('gsap', 'lenis'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'paulblanc_enqueue_scripts');

function paulblanc_setup() {
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'paulblanc_setup');
?>
