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

/* Category tabs and product slides on the homepage. */
class ProductShowcase extends HTMLElement {
  connectedCallback() {
    this.tabs = [...this.querySelectorAll('[role="tab"]')];
    this.panels = [...this.querySelectorAll('[data-panel]')];
    if (this.panels.length === 0) return;

    this.tabs.forEach((tab) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        this.select(tab.dataset.category, true);
      });
      tab.addEventListener('keydown', (event) => this.onTabKeydown(event));
    });
    this.panels.forEach((panel) => this.setUpSlides(panel));

    window.addEventListener('hashchange', () => this.selectFromHash());
    if (!this.selectFromHash()) this.select(this.dataset.defaultCategory, false);
  }

  selectFromHash() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!this.panels.some((panel) => panel.dataset.panel === id)) return false;
    this.select(id, false);
    return true;
  }

  select(category, updateUrl) {
    this.tabs.forEach((tab) => {
      const selected = tab.dataset.category === category;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    this.panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== category;
    });
    document.querySelectorAll('[data-category-link]').forEach((link) => {
      if (link.dataset.categoryLink === category) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    if (updateUrl) history.replaceState(null, '', `#${category}`);
  }

  onTabKeydown(event) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const rtl = getComputedStyle(this).direction === 'rtl';
    const index = this.tabs.indexOf(event.currentTarget);
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = this.tabs.length - 1;
    else {
      const forward = (event.key === 'ArrowRight') !== rtl;
      next = (index + (forward ? 1 : -1) + this.tabs.length) % this.tabs.length;
    }
    this.tabs[next].focus();
    this.select(this.tabs[next].dataset.category, true);
  }

  setUpSlides(panel) {
    const track = panel.querySelector('[data-track]');
    const count = panel.querySelector('[data-slide-count]');
    const prev = panel.querySelector('[data-slide-prev]');
    const next = panel.querySelector('[data-slide-next]');
    if (!track || !count) return;
    const slides = [...track.children];

    const currentIndex = () => Math.round(Math.abs(track.scrollLeft) / track.clientWidth);
    const update = () => {
      const index = currentIndex();
      count.textContent = count.dataset.template.replace('[current]', index + 1).replace('[total]', slides.length);
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };
    const go = (step) => {
      const rtl = getComputedStyle(track).direction === 'rtl';
      track.scrollBy({ left: step * track.clientWidth * (rtl ? -1 : 1), behavior: 'smooth' });
    };

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    track.addEventListener('scrollend', update);
    track.addEventListener('scroll', () => {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(update, 120);
    });
    update();
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
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = cart.item_count;
    });
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

/* "See more" and "Notify me" open the product details dialog. */
document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-dialog-open]');
  if (opener) {
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
