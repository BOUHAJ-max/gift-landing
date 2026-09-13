(function () {
  const product = window.product || (window.productConfig && window.productConfig.product) || {};
  const translations = {
    ar: {
      nav: ['الرئيسية', 'الفوائد', 'المزايا', 'الخطوات', 'الأسئلة الشائعة'],
      navHref: ['#top', '#benefits', '#showcase', '#steps', '#faq'],
      primaryCta: 'اطلب الآن من الموقع',
      secondaryCta: 'اطلب الآن عبر واتساب',
      badge: 'منتج مميز',
      problem: 'المشكلة',
      solution: 'الحل',
      finalTitle: 'ابدأ رحلتك اليوم',
      finalText: 'اختر المنتج الذي يناسب روتينك اليومي بسهولة وثقة.',
      whatsapp: 'واتساب',
      noSpecs: 'لا توجد مواصفات متاحة في هذا الوقت.'
    },
    en: {
      nav: ['Home', 'Benefits', 'Showcase', 'How it works', 'FAQ'],
      navHref: ['#top', '#benefits', '#showcase', '#steps', '#faq'],
      primaryCta: 'Order now on the website',
      secondaryCta: 'Order via WhatsApp',
      badge: 'Featured product',
      problem: 'The problem',
      solution: 'The solution',
      finalTitle: 'Start your routine today',
      finalText: 'Choose the product that fits your daily routine with comfort and confidence.',
      whatsapp: 'WhatsApp',
      noSpecs: 'No specifications are available right now.'
    }
  };

  const state = {
    lang: localStorage.getItem('landing-lang') || 'ar',
    menuOpen: false
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(value, currency) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) return currency || 'MAD';
    const locale = state.lang === 'ar' ? 'ar-MA' : 'en-US';
    return `${currency || 'SAR'} ${numericValue.toLocaleString(locale)}`;
  }

  function getLabel(label, labelEn, fallback) {
    return state.lang === 'ar' ? (label || fallback) : (labelEn || label || fallback);
  }

  function getPrimaryAction() {
    const type = String(product.type || 'store').toLowerCase();
    if (type.includes('affiliate') && !type.includes('whatsapp')) {
      return {
        url: product.affiliateUrl || '#',
        label: state.lang === 'ar' ? 'اطلب الآن من الموقع' : 'Order now on the website',
        kind: 'primary'
      };
    }
    if (type.includes('whatsapp') && !type.includes('store') && !type.includes('affiliate')) {
      return {
        url: getWhatsAppUrl(),
        label: state.lang === 'ar' ? 'اطلب الآن عبر واتساب' : 'Order via WhatsApp',
        kind: 'whatsapp'
      };
    }
    if (type.includes('affiliate') && type.includes('whatsapp')) {
      return {
        url: product.affiliateUrl || '#',
        label: state.lang === 'ar' ? 'احصل على المنتج' : 'Get the product',
        kind: 'primary'
      };
    }
    if (type.includes('store') && type.includes('whatsapp')) {
      return {
        url: product.storeUrl || '#',
        label: state.lang === 'ar' ? 'اطلب الآن من الموقع' : 'Order now on the website',
        kind: 'primary'
      };
    }
    return {
      url: product.storeUrl || product.affiliateUrl || '#',
      label: state.lang === 'ar' ? 'اطلب الآن من الموقع' : 'Order now on the website',
      kind: 'primary'
    };
  }

  function getWhatsAppUrl() {
    const productName = product.name || 'المنتج';
    const rawMessage = (product.whatsappMessage || 'مرحبا، أريد الاستفسار عن منتج [PRODUCT NAME].').replace(/\[PRODUCT NAME\]/gi, productName);
    const cleanedNumber = String(product.whatsappNumber || '').replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(rawMessage)}`;
  }

  function setMetaData() {
    const seo = product.seo || {};
    const pageTitle = state.lang === 'ar' ? (product.name || 'المنتج') : (product.name || 'Product');
    document.title = seo.title || pageTitle;
    const description = state.lang === 'ar' ? (seo.descriptionAr || seo.description || product.description || '') : (seo.description || product.descriptionEn || product.description || '');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', seo.canonical || window.location.href);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title || pageTitle);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', seo.ogImage || (product.images && product.images[0] ? product.images[0].src : ''));
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.setAttribute('href', product.brand?.favicon || 'favicon.svg');
  }

  function applyBrandColors() {
    const accent = product.brand?.accent || '#C4E600';
    const primary = product.brand?.primaryCtaColor || '#171717';
    const root = document.documentElement;
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-cta', primary);
  }

  function renderNavigation() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
      navLinks.innerHTML = translations[state.lang].nav.map((label, index) => `<a href="${translations[state.lang].navHref[index]}">${escapeHtml(label)}</a>`).join('');
    }

    const brandText = document.getElementById('brand-text');
    if (brandText) {
      brandText.textContent = product.brand?.name || product.name || 'Luma Studio';
    }

    const headerCta = document.getElementById('header-cta');
    if (headerCta) {
      const action = getPrimaryAction();
      headerCta.setAttribute('href', action.url || '#');
      headerCta.textContent = action.kind === 'whatsapp' ? translations[state.lang].secondaryCta : translations[state.lang].primaryCta;
      headerCta.setAttribute('target', action.url.startsWith('http') ? '_blank' : '_self');
      headerCta.setAttribute('rel', action.url.startsWith('http') ? 'noopener noreferrer' : '');
    }

    document.querySelectorAll('.lang-btn').forEach((button) => {
      const isActive = button.dataset.lang === state.lang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function renderHero() {
    const primaryAction = getPrimaryAction();
    const secondAction = product.whatsappEnabled && String(product.type || '').toLowerCase().includes('whatsapp') ? {
      url: getWhatsAppUrl(),
      label: state.lang === 'ar' ? 'اطلب الآن عبر واتساب' : 'Order via WhatsApp'
    } : null;
    const heroProductName = state.lang === 'ar' ? (product.name || 'منتجنا') : (product.name || 'Our product');
    const badgeText = state.lang === 'ar' ? (product.badge || product.badgeEn || 'Featured') : (product.badgeEn || product.badge || 'Featured');
    const description = state.lang === 'ar' ? (product.description || '') : (product.descriptionEn || product.description || '');
    const mainImage = (product.images && product.images[0]) ? product.images[0] : { src: 'assets/images/product-main.svg', alt: heroProductName };
    const benefits = (product.benefits || []).slice(0, 3);

    return `
      <section class="hero section-pad" id="top">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="hero-badge">${escapeHtml(badgeText)}</span>
            <h1>${escapeHtml(heroProductName)}</h1>
            <p class="hero-description">${escapeHtml(description)}</p>
            <div class="price-row" aria-label="Price">
              <span class="price-old">${escapeHtml(product.oldPrice ? formatPrice(product.oldPrice, product.currency) : '')}</span>
              <span class="price-current">${escapeHtml(formatPrice(product.price, product.currency))}</span>
              <span class="discount-badge">${escapeHtml(product.discount || 'خصم')}</span>
            </div>
            <div class="cta-row">
              <a class="btn btn-primary" href="${escapeHtml(primaryAction.url || '#')}" target="${primaryAction.url.startsWith('http') ? '_blank' : '_self'}" rel="${primaryAction.url.startsWith('http') ? 'noopener noreferrer' : ''}">${escapeHtml(primaryAction.label)}</a>
              ${secondAction ? `<a class="btn btn-secondary" href="${escapeHtml(secondAction.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(secondAction.label)}</a>` : ''}
            </div>
            <ul class="hero-meta" aria-label="Key benefits">
              ${benefits.map((benefit) => `<li>${escapeHtml(getLabel(benefit.title, benefit.titleEn, benefit.title || 'Benefit'))}</li>`).join('')}
            </ul>
          </div>
          <div class="gallery-panel" aria-label="Product gallery">
            <div class="gallery-main">
              <img src="${mainImage.src}" alt="${escapeHtml(state.lang === 'ar' ? (mainImage.altAr || mainImage.alt || heroProductName) : (mainImage.alt || heroProductName))}" data-gallery-main loading="eager" />
            </div>
            <div class="thumb-row" aria-label="Product thumbnails">
              ${(product.images || []).map((image, index) => `
                <button class="thumb-btn ${index === 0 ? 'is-active' : ''}" type="button" data-image-index="${index}" aria-label="${escapeHtml(state.lang === 'ar' ? (image.altAr || image.alt || 'صورة المنتج') : (image.alt || 'Product image'))}">
                  <img src="${image.src}" alt="" loading="lazy" />
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderTrust() {
    if (!product.showTrustStrip) return '';
    const items = (product.trustItems || []).filter((item) => item.enabled !== false);
    if (!items.length) return '';
    return `
      <section class="trust-strip section-pad" aria-label="Trust indicators">
        <div class="container trust-grid">
          ${items.map((item) => `<div class="trust-item"><span class="trust-dot" aria-hidden="true"></span><span>${escapeHtml(getLabel(item.label, item.labelEn, item.label || 'Trust item'))}</span></div>`).join('')}
        </div>
      </section>
    `;
  }

  function renderProblemSolution() {
    const problemText = state.lang === 'ar' ? (product.problemText || 'غالبية المنتجات اليومية تفتقد إلى التجربة المريحة، الواضحة، والموثوقة، ما يجعل الروتين أقل انتظامًا ويفقد الوقت.') : (product.problemTextEn || product.problemText || 'Most everyday products lack a comfortable, clear, and reliable experience.');
    const solutionText = state.lang === 'ar' ? (product.solutionText || 'يوفر Luma Glow تجربة يومية محسّنة من خلال تصميم عملي، سهولة استخدام، ومواصفات مدروسة تعزز الراحة والاستمرارية.') : (product.solutionTextEn || product.solutionText || 'Luma Glow creates a smoother day-to-day experience with a thoughtful design and a practical routine.');

    return `
      <section class="problem-solution section-pad" id="problem-solution">
        <div class="container split-grid">
          <article class="info-card">
            <span class="eyebrow">${translations[state.lang].problem}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'المشكلة' : 'The problem')}</h2>
            <p>${escapeHtml(problemText)}</p>
          </article>
          <article class="info-card accent-card">
            <span class="eyebrow">${translations[state.lang].solution}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'الحل' : 'The solution')}</h2>
            <p>${escapeHtml(solutionText)}</p>
          </article>
        </div>
      </section>
    `;
  }

  function renderBenefits() {
    if (!product.showBenefits) return '';
    const benefitList = product.benefits || [];
    if (!benefitList.length) return '';
    return `
      <section class="section-pad" id="benefits">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'الفوائد' : 'Benefits')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'مزايا تناسب الروتين اليومي' : 'Benefits built for everyday use')}</h2>
          </div>
          <div class="benefits-grid">
            ${benefitList.slice(0, 6).map((item) => `
              <article class="benefit-card">
                <span class="benefit-icon" aria-hidden="true">✦</span>
                <h3>${escapeHtml(getLabel(item.title, item.titleEn, item.title || 'Benefit'))}</h3>
                <p>${escapeHtml(getLabel(item.description, item.descriptionEn, item.description || ''))}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderShowcase() {
    if (!product.showGallery) return '';
    const showcase = product.showcase || [];
    if (!showcase.length) return '';
    return `
      <section class="section-pad showcase" id="showcase">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'العرض' : 'Showcase')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'منتج مصمم ليجعل الروتين أسهل' : 'A product designed to make your routine easier')}</h2>
          </div>
          ${showcase.map((item, index) => `
            <article class="showcase-row ${index % 2 !== 0 ? 'row-reverse' : ''}">
              <div class="showcase-media">
                <img src="${item.image || 'assets/images/product-main.svg'}" alt="${escapeHtml(getLabel(item.title, item.titleEn, item.title || 'Product feature'))}" loading="lazy" />
              </div>
              <div class="showcase-copy">
                <h3>${escapeHtml(getLabel(item.title, item.titleEn, item.title || 'Feature'))}</h3>
                <p>${escapeHtml(getLabel(item.text, item.textEn, item.text || ''))}</p>
                <ul>
                  ${(state.lang === 'ar' ? item.points : item.pointsEn || item.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
                </ul>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderSteps() {
    if (!product.showHowItWorks) return '';
    const steps = product.steps || [];
    if (!steps.length) return '';
    return `
      <section class="section-pad steps" id="steps">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'كيف يعمل' : 'How it works')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'رحلة شراء بسيطة ومباشرة' : 'A simple purchase journey')}</h2>
          </div>
          <div class="steps-grid">
            ${steps.map((step, index) => `
              <article class="step-card">
                <span class="step-no">${index + 1}</span>
                <h3>${escapeHtml(getLabel(step.title, step.titleEn, step.title || `Step ${index + 1}`))}</h3>
                <p>${escapeHtml(getLabel(step.text, step.textEn, step.text || ''))}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderSpecs() {
    if (!product.showSpecifications) return '';
    const specs = product.specifications || [];
    if (!specs.length) return '';
    return `
      <section class="section-pad specs">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'المواصفات' : 'Specifications')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'معلومات المنتج' : 'Product information')}</h2>
          </div>
          <div class="specs-table-wrap">
            <table class="specs-table">
              <tbody>
                ${specs.map((spec) => `
                  <tr>
                    <th>${escapeHtml(getLabel(spec.label, spec.labelEn, spec.label || 'Feature'))}</th>
                    <td>${escapeHtml(spec.value || '')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function renderOffer() {
    if (!product.showOffer) return '';
    const offer = product.offer || {};
    const primaryAction = getPrimaryAction();
    return `
      <section class="section-pad offer" aria-label="Offer section">
        <div class="container offer-card">
          <div class="offer-copy">
            <span class="eyebrow">${escapeHtml(getLabel(offer.badge, offer.badgeEn, 'Offer'))}</span>
            <h2>${escapeHtml(getLabel(offer.title, offer.titleEn, 'Offer'))}</h2>
            <p>${escapeHtml(getLabel(offer.description, offer.descriptionEn, ''))}</p>
            <div class="offer-price-line">
              <span class="old-price">${escapeHtml(product.oldPrice ? formatPrice(product.oldPrice, product.currency) : '')}</span>
              <span class="new-price">${escapeHtml(formatPrice(product.price, product.currency))}</span>
            </div>
            ${offer.urgency ? `<p class="urgency">${escapeHtml(getLabel(offer.urgency, offer.urgencyEn, offer.urgency || ''))}</p>` : ''}
          </div>
          <div class="offer-actions">
            <a class="btn btn-primary" href="${escapeHtml(primaryAction.url || '#')}" target="${primaryAction.url.startsWith('http') ? '_blank' : '_self'}" rel="${primaryAction.url.startsWith('http') ? 'noopener noreferrer' : ''}">${escapeHtml(primaryAction.label)}</a>
            ${product.whatsappEnabled ? `<a class="btn btn-secondary" href="${escapeHtml(getWhatsAppUrl())}" target="_blank" rel="noopener noreferrer">${escapeHtml(state.lang === 'ar' ? 'تواصل واتساب' : 'WhatsApp us')}</a>` : ''}
          </div>
        </div>
      </section>
    `;
  }

  function renderReviews() {
    if (!product.showReviews) return '';
    const reviews = product.reviews || [];
    if (!reviews.length) return '';
    return `
      <section class="section-pad reviews">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'آراء العملاء' : 'Reviews')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'ماذا يقول العملاء؟' : 'What customers are saying')}</h2>
          </div>
          <div class="reviews-grid">
            ${reviews.map((review) => `
              <article class="review-card">
                <div class="review-header">
                  <div class="review-avatar">${escapeHtml(getLabel(review.name, review.nameEn, review.name || 'A').charAt(0).toUpperCase())}</div>
                  <div>
                    <strong>${escapeHtml(getLabel(review.name, review.nameEn, review.name || 'Customer'))}</strong>
                    <div class="stars" aria-label="${review.rating || 5} out of 5 stars">
                      ${Array.from({ length: 5 }).map((_, i) => `<span class="star ${i < (review.rating || 5) ? 'filled' : ''}">★</span>`).join('')}
                    </div>
                  </div>
                </div>
                <p>${escapeHtml(getLabel(review.text, review.textEn, review.text || ''))}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderFaq() {
    if (!product.showFAQ) return '';
    const faqItems = product.faq || [];
    if (!faqItems.length) return '';
    return `
      <section class="section-pad faq" id="faq">
        <div class="container faq-shell">
          <div class="section-head left-align">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'الأسئلة الأكثر شيوعًا' : 'Frequently asked questions')}</h2>
          </div>
          <div class="faq-list">
            ${faqItems.map((item, index) => `
              <details class="faq-item" ${index === 0 ? 'open' : ''}>
                <summary>${escapeHtml(getLabel(item.question, item.questionEn, item.question || 'Question'))}</summary>
                <p>${escapeHtml(getLabel(item.answer, item.answerEn, item.answer || ''))}</p>
              </details>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderFinalCta() {
    const action = getPrimaryAction();
    const finalTitle = translations[state.lang].finalTitle;
    const finalText = translations[state.lang].finalText;
    return `
      <section class="section-pad final-cta">
        <div class="container final-cta-card">
          <div>
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'ابدأ الآن' : 'Get started')}</span>
            <h2>${escapeHtml(finalTitle)}</h2>
            <p>${escapeHtml(finalText)}</p>
          </div>
          <div class="final-cta-actions">
            <a class="btn btn-primary" href="${escapeHtml(action.url || '#')}" target="${action.url.startsWith('http') ? '_blank' : '_self'}" rel="${action.url.startsWith('http') ? 'noopener noreferrer' : ''}">${escapeHtml(action.label)}</a>
            ${product.whatsappEnabled ? `<a class="btn btn-secondary" href="${escapeHtml(getWhatsAppUrl())}" target="_blank" rel="noopener noreferrer">${escapeHtml(state.lang === 'ar' ? 'اسأل عبر واتساب' : 'Ask via WhatsApp')}</a>` : ''}
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    const footerText = document.getElementById('footer-text');
    if (footerText) {
      footerText.textContent = `${new Date().getFullYear()} ${product.brand?.name || product.name || 'Brand'}. ${state.lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}`;
    }
    const footerLinks = document.getElementById('footer-links');
    if (footerLinks) {
      footerLinks.innerHTML = `
        <a href="privacy.html">${state.lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy policy'}</a>
        <a href="terms.html">${state.lang === 'ar' ? 'الشروط' : 'Terms'}</a>
      `;
    }
  }

  function bindGallery() {
    const mainImage = document.querySelector('[data-gallery-main]');
    const buttons = document.querySelectorAll('.thumb-btn');
    if (!mainImage || !buttons.length) return;
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.imageIndex || 0);
        const nextImage = (product.images || [])[index];
        if (!nextImage) return;
        mainImage.src = nextImage.src;
        mainImage.alt = state.lang === 'ar' ? (nextImage.altAr || nextImage.alt || product.name) : (nextImage.alt || product.name);
        buttons.forEach((thumb) => thumb.classList.toggle('is-active', Number(thumb.dataset.imageIndex || 0) === index));
      });
    });
  }

  function bindMenu() {
    const toggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!toggle || !navMenu) return;
    toggle.addEventListener('click', () => {
      state.menuOpen = !state.menuOpen;
      navMenu.classList.toggle('is-open', state.menuOpen);
      toggle.setAttribute('aria-expanded', String(state.menuOpen));
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        state.menuOpen = false;
        navMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function bindLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach((button) => {
      button.addEventListener('click', () => {
        state.lang = button.dataset.lang || 'ar';
        localStorage.setItem('landing-lang', state.lang);
        render();
      });
    });
  }

  function renderFloatingWhatsApp() {
    const button = document.getElementById('floating-whatsapp');
    if (!button) return;
    if (!product.whatsappEnabled || !product.showWhatsApp) {
      button.style.display = 'none';
      return;
    }
    button.style.display = 'inline-flex';
    button.setAttribute('href', getWhatsAppUrl());
    button.setAttribute('aria-label', state.lang === 'ar' ? 'التواصل عبر واتساب' : 'Contact via WhatsApp');
  }

  function renderMobileCta() {
    const mobileCta = document.getElementById('mobile-cta-bar');
    if (!mobileCta) return;
    const primaryAction = getPrimaryAction();
    mobileCta.innerHTML = `
      <a href="${escapeHtml(primaryAction.url || '#')}" target="${primaryAction.url.startsWith('http') ? '_blank' : '_self'}" rel="${primaryAction.url.startsWith('http') ? 'noopener noreferrer' : ''}" class="btn btn-primary">${escapeHtml(primaryAction.label)}</a>
      ${product.whatsappEnabled && product.showWhatsApp ? `<a href="${escapeHtml(getWhatsAppUrl())}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">${escapeHtml(state.lang === 'ar' ? 'واتساب' : 'WhatsApp')}</a>` : ''}
    `;
  }

  function render() {
    renderNavigation();
    setMetaData();
    applyBrandColors();
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        ${renderHero()}
        ${renderTrust()}
        ${renderProblemSolution()}
        ${renderBenefits()}
        ${renderShowcase()}
        ${renderSteps()}
        ${renderSpecs()}
        ${renderOffer()}
        ${renderReviews()}
        ${renderFaq()}
        ${renderFinalCta()}
      `;
    }
    renderFooter();
    renderFloatingWhatsApp();
    renderMobileCta();
    bindGallery();
    bindMenu();
    bindLanguageButtons();
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  }

  render();
})();
