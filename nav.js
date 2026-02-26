/* ══════════════════════════════════════════════
   nav.js — Overpick shared JavaScript
   ══════════════════════════════════════════════ */

/**
 * Highlights the correct nav tab based on the current HTML file.
 * Called on DOMContentLoaded in each page.
 */
function setActiveNav() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);

    // Map filename → which tab index should be active
    const tabMap = {
        'index.html': 0,
        '':           0,   // root URL / served as directory index
        'blog.html':  1,
        'contact.html': 2
    };

    const tabs = document.querySelectorAll('.nav-tab');
    const activeIndex = tabMap[filename] !== undefined ? tabMap[filename] : 0;

    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === activeIndex);
    });
}

/**
 * Expands / collapses a blog post on click.
 * @param {HTMLElement} el - The .blog-post article element
 */
function togglePost(el) {
    const body = el.querySelector('.post-body');
    const isOpen = body.classList.contains('open');

    // Collapse all posts first
    document.querySelectorAll('.post-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.blog-post').forEach(p => p.classList.remove('expanded'));

    // If the clicked post was not already open, open it
    if (!isOpen) {
        body.classList.add('open');
        el.classList.add('expanded');
    }
}

/**
 * Handles the contact form submission.
 * Hides the form and shows the success message.
 * @param {Event} e - The form submit event
 */
async function handleSubmit(e) {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const comment = document.getElementById('message').value.trim(); // optional

    if (!name || !email) return;

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdpMkaLrnvQwCLqyM0dfhjyePfximYiuAcdb-ZCarVCV3JOCu5Na1dn9EGAm_20PJbgA/exec";

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, comment }),
        });
    } catch (err) {
        console.error("Form submission failed:", err);
    }

    document.getElementById('contact-form-wrap').style.display = 'none';
    document.getElementById('form-success').classList.add('show');
}

// Run nav highlight as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', setActiveNav);