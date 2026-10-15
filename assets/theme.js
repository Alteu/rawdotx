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

/* Toasts: a small black card for cart changes, with the product photo and one action (view cart / undo).
   One at a time; disappears after 5 s, paused while hovered or focused. */
const toastRegion = document.querySelector('[data-toasts]');
const TOAST_MS = 5000;

function dismissToast(toast) {
  if (!toast || toast.classList.contains('is-leaving')) return;
  toast.classList.add('is-leaving');
  setTimeout(() => toast.remove(), 260);
}

function showToast({ message, title, image, action }) {
  if (!toastRegion) return;
  toastRegion.querySelectorAll('.toast').forEach(dismissToast);

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.setProperty('--toast-ms', `${TOAST_MS}ms`);

  const mark = document.createElement('span');
  mark.className = 'toast__mark';
  mark.setAttribute('aria-hidden', 'true');
  toast.append(mark);

  if (image) {
    const img = document.createElement('img');
    img.className = 'toast__image';
    img.src = image;
    img.alt = '';
    img.width = 48;
    img.height = 48;
    toast.append(img);
  }

  const text = document.createElement('div');
  text.className = 'toast__text';
  const messageEl = document.createElement('p');
  messageEl.className = 'toast__message';
  messageEl.textContent = message;
  text.append(messageEl);
  if (title) {
    const titleEl = document.createElement('p');
    titleEl.className = 'toast__title';
    titleEl.textContent = title;
    text.append(titleEl);
  }
  toast.append(text);

  if (action) {
    const el = document.createElement(action.href ? 'a' : 'button');
    el.className = 'toast__action';
    el.textContent = action.label;
    if (action.href) el.href = action.href;
    else el.type = 'button';
    if (action.onClick) {
      el.addEventListener('click', () => {
        dismissToast(toast);
        action.onClick();
      });
    }
    toast.append(el);
  }

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast__close';
  close.setAttribute('aria-label', strings.toastDismiss || 'Dismiss');
  close.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2l8 8M10 2l-8 8"/></svg>';
  close.addEventListener('click', () => dismissToast(toast));
  toast.append(close);

  const timer = document.createElement('span');
  timer.className = 'toast__timer';
  timer.setAttribute('aria-hidden', 'true');
  toast.append(timer);

  // Count down only while the toast isn't hovered or focused.
  let remaining = TOAST_MS;
  let started = Date.now();
  let timeout = setTimeout(() => dismissToast(toast), remaining);
  const pause = () => {
    clearTimeout(timeout);
    remaining -= Date.now() - started;
    toast.classList.add('is-paused');
  };
  const resume = () => {
    if (toast.matches(':hover, :focus-within')) return;
    started = Date.now();
    clearTimeout(timeout);
    timeout = setTimeout(() => dismissToast(toast), Math.max(remaining, 1200));
    toast.classList.remove('is-paused');
  };
  toast.addEventListener('pointerenter', pause);
  toast.addEventListener('pointerleave', resume);
  toast.addEventListener('focusin', pause);
  toast.addEventListener('focusout', () => setTimeout(resume));

  toastRegion.append(toast);
}

function sizedImage(url, width) {
  if (!url) return '';
  return `${url}${url.includes('?') ? '&' : '?'}width=${width}`;
}

