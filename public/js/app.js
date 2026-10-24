// Small browser enhancements only. Validation, searching and API calls live in Laravel.
const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('#primary-navigation');
menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(expanded));
    menuButton.textContent = expanded ? 'Aizvērt' : 'Izvēlne';
    navigation.classList.toggle('is-open', expanded);
});

document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
        const button = form.querySelector('[data-loading-text]');
        if (button && form.checkValidity()) {
            button.dataset.originalText = button.textContent;
            button.disabled = true;
            button.textContent = button.dataset.loadingText;
            form.setAttribute('aria-busy', 'true');
        }
    });
});

// Browsers can restore a previous page from memory; restore its submit buttons too.
window.addEventListener('pageshow', () => {
    document.querySelectorAll('[data-original-text]').forEach(button => {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
        button.closest('form').removeAttribute('aria-busy');
    });
});
