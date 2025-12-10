document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    /* -------------------------------------------------------------------------- */
    /*                                SMOOTH SCROLL                               */
    /* -------------------------------------------------------------------------- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* -------------------------------------------------------------------------- */
    /*                                HERO REVEAL                                 */
    /* -------------------------------------------------------------------------- */
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
        .from('.hero-title .word', {
            y: '110%',
            duration: 1.5,
            stagger: 0.1,
            ease: 'power4.out'
        })
        .from('.hero-footer', {
            opacity: 0,
            y: 20,
            duration: 1
        }, '-=1');

    /* -------------------------------------------------------------------------- */
    /*                             PROJECT HOVER PREVIEW                          */
    /* -------------------------------------------------------------------------- */
    const projectItems = document.querySelectorAll('.project-item');
    const preview = document.querySelector('.hover-preview');
    const previewInner = document.querySelector('.hover-preview-inner');

    let mouse = { x: 0, y: 0 };
    let cursorPos = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Inertial follow just for the image preview (not custom cursor)
    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.1, gsap.ticker.deltaRatio());

        cursorPos.x += (mouse.x - cursorPos.x) * dt;
        cursorPos.y += (mouse.y - cursorPos.y) * dt;

        if (document.body.classList.contains('is-hovering-project')) {
            gsap.set(preview, {
                x: cursorPos.x,
                y: cursorPos.y
            });
        }
    });

    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgUrl = item.dataset.img;
            previewInner.style.backgroundImage = `url(${imgUrl})`;

            document.body.classList.add('is-hovering-project');
            gsap.to(preview, { opacity: 1, scale: 1, duration: 0.3 });
        });

        item.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-hovering-project');
            gsap.to(preview, { opacity: 0, scale: 0.8, duration: 0.2 });
        });

        // Modal Click
        item.addEventListener('click', () => {
            const hiddenData = item.querySelector('.hidden-data');
            const title = hiddenData.querySelector('.data-title').innerText;
            const tech = hiddenData.querySelector('.data-tech').innerText;
            const desc = hiddenData.querySelector('.data-desc').innerHTML;

            openModal(title, tech, desc);
        });
    });

    /* -------------------------------------------------------------------------- */
    /*                                   MODAL                                    */
    /* -------------------------------------------------------------------------- */
    const modal = document.querySelector('.project-modal');
    const modalTitle = document.querySelector('.modal-title');
    const modalGrid = document.querySelector('.modal-grid');
    const modalClose = document.querySelector('.modal-close');
    const modalContainer = document.querySelector('.modal-container');

    function openModal(title, tech, desc) {
        modalTitle.innerText = title;
        modalGrid.innerHTML = `
            <div class="modal-col">
                <h4 style="margin-bottom:1rem; opacity:0.6; font-size:12px; text-transform:uppercase;">Stack</h4>
                <p style="font-size:1.2rem; margin-bottom:2rem;">${tech}</p>
            </div>
            <div class="modal-col">
                ${desc}
            </div>
        `;

        modal.classList.add('active');
        lenis.stop(); // Stop scroll
    }

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        lenis.start();
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            lenis.start();
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                               SCROLL TRIGGER                               */
    /* -------------------------------------------------------------------------- */
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%'
            },
            y: 20,
            opacity: 0,
            duration: 0.5
        });
    });

});
