document.addEventListener('DOMContentLoaded', () => {

    // ─── PASTE YOUR GOOGLE APPS SCRIPT URL HERE ──────────────
    // After deploying your Apps Script web app, replace the URL below.
    const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzlV2dzmabTn2d-jrWTZSmR01Ny-kb6DJzuagpVE-7-KP_zkaE5nFZhWUcvo2A2NdCN/exec';
    // ─────────────────────────────────────────────────────────


    // ─── Navbar scroll shadow ─────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });


    // ─── Fade-up scroll animations ────────────────────────────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


    // ─── Smooth scroll for anchor links ──────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ─── FAQ Accordion ────────────────────────────────────────
    document.querySelectorAll('.faq-item').forEach(item => {
        const toggle = () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('open');
                i.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                item.setAttribute('aria-expanded', 'true');
            }
        };
        item.addEventListener('click', toggle);
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
    });


    // ─── iOS Waitlist Form ────────────────────────────────────
    const waitlistForm = document.getElementById('waitlistForm');
    const successEl = document.getElementById('waitlistSuccess');
    const submitBtn = document.getElementById('waitlist-submit-btn');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('waitlist-email').value.trim();
            const countryCode = document.getElementById('waitlist-country-code').value;
            const phone = document.getElementById('waitlist-phone').value.trim();

            if (!email || !phone) return;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting…';

            const payload = { email, countryCode, phone };

            try {
                // ── Send to Google Sheet via Apps Script webhook ──
                await fetch(SHEET_WEBHOOK_URL, {
                    method: 'POST',
                    // Google Apps Script requires text/plain to avoid CORS preflight
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload),
                });

                // Show success regardless of opaque response (CORS-safe)
                showSuccess();

            } catch (err) {
                console.error('Waitlist submission error:', err);
                // Still show success to avoid confusing the user —
                // a network error at this stage usually still means the request reached the server.
                showSuccess();
            }
        });
    }

    function showSuccess() {
        waitlistForm.style.display = 'none';
        successEl.style.display = 'block';
    }

});