/* Header cart badge: shows the count, filled once the cart has items, with a small bump on change. */
function setCartCount(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
  });
  // The visually hidden "n items in cart" text that screen readers hear.
  const label = count === 1 ? strings.cartCountOne : strings.cartCountOther;
  document.querySelectorAll('[data-cart-count-label]').forEach((el) => {
    if (label) el.textContent = label.replace('[count]', count);
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

    // Back/forward to a URL without a known category (e.g. the plain homepage) shows the default one.
    window.addEventListener('hashchange', () => {
      if (!this.selectFromHash()) this.select(this.dataset.defaultCategory, false);
    });
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

/* Product photos: swipe on phones (scroll snap), dots to jump between them on any screen. */
class MediaGallery extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-gallery-track]');
    this.dots = [...this.querySelectorAll('[data-gallery-dot]')];
    this.dots.forEach((dot) => dot.addEventListener('click', () => this.go(Number(dot.dataset.galleryDot))));
    this.track.addEventListener('scroll', () => this.sync(), { passive: true });
    this.track.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const rtl = getComputedStyle(this).direction === 'rtl' ? -1 : 1;
      this.go(this.index() + step * rtl);
    });
  }

  // Distance between two photos (slide width plus any gap), so dots and arrows land exactly on a photo.
  step() {
    const slides = this.track.children;
    return slides.length > 1 ? Math.abs(slides[1].offsetLeft - slides[0].offsetLeft) : this.track.clientWidth;
  }

  index() {
    return Math.round(Math.abs(this.track.scrollLeft) / this.step());
  }

  go(i) {
    const target = Math.max(0, Math.min(this.dots.length - 1, i));
    const rtl = getComputedStyle(this).direction === 'rtl' ? -1 : 1;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.track.scrollTo({ left: rtl * target * this.step(), behavior: reduce ? 'auto' : 'smooth' });
  }

  sync() {
    const current = this.index();
    this.dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }
}
customElements.define('media-gallery', MediaGallery);

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
    if (!response.ok) {
      // Shopify explains stock limits and similar problems in `description`.
      const failure = new Error(`HTTP ${response.status}`);
      failure.description = await response
        .json()
        .then((data) => data.description || '')
        .catch(() => '');
      throw failure;
    }
    const item = await response.json();
    const cart = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`).then((r) => r.json());
    setCartCount(cart.item_count);
    label.textContent = strings.addToCart;
    button.hidden = true;
    const goToCart = form.querySelector('[data-go-to-cart]');
    goToCart.hidden = false;
    const variant = item.variant_title && !/default/i.test(item.variant_title) ? ` · ${item.variant_title}` : '';
    showToast({
      message: strings.toastAdded,
      title: `${item.product_title || ''}${variant}`,
      image: sizedImage(item.image, 160),
      action: { label: strings.toastViewCart, href: strings.cartUrl },
    });
  } catch (error) {
    label.textContent = strings.addToCart;
    showToast({ message: strings.addError, title: error.description || '', action: null });
    console.warn('rawdot: add to cart failed', error);
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
});

/* Cart page: quantity changes and removals apply right away, without an "Update cart" button. */
const cartTimers = new Map();
let cartRequest = Promise.resolve();

function setCartBusy(busy) {
  document.querySelector('[data-cart-form]')?.toggleAttribute('aria-busy', busy);
}

// Re-render the cart from the server so prices, discounts and totals stay exact.
async function refreshCart(count) {
  setCartCount(count);
  const current = document.querySelector('[data-cart]');
  if (!current) return;
  const focusedId = document.activeElement?.id;
  const html = await fetch(window.location.pathname).then((r) => r.text());
  const fresh = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-cart]');
  if (fresh) current.replaceWith(fresh);
  if (focusedId) document.getElementById(focusedId)?.focus({ preventScroll: true });
}

// The line as it was, with its properties and subscription plan, so undo restores it exactly.
function removedItem(removed) {
  const item = { id: Number(removed.variantId), quantity: Number(removed.quantity) };
  try {
    const properties = JSON.parse(removed.properties || 'null');
    if (properties && Object.keys(properties).length > 0) item.properties = properties;
  } catch {
    /* no properties */
  }
  if (removed.sellingPlan) item.selling_plan = Number(removed.sellingPlan);
  return item;
}

function restoreCartLine(removed) {
  cartRequest = cartRequest.then(async () => {
    setCartBusy(true);
    try {
      const response = await fetch(strings.cartAddUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [removedItem(removed)] }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const cart = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`).then((r) => r.json());
      await refreshCart(cart.item_count);
      announce(strings.cartUpdated);
    } catch (error) {
      announce(strings.cartUpdateError);
      console.warn('rawdot: undo failed', error);
    } finally {
      setCartBusy(false);
    }
  });
}

