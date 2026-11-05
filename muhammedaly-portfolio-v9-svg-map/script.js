// V3: One script for Home, Work, About, and Contact.
// Page identity is read from <body data-page="...">.
const currentPage = document.body.dataset.page;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Highlight the actual page (not a scroll section).
document.querySelectorAll('.site-header nav a').forEach(link => {
  if (link.dataset.page === currentPage) link.setAttribute('aria-current', 'page');
});

// Fade sections up as they enter the viewport.
const revealItems = document.querySelectorAll('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, self) => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      self.unobserve(entry.target);
    }
  }, { threshold: 0.06 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Home-only cinematic intro. Reload Home to see it again.
const intro = document.getElementById('intro');
let stopIntro = () => {};
if (intro) {
  const fill = document.getElementById('intro-progress-fill');
  const percent = document.getElementById('intro-percent');
  const skip = document.getElementById('intro-skip');
  let finished = false;
  let frame = 0;
  function finish() {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem("introSeen", "1"); } catch(e) {}
    cancelAnimationFrame(frame);
    fill.style.width = '100%';
    percent.textContent = '100%';
    intro.classList.add('is-exiting');
    document.body.classList.remove('intro-active');
    if (reducedMotion) intro.remove();
    else {
      intro.addEventListener('transitionend', () => intro.remove(), { once:true });
      // Fallback in case the transition is interrupted.
      setTimeout(() => intro.remove(), 1300);
    }
  }
  stopIntro = finish;
  skip.addEventListener('click', finish);
  let seenIntro = false;
  try { seenIntro = sessionStorage.getItem("introSeen") === "1"; } catch(e) {}
  if (reducedMotion || window.location.hash || seenIntro) finish();
  else {
    const duration = 1950;
    const start = performance.now();
    const tick = now => {
      if (finished) return;
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(progress * 100);
      fill.style.width = value + '%';
      percent.textContent = value + '%';
      if (progress < 1) frame = requestAnimationFrame(tick);
      else finish();
    };
    frame = requestAnimationFrame(tick);
  }
}

// Exit transition for links pointing to our own HTML pages.
// Ctrl/Cmd-click and opening in a new tab still work normally.
const internalPages = new Set(['index.html','work.html','about.html','contact.html','elastix-ai.html','sabbey-data.html','eastside-business-alliance.html','steiger-dynamics.html']);
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  const filename = url.pathname.split('/').pop() || 'index.html';
  const current = location.pathname.split('/').pop() || 'index.html';
  if (url.origin !== location.origin || !internalPages.has(filename) || filename === current || url.hash) return;
  if (reducedMotion) return; // Browser navigates directly.
  event.preventDefault();
  stopIntro();
  document.body.classList.add('page-leaving');
  setTimeout(() => { location.href = url.href; }, 640);
}, { capture:true });

// When arriving from another page, slide the wipe away.
// sessionStorage is optional: gracefully show the page if blocked.
try {
  if (document.referrer && new URL(document.referrer).origin === location.origin && !reducedMotion) {
    const previous = new URL(document.referrer).pathname;
    if (previous !== location.pathname) {
      document.body.classList.add('page-entering');
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-entered')));
      setTimeout(() => document.body.classList.remove('page-entering','page-entered'), 800);
    }
  }
} catch (e) { /* Referrer may be unavailable; no transition needed. */ }

// Reset transitional classes when a user returns with browser Back/Forward.
window.addEventListener('pageshow', () => document.body.classList.remove('page-leaving'));

