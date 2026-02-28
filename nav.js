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
    const message = document.getElementById('message').value.trim();

    if (!name || !email) return;

    const btn = document.getElementById('submit-btn');
    btn.classList.add('loading');
    btn.innerHTML = '<span class="spinner"></span>Submitting…';

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2LGLaNd6UzsxZdLo4ikZMvCsv_exMuaRka-VcGQTNeCazBozrZTWXWCwuMC5MrT4CBQ/exec";

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    // sheet_name is optional — defaults to 'Sheet1' in the script
    formData.append('sheet_name', 'Sheet1');

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',  // required for Apps Script
            body: formData    // FormData matches e.parameter in doPost
        });
        console.log('Submitted!');
        document.getElementById('contact-form-wrap').style.display = 'none';
        document.getElementById('form-success').classList.add('show');
    } catch (error) {
        console.error('Error!', error.message);
        alert('Something went wrong. Please try again.');
    }
}

// Run nav highlight as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', setActiveNav);