// `key` is the cart line's key, so queued changes still reach the right line after another one is removed.
function changeCartLine(key, quantity) {
  // Remember what is being removed, so the toast can put it back.
  const row = document.querySelector(`[data-cart-line="${CSS.escape(String(key))}"]`);
  const changed = row ? { title: row.dataset.title, image: row.dataset.image } : null;
  const removed =
    quantity === 0 && row
      ? {
          variantId: row.dataset.variantId,
          quantity: row.dataset.quantity,
          properties: row.dataset.properties,
          sellingPlan: row.dataset.sellingPlan,
          title: row.dataset.title,
          image: row.dataset.image,
        }
      : null;

  cartRequest = cartRequest.then(async () => {
    setCartBusy(true);
    try {
      const response = await fetch(strings.cartChangeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: String(key), quantity }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const cart = await response.json();
      await refreshCart(cart.item_count);
      if (removed) {
        showToast({
          message: strings.toastRemoved,
          title: removed.title,
          image: removed.image,
          action: { label: strings.toastUndo, onClick: () => restoreCartLine(removed) },
        });
      } else if (changed) {
        showToast({
          message: strings.toastUpdated,
          title: `${changed.title} · ${strings.toastQuantity} ${quantity}`,
          image: changed.image,
          action: null,
        });
      } else {
        announce(strings.cartUpdated);
      }
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
  const key = input.dataset.line;
  clearTimeout(cartTimers.get(key));
  // Wait briefly so several quick + taps on the same line become one request.
  cartTimers.set(
    key,
    setTimeout(() => {
      cartTimers.delete(key);
      changeCartLine(key, Math.max(0, Number(input.value) || 0));
    }, 350),
  );
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
    const dialog = document.getElementById(opener.dataset.dialogOpen);
    if (!dialog) return;
    // Opening moves focus into the dialog; keep the page exactly where it was.
    const { scrollX, scrollY } = window;
    dialog.showModal();
    window.scrollTo(scrollX, scrollY);
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

/* Small menus built on <details> (footer Legal, phone menu) close with Escape or a click outside. */
function openMenus() {
  return [...document.querySelectorAll('details.footer-menu[open], details.site-header__menu[open]')];
}
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  openMenus().forEach((menu) => {
    menu.removeAttribute('open');
    if (menu.contains(document.activeElement)) menu.querySelector('summary')?.focus();
  });
});
document.addEventListener('click', (event) => {
  openMenus().forEach((menu) => {
    if (!menu.contains(event.target)) menu.removeAttribute('open');
  });
});
// The page behind the open phone menu doesn't scroll.
document.querySelectorAll('details.site-header__menu').forEach((menu) => {
  menu.addEventListener('toggle', () => document.documentElement.classList.toggle('menu-open', menu.open));
});

/* Country and language selectors apply as soon as they change. */
document.querySelectorAll('[data-localization-form] select').forEach((select) => {
  select.addEventListener('change', () => {
    // A language picked by hand wins over the automatic first-visit choice.
    try {
      localStorage.setItem('rawdot-language', 'manual');
    } catch {
      /* storage blocked: nothing to remember */
    }
    select.form.submit();
  });
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

/* Experimental Canvas UI effects, for trying them out only: open the preview with ?fx=1 (?fx=0 turns them
   off again). The script is never loaded otherwise, and never with reduced motion. */
function readFxFlag() {
  const param = new URLSearchParams(window.location.search).get('fx');
  try {
    if (param !== null) sessionStorage.setItem('rawdot-fx', param);
    return sessionStorage.getItem('rawdot-fx') === '1';
  } catch {
    return param === '1';
  }
}

function startFx() {
  const fx = window.RawdotFx;
  if (!fx) return;

  // About: the rawdot mark as white dust that scatters around the cursor and springs back.
  const dialog = document.getElementById('AboutDialog');
  const brand = dialog?.querySelector('.about-dialog__brand');
  let aboutStarted = false;
  const startAbout = () => {
    if (aboutStarted || !brand || !dialog.open) return;
    aboutStarted = true;
    const canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas fx-canvas--about';
    canvas.setAttribute('aria-hidden', 'true');
    brand.prepend(canvas);
    brand.classList.add('has-fx');
    fx.createParticleObject(
      { canvas },
      {
        src: strings.fxMarkUrl,
        color: '#fbfbf9',
        count: 14000,
        size: 2.2,
        sizeVariance: 0.5,
        radius: 110,
        strength: 1.2,
        swirl: 0.6,
        scale: 1.7,
        floatIntensity: 0.4,
        rotationIntensity: 0.2,
        orbit: false,
        zoom: false,
      },
    );
  };
  if (dialog) new MutationObserver(startAbout).observe(dialog, { attributes: true, attributeFilter: ['open'] });

  // Arm sleeves (no photo yet): the mark as a slowly turning 3D object printed in halftone dots.
  document.querySelectorAll('[data-panel="arm-sleeves"] .buy-box__placeholder').forEach((placeholder) => {
    placeholder.querySelector('.logo-mark')?.remove();
    const canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas fx-canvas--halftone';
    canvas.setAttribute('aria-hidden', 'true');
    placeholder.prepend(canvas);
    placeholder.classList.add('has-fx');
    fx.createDitheredObject(
      { canvas },
      {
        src: strings.fxMarkUrl,
        method: 'halftone',
        gridSize: 5,
        grayscale: true,
        background: '',
        scale: 2,
        autoRotate: true,
        autoRotateSpeed: 0.8,
        floatIntensity: 0.6,
        orbit: false,
        zoom: false,
      },
    );
  });
}

if (readFxFlag() && strings.fxScriptUrl && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const script = document.createElement('script');
  script.src = strings.fxScriptUrl;
  script.onload = startFx;
  document.head.append(script);
}
