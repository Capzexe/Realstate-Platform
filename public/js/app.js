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

// Keep native browser validation, but explain its errors in the interface language.
document.querySelectorAll('[data-validate-form]').forEach(form => {
    const fields = [...form.querySelectorAll('input:not([type="hidden"]), textarea')];
    const clearError = field => {
        field.setCustomValidity('');
        document.getElementById(`${field.id}-error`)?.remove();
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    };
    fields.forEach(field => {
        field.addEventListener('input', () => clearError(field));
        field.addEventListener('invalid', () => {
            // Clear a previous custom message before reading the native validity flags.
            field.setCustomValidity('');
            const label = field.labels?.[0]?.textContent.trim() || 'Šis lauks';
            let message = 'Lūdzu, pārbaudiet ievadīto vērtību.';
            if (field.validity.valueMissing) message = `Lūdzu, aizpildiet lauku “${label}”.`;
            else if (field.validity.typeMismatch) message = 'Lūdzu, ievadiet derīgu e-pasta adresi.';
            else if (field.validity.tooShort) message = `Ievadiet vismaz ${field.minLength} rakstzīmes.`;
            else if (field.validity.tooLong) message = `Ievadiet ne vairāk kā ${field.maxLength} rakstzīmes.`;
            field.setCustomValidity(message);
            let error = document.getElementById(`${field.id}-error`);
            if (!error) {
                error = document.createElement('p');
                error.id = `${field.id}-error`;
                error.className = 'field-error';
                if (form.classList.contains('search-form')) form.after(error);
                else field.after(error);
            }
            error.textContent = message;
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', error.id);
        });
    });
});
document.querySelector('[data-validate-form] [aria-invalid="true"]')?.focus();

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

// This animation describes a LOCAL test flow, not real Stripe or bank activity.
// The report stays locked until the final CSRF-protected POST is authorized by Laravel.
const paymentProgress = document.querySelector('[data-payment-progress]');
if (paymentProgress) {
    const steps = [...paymentProgress.querySelectorAll('[data-payment-step]')];
    const status = paymentProgress.querySelector('[data-payment-status]');
    const form = paymentProgress.querySelector('[data-payment-confirm]');
    const fallback = paymentProgress.querySelector('[data-payment-fallback]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer;
    let submitted = false;

    const confirm = () => {
        if (submitted) return;
        submitted = true;
        clearTimeout(timer);
        status.textContent = 'Apstiprinām testa rezultātu serverī…';
        fallback.hidden = false;
        form.requestSubmit();
    };
    form.addEventListener('submit', () => {
        submitted = true;
        clearTimeout(timer);
    });
    const advance = index => {
        steps.forEach((step, stepIndex) => {
            step.classList.toggle('is-complete', stepIndex < index);
            if (stepIndex === index) step.setAttribute('aria-current', 'step');
            else step.removeAttribute('aria-current');
        });
        status.textContent = steps[index].querySelector('span').textContent + '…';
        timer = window.setTimeout(() => index + 1 < steps.length ? advance(index + 1) : confirm(), reducedMotion ? 250 : 1100);
    };
    fallback.hidden = true;
    // On phones the order summary comes first; move focus to the new processing
    // screen so the short sequence is visible instead of running below the fold.
    paymentProgress.querySelector('h2').focus();
    advance(0);
    // Cancel scheduled submission when the visitor navigates away or uses Back.
    window.addEventListener('pagehide', () => clearTimeout(timer), { once: true });
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            fallback.hidden = false;
            status.textContent = 'Turpiniet, lai apstiprinātu testa rezultātu.';
        }
    });
}
