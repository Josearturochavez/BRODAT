function includeHTML(id, url) {
    fetch(url)
        .then(res => res.text())
        .then(html => document.getElementById(id).innerHTML = html)
        .then(() => {
            // Si tienes scripts que dependen del header/footer, inicialízalos aquí
            if (id === 'header-placeholder') {
                menuInit(); // Call menuInit only after header is loaded
            }
        });
}

includeHTML('header-placeholder', '/header.html');
includeHTML('footer-placeholder', '/footer.html');

function menuInit() {
    const menuButton = document.getElementById('menu-button');
    const drawerMenu = document.getElementById('drawer-menu');

    // Check if menuButton and drawerMenu exist before proceeding
    if (!menuButton || !drawerMenu) {
        console.warn('menuButton or drawerMenu not found in the DOM');
        return; // Exit the function if elements are not found
    }

    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
        drawerMenu.classList.toggle('open', menuOpen);
        document.body.classList.toggle('drawer-open', menuOpen);
        menuButton.innerHTML = menuOpen ? '&times;' : '&#9776;';
        menuButton.setAttribute('aria-label', menuOpen ? 'Cerrar menú' : 'Abrir menú');
    }

    menuButton.addEventListener('click', toggleMenu);

    // Animación de los statement-bloque
    const bloques = document.querySelectorAll('.statement-bloque');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    bloques.forEach(bloque => observer.observe(bloque));
}
