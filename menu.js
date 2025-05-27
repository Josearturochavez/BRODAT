document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const drawerMenu = document.getElementById('drawer-menu');
    let menuOpen = false;

    function toggleMenu() {
        menuOpen = !menuOpen;
        drawerMenu.classList.toggle('open', menuOpen);
        document.body.classList.toggle('drawer-open', menuOpen);
        menuButton.innerHTML = menuOpen ? '&times;' : '&#9776;';
        menuButton.setAttribute('aria-label', menuOpen ? 'Cerrar menú' : 'Abrir menú');
    }

    menuButton.addEventListener('click', toggleMenu);

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
});