// faq-accordion.js
// Script para el acordeón de preguntas frecuentes

document.addEventListener('DOMContentLoaded', function() {
    var acc = document.querySelectorAll('.faq-accordion-btn');
    acc.forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                document.querySelectorAll('.faq-accordion-panel').forEach(function(p) { p.style.maxHeight = null; });
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });
    });
});
