// rawdot theme behaviour. Every feature works without JavaScript; this file only enhances it.

const strings = JSON.parse(document.getElementById('ThemeStrings')?.textContent || '{}');
const liveRegion = document.querySelector('[data-live-region]');

function announce(message) {
  if (!liveRegion) return;
  liveRegion.textContent = '';
  requestAnimationFrame(() => {
    liveRegion.textContent = message;
  });
}

/* Header cart badge: shows the count, filled once the cart has items, with a small bump on change. */
function setCartCount(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
  });
  document.querySelectorAll('[data-cart-badge]').forEach((badge) => {
    badge.toggleAttribute('data-empty', count === 0);
    badge.classList.remove('is-bumped');
    requestAnimationFrame(() => badge.classList.add('is-bumped'));
    setTimeout(() => badge.classList.remove('is-bumped'), 350);
  });
}

/* Header gets a soft shadow once the page scrolls under it. */
const headerSection = document.querySelector('.section-header');
if (headerSection) {
  const onScroll = () => headerSection.classList.toggle('is-scrolled', window.scrollY > 4);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Category tabs and product slides on the homepage. */
class ProductShowcase extends HTMLElement {
  connectedCallback() {
    this.panels = [...this.querySelectorAll('[data-panel]')];
    if (this.panels.length === 0) return;

    // The category links in the header (Skates, Glasspads, Arm sleeves) switch categories in place.
    document.querySelectorAll('[data-category-link]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (!this.hasPanel(link.dataset.categoryLink)) return;
        event.preventDefault();
        link.closest('details')?.removeAttribute('open');
        this.select(link.dataset.categoryLink, true);
        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    this.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-show-slide]');
      if (trigger) this.showSlide(trigger.dataset.showSlide);
    });

    window.addEventListener('hashchange', () => this.selectFromHash());
    if (!this.selectFromHash()) this.select(this.dataset.defaultCategory, false);
  }

  hasPanel(id) {
    return this.panels.some((panel) => panel.dataset.panel === id);
  }

  selectFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!this.hasPanel(id)) return false;
    this.select(id, false);
    return true;
  }

  select(category, updateUrl) {
    this.panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== category;
    });
    // Sections tied to one category (e.g. skate reviews) only show with that category.
    document.querySelectorAll('[data-category-only]').forEach((element) => {
      element.hidden = element.dataset.categoryOnly !== category;
    });
    document.querySelectorAll('[data-category-link]').forEach((link) => {
      if (link.dataset.categoryLink === category) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    if (updateUrl) history.replaceState(null, '', `#${category}`);
  }

  // Versions (e.g. Ice Version / Control Version) are switched by clicking them in the panel or on the stage.
  showSlide(id) {
    const target = this.querySelector(`[data-slide="${CSS.escape(id)}"]`);
    if (!target || target.classList.contains('is-active')) return;
    const slides = [...target.parentElement.children];
    const current = slides.find((slide) => slide.classList.contains('is-active'));
    const forward = slides.indexOf(target) > slides.indexOf(current);

    target.parentElement.dataset.direction = forward ? 'forward' : 'back';
    current?.classList.remove('is-active');
    target.classList.add('is-active');

    // Show the guide (placement, installation, FAQ…) that belongs to the selected version.
    const panel = target.closest('[data-panel]');
    panel?.querySelectorAll('[data-guide-for]').forEach((guide) => {
      guide.hidden = guide.dataset.guideFor !== id;
    });

    target.querySelector(`.versions [data-show-slide="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
    const title = target.querySelector('.buy-box__title')?.textContent.trim();
    if (title) announce(title);
  }
}
customElements.define('product-showcase', ProductShowcase);

/* Option buttons (size, material…) select the matching variant. */
class VariantPicker extends HTMLElement {
  connectedCallback() {
    this.variants = JSON.parse(this.querySelector('[data-variants]').textContent);
    this.form = document.getElementById(this.dataset.formId);
    this.addEventListener('change', () => this.update());
  }

  update() {
    const selected = [...this.querySelectorAll('input:checked')]
      .sort((a, b) => a.dataset.optionIndex - b.dataset.optionIndex)
      .map((input) => input.value);
    const variant = this.variants.find((v) => v.options.every((option, i) => option === selected[i]));
    if (!this.form) return;

    const button = this.form.querySelector('[data-add-button]');
    const label = this.form.querySelector('[data-add-label]');
    const price = this.form.querySelector('[data-price]');
    this.form.querySelector('[data-variant-id]').value = variant ? variant.id : '';
    if (variant) price.innerHTML = variant.price;
    button.disabled = !variant || !variant.available;
    label.textContent = !variant ? strings.unavailable : variant.available ? strings.addToCart : strings.soldOut;
    resetAddButton(this.form);
  }
}
customElements.define('variant-picker', VariantPicker);

/* Add to cart without leaving the page. */
function resetAddButton(form) {
  form.querySelector('[data-add-button]').hidden = false;
  form.querySelector('[data-go-to-cart]').hidden = true;
}

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('[data-product-form]');
  if (!form || !strings.cartAddUrl) return;
  event.preventDefault();

  const button = form.querySelector('[data-add-button]');
  const label = form.querySelector('[data-add-label]');
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  label.textContent = strings.adding;

  try {
    const response = await fetch(strings.cartAddUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const cart = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`).then((r) => r.json());
    setCartCount(cart.item_count);
    label.textContent = strings.addToCart;
    button.hidden = true;
    const goToCart = form.querySelector('[data-go-to-cart]');
    goToCart.hidden = false;
    announce(strings.added);
  } catch (error) {
    label.textContent = strings.addToCart;
    announce(strings.addError);
    console.warn('rawdot: add to cart failed', error);
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
});