// V5: Only the cities and companies you identified as real work locations.
// Add verified project descriptions and specific links as your Work page grows.
const locationProjects = {
  seattle: {
    city: 'Seattle, WA', type: '2 companies',
    companies: ['Elastix AI', 'Sabbey Data Corporations'],
    description: 'Filming and lighting for both Seattle companies. Explore the camera and lighting work for both companies.',
    link: 'work.html#video'
  },
  kirkland: {
    city: 'Kirkland, WA', type: '1 company',
    companies: ['EastSide Business Alliance'],
    description: 'Filming and lighting for EastSide Business Alliance. Project video is not yet linked.',
    link: 'eastside-business-alliance.html'
  },
  'san-francisco': {
    city: 'San Francisco, CA', type: '1 company',
    companies: ['Steiger Dynamics'],
    description: 'Filming and lighting for Steiger Dynamics. View the production video.',
    link: 'steiger-dynamics.html'
  }
};
const mapButtons = [...document.querySelectorAll('.map-hit')];
function showLocation(button) {
  const entry = locationProjects[button.dataset.location];
  if (!entry) return;
  mapButtons.forEach(b => {
    b.classList.toggle('active', b === button);
    b.setAttribute('aria-pressed', String(b === button));
  });
  document.getElementById('location-city').textContent = entry.city;
  document.getElementById('location-type').textContent = entry.type;
  const companies = document.getElementById('location-companies');
  companies.replaceChildren();
  entry.companies.forEach(name => {
    const company = document.createElement('div');
    company.className = 'location-company';
    const detailPages = { 'Elastix AI':'elastix-ai.html', 'Sabbey Data Corporations':'sabbey-data.html', 'EastSide Business Alliance':'eastside-business-alliance.html', 'Steiger Dynamics':'steiger-dynamics.html' };
    const a = document.createElement('a');
    a.href = detailPages[name];
    a.textContent = name + ' ↗';
    company.appendChild(a);
    companies.appendChild(company);
  });
  document.getElementById('location-description').textContent = entry.description;
  document.getElementById('location-link').href = entry.link;
  document.getElementById('location-index').textContent = String(mapButtons.indexOf(button) + 1).padStart(2, '0');
}
mapButtons.forEach(button => button.addEventListener('click', () => showLocation(button)));
// Resume is intentionally disabled until you provide the actual PDF.
const resumeLink = document.querySelector('[data-resume-link]');
if (resumeLink) resumeLink.addEventListener('click', event => { if(resumeLink.getAttribute('aria-disabled')==='true') event.preventDefault(); });

// Click-to-play thumbnails avoid loading five YouTube iframes at startup.
document.querySelectorAll('.video-embed').forEach(holder => {
  const trigger = holder.querySelector('.video-play');
  trigger?.addEventListener('click', () => {
    const videoId = holder.dataset.videoId;
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    frame.title = 'Company video production';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    holder.replaceChildren(frame);
  });
});

// Contact: email draft and copy-to-clipboard. Fill with your actual email before launch.
const CONTACT_EMAIL = ''; // e.g. 'hello@your-domain.com' (do not publish a placeholder)
const inquiryForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
function inquiryText() {
  if (!inquiryForm || !inquiryForm.reportValidity()) return null;
  const form = new FormData(inquiryForm);
  return `Name: ${form.get('name')}\nEmail: ${form.get('email')}\nProject: ${form.get('service')}\n\n${form.get('message')}`;
}
if (inquiryForm) {
  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    const body = inquiryText(); if (!body) return;
    if (!CONTACT_EMAIL) {
      feedback.textContent = 'Contact email not configured yet. Click Copy message, or add your email to CONTACT_EMAIL in script.js.';
      return;
    }
    const subject = 'Portfolio project inquiry';
    window.location.href = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    feedback.textContent = 'Your email app should open with the draft. Please press Send there.';
  });
  document.getElementById('copy-inquiry')?.addEventListener('click', async () => {
    const body = inquiryText(); if (!body) return;
    try { await navigator.clipboard.writeText(body); feedback.textContent = 'Inquiry copied. Paste it into your email app.'; }
    catch(e) { feedback.textContent = 'Clipboard unavailable. Select and copy your message from the form.'; }
  });
}
// Smooth, subtle movement of the big headline only when the pointer is precise.
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  const hero = document.querySelector('.hero');
  const heading = document.querySelector('.hero-title');
  hero?.addEventListener('pointermove', e => {
    const box = hero.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    heading?.style.setProperty('--shift-x', `${x * 9}px`);
    heading?.style.setProperty('--shift-y', `${y * 9}px`);
  });
  hero?.addEventListener('pointerleave', () => {heading?.style.setProperty('--shift-x', '0px');heading?.style.setProperty('--shift-y','0px');});
}
