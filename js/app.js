(function () {
  const config = window.PRODUCT_CONFIG || window.productConfig || {};
  const product = config.product || {};
  const sale = config.sale || {};
  const sections = config.sections || {};
  const translations = config.translations || {
    ar: {
      nav: ['الرئيسية', 'الفوائد', 'العرض', 'كيف يعمل', 'الأسئلة الشائعة'],
      navHref: ['#top', '#benefits', '#showcase', '#how-it-works', '#faq'],
      primaryCta: 'اطلب الآن عبر واتساب',
      secondaryCta: 'اطلب الآن من الموقع',
      buyWhatsApp: 'اطلب الآن عبر واتساب',
      buyWebsite: 'اطلب الآن من الموقع',
      finalTitle: 'ابدأ رحلتك اليوم',
      finalText: 'اختر المنتج الذي يناسب روتينك اليومي بسهولة وثقة.',
      whatsapp: 'واتساب',
      affiliateDisclosure: 'إفصاح: قد نحصل على عمولة عند إتمام عملية شراء عبر بعض الروابط الموجودة في الصفحة، دون تكلفة إضافية عليك.',
      noSpecs: 'لا توجد مواصفات متاحة في هذا الوقت.'
    },
    en: {
      nav: ['Home', 'Benefits', 'Showcase', 'How it works', 'FAQ'],
      navHref: ['#top', '#benefits', '#showcase', '#how-it-works', '#faq'],
      primaryCta: 'Order via WhatsApp',
      secondaryCta: 'Order from Website',
      buyWhatsApp: 'Order via WhatsApp',
      buyWebsite: 'Order from Website',
      finalTitle: 'Start your routine today',
      finalText: 'Choose the product that fits your daily routine with comfort and confidence.',
      whatsapp: 'WhatsApp',
      affiliateDisclosure: 'Disclosure: We may earn a commission if you complete a purchase through some links on this page, at no extra cost to you.',
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

  function getTextField(arValue, enValue, fallbackValue) {
    const value = state.lang === 'ar' ? arValue : enValue;
    return value || arValue || enValue || fallbackValue || '';
  }

  function formatPrice(value, currency) {
    const numericValue = Number(value || 0);
    if (!Number.isFinite(numericValue)) return currency || 'MAD';
    const locale = state.lang === 'ar' ? 'ar-MA' : 'en-US';
    return `${currency || 'MAD'} ${numericValue.toLocaleString(locale)}`;
  }

  function isExternalLink(url) {
    return /^https?:\/\//i.test(String(url || ''));
  }

  function createWhatsAppLink() {
    const whatsappConfig = sale.whatsapp || {};
    if (!whatsappConfig.enabled) return null;
    const number = String(whatsappConfig.number || '').replace(/[^0-9]/g, '');
    if (!number) return null;

    const productName = String(product.name || (state.lang === 'ar' ? 'المنتج' : 'Product'));
    const messageTemplate = String(whatsappConfig.message || 'مرحبا، أريد طلب {product}');
    const message = messageTemplate
      .replace(/\{product\}/gi, productName)
      .replace(/\[PRODUCT NAME\]/gi, productName);

    return {
      url: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      label: translations[state.lang].buyWhatsApp || 'Order via WhatsApp',
      kind: 'whatsapp'
    };
  }

  function createAffiliateLink() {
    const affiliateConfig = sale.affiliate || {};
    const url = String(affiliateConfig.url || '').trim();
    if (!affiliateConfig.enabled || !url) return null;
    return {
      url,
      label: translations[state.lang].buyWebsite || 'Order from Website',
      kind: 'affiliate'
    };
  }

  function renderActionButton(action, className) {
    if (!action || !action.url) return '';
    const target = isExternalLink(action.url) ? '_blank' : '_self';
    const rel = isExternalLink(action.url) ? 'noopener noreferrer' : '';
    return `<a class="${className}" href="${escapeHtml(action.url)}" target="${target}" rel="${rel}" aria-label="${escapeHtml(action.label || 'Purchase')}">${escapeHtml(action.label || 'Purchase')}</a>`;
  }

  function renderCTAButtons(options = {}) {
    const { primaryClass = 'btn btn-primary', secondaryClass = 'btn btn-secondary', showPrimary = true, showSecondary = true } = options;
    const whatsappAction = createWhatsAppLink();
    const affiliateAction = createAffiliateLink();

    const buttons = [];
    if (showPrimary && whatsappAction) {
      buttons.push(renderActionButton(whatsappAction, primaryClass));
    } else if (showPrimary && affiliateAction) {
      buttons.push(renderActionButton(affiliateAction, primaryClass));
    }

    if (showSecondary && affiliateAction && !(whatsappAction && showPrimary)) {
      // Do not duplicate when the same action is already rendered as primary.
    } else if (showSecondary && affiliateAction && whatsappAction) {
      buttons.push(renderActionButton(affiliateAction, secondaryClass));
    }

    return buttons.join('');
  }

  function renderNavigation() {
    const navLinks = document.getElementById('nav-links');
    const navData = translations[state.lang] || translations.ar;
    if (navLinks) {
      navLinks.innerHTML = navData.nav.map((label, index) => `<a href="${escapeHtml(navData.navHref[index] || '#')}">${escapeHtml(label)}</a>`).join('');
    }

    const brandText = document.getElementById('brand-text');
    if (brandText) {
      brandText.textContent = product.brand?.name || product.name || 'Luma Studio';
    }

    const headerCta = document.getElementById('header-cta');
    if (headerCta) {
      const primaryAction = createWhatsAppLink() || createAffiliateLink();
      if (!primaryAction) {
        headerCta.style.display = 'none';
        headerCta.removeAttribute('href');
        headerCta.textContent = '';
        return;
      }

      headerCta.style.display = 'inline-flex';
      headerCta.setAttribute('href', primaryAction.url);
      headerCta.textContent = primaryAction.label;
      headerCta.setAttribute('target', isExternalLink(primaryAction.url) ? '_blank' : '_self');
      headerCta.setAttribute('rel', isExternalLink(primaryAction.url) ? 'noopener noreferrer' : '');
    }

    document.querySelectorAll('.lang-btn').forEach((button) => {
      const isActive = button.dataset.lang === state.lang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function setMetaData() {
    const seo = config.seo || {};
    const pageTitle = getTextField(product.name, product.name, 'Product');
    document.title = seo.title || pageTitle;

    const description = getTextField(seo.descriptionAr || seo.description, seo.description, product.description || '');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', description || '');

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', seo.canonical || location.href);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title || pageTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description || '');

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', seo.ogImage || product.images?.[0]?.src || '');

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.setAttribute('href', config.brand?.favicon || 'favicon.svg');
  }

  function applyBrandColors() {
    const root = document.documentElement;
    root.style.setProperty('--color-accent', config.brand?.accent || '#C4E600');
    root.style.setProperty('--color-cta', config.brand?.primaryCtaColor || '#171717');
  }

  function renderHero() {
    if (!product || !Object.keys(product).length) return '';
    const heroProductName = getTextField(product.name, product.name, 'Product');
    const description = getTextField(product.description, product.descriptionEn, '');
    const mainImage = (product.images && product.images[0]) || { src: 'assets/images/product-main.svg', alt: heroProductName };
    const benefitHighlights = (config.benefits || []).slice(0, 4);
    const ctaMarkup = renderCTAButtons({ primaryClass: 'btn btn-primary', secondaryClass: 'btn btn-secondary' });

    return `
      <section class="hero section-pad" id="top">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="hero-badge">${escapeHtml(getTextField(product.badge, product.badgeEn, 'Featured'))}</span>
            <h1>${escapeHtml(heroProductName)}</h1>
            <p class="hero-description">${escapeHtml(description)}</p>
            <div class="price-row" aria-label="Price">
              <span class="price-old">${escapeHtml(product.oldPrice ? formatPrice(product.oldPrice, product.currency) : '')}</span>
              <span class="price-current">${escapeHtml(formatPrice(product.price, product.currency))}</span>
              <span class="discount-badge">${escapeHtml(product.discount || 'Offer')}</span>
            </div>
            <div class="cta-row">
              ${ctaMarkup || ''}
            </div>
            <ul class="hero-meta" aria-label="Key benefits">
              ${benefitHighlights.map((item) => `<li>${escapeHtml(getTextField(item.title, item.titleEn, item.title || 'Benefit'))}</li>`).join('')}
            </ul>
          </div>

          <div class="gallery-panel" aria-label="Product gallery">
            <div class="gallery-main">
              <img src="${escapeHtml(mainImage.src)}" alt="${escapeHtml(getTextField(mainImage.altAr || mainImage.alt, mainImage.alt, heroProductName))}" data-gallery-main loading="eager" />
            </div>
            <div class="thumb-row" aria-label="Product thumbnails">
              ${(product.images || []).map((image, index) => `
                <button class="thumb-btn ${index === 0 ? 'is-active' : ''}" type="button" data-image-index="${index}" aria-label="${escapeHtml(getTextField(image.altAr || image.alt, image.alt, 'Product image'))}">
                  <img src="${escapeHtml(image.src)}" alt="" loading="lazy" />
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderBenefits() {
    const benefits = config.benefits || [];
    if (sections.benefits === false || !benefits.length) return '';
    return `
      <section class="section-pad" id="benefits">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'الفوائد' : 'Benefits')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'مزايا تناسب الروتين اليومي' : 'Benefits built for everyday use')}</h2>
          </div>
          <div class="benefits-grid">
            ${benefits.slice(0, 6).map((item) => `
              <article class="benefit-card">
                <span class="benefit-icon" aria-hidden="true">✦</span>
                <h3>${escapeHtml(getTextField(item.title, item.titleEn, item.title || 'Benefit'))}</h3>
                <p>${escapeHtml(getTextField(item.description, item.descriptionEn, item.description || ''))}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderShowcase() {
    const showcase = config.showcase || [];
    if (sections.showcase === false || !showcase.length) return '';
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
                <img src="${escapeHtml(item.image || 'assets/images/product-main.svg')}" alt="${escapeHtml(getTextField(item.title, item.titleEn, item.title || 'Product feature'))}" loading="lazy" />
              </div>
              <div class="showcase-copy">
                <h3>${escapeHtml(getTextField(item.title, item.titleEn, item.title || 'Feature'))}</h3>
                <p>${escapeHtml(getTextField(item.text, item.textEn, item.text || ''))}</p>
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

  function renderHowItWorks() {
    const steps = config.howItWorks || [];
    if (sections.howItWorks === false || !steps.length) return '';
    return `
      <section class="section-pad steps" id="how-it-works">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'كيف يعمل' : 'How it works')}</span>
            <h2>${escapeHtml(state.lang === 'ar' ? 'رحلة شراء بسيطة ومباشرة' : 'A simple purchase journey')}</h2>
          </div>
          <div class="steps-grid">
            ${steps.map((step, index) => `
              <article class="step-card">
                <span class="step-no">${index + 1}</span>
                <h3>${escapeHtml(getTextField(step.title, step.titleEn, step.title || `Step ${index + 1}`))}</h3>
                <p>${escapeHtml(getTextField(step.description, step.descriptionEn, step.description || ''))}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderSpecifications() {
    const specs = config.specifications || [];
    if (sections.specifications === false || !specs.length) return '';
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
                    <th>${escapeHtml(getTextField(spec.label, spec.labelEn, spec.label || 'Feature'))}</th>
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
    const offer = config.offer || {};
    if (sections.offer === false || !offer.enabled) return '';
    const whatsappAction = createWhatsAppLink();
    const affiliateAction = createAffiliateLink();
    const actions = [];
    if (whatsappAction) actions.push(renderActionButton(whatsappAction, 'btn btn-primary'));
    if (affiliateAction && whatsappAction) actions.push(renderActionButton(affiliateAction, 'btn btn-secondary'));
    if (affiliateAction && !whatsappAction) actions.push(renderActionButton(affiliateAction, 'btn btn-primary'));

    return `
      <section class="section-pad offer" aria-label="Offer section">
        <div class="container offer-card">
          <div class="offer-copy">
            <span class="eyebrow">${escapeHtml(getTextField(offer.badge, offer.badgeEn, 'Offer'))}</span>
            <h2>${escapeHtml(getTextField(offer.title, offer.titleEn, 'Offer'))}</h2>
            <p>${escapeHtml(getTextField(offer.description, offer.descriptionEn, ''))}</p>
            <div class="offer-price-line">
              <span class="old-price">${escapeHtml(product.oldPrice ? formatPrice(product.oldPrice, product.currency) : '')}</span>
              <span class="new-price">${escapeHtml(formatPrice(product.price, product.currency))}</span>
            </div>
            ${offer.urgency ? `<p class="urgency">${escapeHtml(getTextField(offer.urgency, offer.urgencyEn, offer.urgency || ''))}</p>` : ''}
          </div>
          <div class="offer-actions">
            ${actions.join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderReviews() {
    const reviews = config.reviews || [];
    if (sections.reviews === false || !reviews.length) return '';
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
                  <div class="review-avatar">${escapeHtml(getTextField(review.name, review.nameEn, review.name || 'A').charAt(0).toUpperCase())}</div>
                  <div>
                    <strong>${escapeHtml(getTextField(review.name, review.nameEn, review.name || 'Customer'))}</strong>
                    <div class="stars" aria-label="${review.rating || 5} out of 5 stars">
                      ${Array.from({ length: 5 }).map((_, i) => `<span class="star ${i < (review.rating || 5) ? 'filled' : ''}">★</span>`).join('')}
                    </div>
                  </div>
                </div>
                <p>${escapeHtml(getTextField(review.text, review.textEn, review.text || ''))}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderFaq() {
    const faqItems = config.faq || [];
    if (sections.faq === false || !faqItems.length) return '';
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
                <summary>${escapeHtml(getTextField(item.question, item.questionEn, item.question || 'Question'))}</summary>
                <p>${escapeHtml(getTextField(item.answer, item.answerEn, item.answer || ''))}</p>
              </details>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderAffiliateDisclosure() {
    if (!(sale.affiliate && sale.affiliate.enabled)) return '';
    const disclosureText = translations[state.lang].affiliateDisclosure || 'Disclosure: We may earn a commission when you buy through certain links on this page at no extra cost to you.';
    return `<p class="affiliate-disclosure">${escapeHtml(disclosureText)}</p>`;
  }

  function renderFinalCta() {
    if (sections.finalCTA === false) return '';
    const whatsappAction = createWhatsAppLink();
    const affiliateAction = createAffiliateLink();
    const actions = [];
    if (whatsappAction) actions.push(renderActionButton(whatsappAction, 'btn btn-primary'));
    if (affiliateAction && whatsappAction) actions.push(renderActionButton(affiliateAction, 'btn btn-secondary'));
    if (affiliateAction && !whatsappAction) actions.push(renderActionButton(affiliateAction, 'btn btn-primary'));

    return `
      <section class="section-pad final-cta">
        <div class="container final-cta-card">
          <div>
            <span class="eyebrow">${escapeHtml(state.lang === 'ar' ? 'ابدأ الآن' : 'Get started')}</span>
            <h2>${escapeHtml(translations[state.lang].finalTitle || 'Start your routine today')}</h2>
            <p>${escapeHtml(translations[state.lang].finalText || 'Choose the product that fits your daily routine with comfort and confidence.')}</p>
            ${renderAffiliateDisclosure()}
          </div>
          <div class="final-cta-actions">
            ${actions.join('')}
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    const footerText = document.getElementById('footer-text');
    if (footerText) {
      footerText.textContent = `${new Date().getFullYear()} ${config.brand?.name || product.name || 'Brand'}. ${state.lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}`;
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
        mainImage.alt = getTextField(nextImage.altAr || nextImage.alt, nextImage.alt, product.name || 'Product image');
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
    const whatsappAction = createWhatsAppLink();
    if (!whatsappAction) {
      button.style.display = 'none';
      return;
    }

    button.style.display = 'inline-flex';
    button.setAttribute('href', whatsappAction.url);
    button.setAttribute('aria-label', state.lang === 'ar' ? 'التواصل عبر واتساب' : 'Contact via WhatsApp');
  }

  function renderMobileCta() {
    const mobileCta = document.getElementById('mobile-cta-bar');
    if (!mobileCta) return;
    const whatsappAction = createWhatsAppLink();
    const affiliateAction = createAffiliateLink();
    const actions = [];
    if (whatsappAction) actions.push(renderActionButton(whatsappAction, 'btn btn-primary'));
    if (affiliateAction && whatsappAction) actions.push(renderActionButton(affiliateAction, 'btn btn-secondary'));
    if (affiliateAction && !whatsappAction) actions.push(renderActionButton(affiliateAction, 'btn btn-primary'));

    mobileCta.innerHTML = actions.join('') || '';
  }

  function render() {
    renderNavigation();
    setMetaData();
    applyBrandColors();

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        ${renderHero()}
        ${renderBenefits()}
        ${renderShowcase()}
        ${renderHowItWorks()}
        ${renderSpecifications()}
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