/* Cart page: quantity changes and removals apply right away, without an "Update cart" button. */
let cartTimer;
let cartRequest = Promise.resolve();

function setCartBusy(busy) {
  document.querySelector('[data-cart-form]')?.toggleAttribute('aria-busy', busy);
}

function changeCartLine(line, quantity) {
  cartRequest = cartRequest.then(async () => {
    setCartBusy(true);
    const focusedId = document.activeElement?.id;
    try {
      const response = await fetch(strings.cartChangeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line: Number(line), quantity }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const cart = await response.json();
      setCartCount(cart.item_count);
      // Re-render the cart from the server so prices, discounts and totals stay exact.
      const html = await fetch(window.location.pathname).then((r) => r.text());
      const fresh = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart]');
      const current = document.querySelector('[data-cart]');
      if (fresh && current) current.replaceWith(fresh);
      document.getElementById(focusedId)?.focus({ preventScroll: true });
      announce(strings.cartUpdated);
    } catch (error) {
      announce(strings.cartUpdateError);
      console.warn('rawdot: cart update failed', error);
    } finally {
      setCartBusy(false);
    }
  });
}

document.addEventListener('click', (event) => {
  const step = event.target.closest('[data-quantity-step]');
  if (step) {
    const input = document.getElementById(step.getAttribute('aria-controls'));
    if (!input) return;
    input.value = Math.max(0, (Number(input.value) || 0) + Number(step.dataset.quantityStep));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }
  const remove = event.target.closest('.cart-item__remove[data-line]');
  if (remove && strings.cartChangeUrl) {
    event.preventDefault();
    changeCartLine(remove.dataset.line, 0);
  }
});

document.addEventListener('change', (event) => {
  const input = event.target.closest('[data-cart-form] .quantity__input');
  if (!input || !strings.cartChangeUrl) return;
  clearTimeout(cartTimer);
  // Wait briefly so several quick + taps become one request.
  cartTimer = setTimeout(() => changeCartLine(input.dataset.line, Math.max(0, Number(input.value) || 0)), 350);
});

// Enter in a quantity field applies the change instead of submitting the whole form.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  const input = event.target.closest('[data-cart-form] .quantity__input');
  if (!input) return;
  event.preventDefault();
  input.dispatchEvent(new Event('change', { bubbles: true }));
});

/* "See more" scrolls smoothly to the product's guide (respecting reduced motion). */
document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-scroll-to]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  link.closest('dialog')?.close();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
});

/* Remove the logo intro once it has played. */
const intro = document.querySelector('.intro');
if (intro) {
  if (document.documentElement.classList.contains('no-intro')) intro.remove();
  else intro.addEventListener('animationend', (event) => event.target === intro && intro.remove());
}

/* "See more" and "Notify me" open the product details dialog. */
document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-dialog-open]');
  if (opener) {
    opener.closest('details')?.removeAttribute('open');
    document.getElementById(opener.dataset.dialogOpen)?.showModal();
    return;
  }
  // Close a dialog when its backdrop is clicked.
  if (event.target instanceof HTMLDialogElement && event.target.open) event.target.close();
});

// Reopen the dialog after a notify-me form submission, so the confirmation is visible.
if (window.location.search.includes('customer_posted=true') || window.location.hash.endsWith('-notify')) {
  const form = document.getElementById(window.location.hash.slice(1));
  form?.closest('dialog')?.showModal();
}

/* Country and language selectors apply as soon as they change. */
document.querySelectorAll('[data-localization-form] select').forEach((select) => {
  select.addEventListener('change', () => select.form.submit());
});

/* 3D models: load Shopify's model viewer only when a product has one. */
if (document.querySelector('model-viewer')) {
  window.Shopify?.loadFeatures?.([
    {
      name: 'model-viewer-ui',
      version: '1.0',
      onLoad: (errors) => {
        if (errors) return;
        document.querySelectorAll('model-viewer').forEach((viewer) => new window.Shopify.ModelViewerUI(viewer));
      },
    },
  ]);
}
