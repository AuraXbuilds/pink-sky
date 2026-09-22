/* =========================================================================
   PINK SKY — storefront behaviour
   Vanilla JS, no build step. Cart and wishlist live in localStorage so the
   demo survives a refresh. Nothing here talks to a server.
   ========================================================================= */

(function () {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const inr = (n) => '₹' + n.toLocaleString('en-IN');

  /* ------------------------------------------------------------- storage */
  const store = {
    read(key, fallback) {
      try { return JSON.parse(localStorage.getItem('nikitha:' + key)) ?? fallback; }
      catch (e) { return fallback; }
    },
    write(key, value) {
      try { localStorage.setItem('nikitha:' + key, JSON.stringify(value)); }
      catch (e) { /* private mode — the demo still works, it just forgets */ }
    },
  };

  let cart = store.read('cart', []);
  let wish = store.read('wish', []);

  /* -------------------------------------------------------------- toasts */
  let toastBox;
  function toast(message) {
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.className = 'toasts';
      document.body.appendChild(toastBox);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span>';
    $('span', el).textContent = message;
    toastBox.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 350);
    }, 2600);
  }

  /* ------------------------------------------------------- product lookup */
  const byId = (id) => (typeof PRODUCTS !== 'undefined' ? PRODUCTS.find((p) => p.id === id) : null);

  /* ------------------------------------------------------------ card HTML */
  function cardHTML(p) {
    const tag = p.tag === 'sale' ? '<span class="card__tag card__tag--sale">Sale</span>'
              : p.tag === 'new'  ? '<span class="card__tag card__tag--new">New in</span>'
              : '';
    const price = p.was
      ? `<del>${inr(p.was)}</del><ins>${inr(p.price)}</ins>`
      : inr(p.price);
    const dots = p.colors.map((c) =>
      `<span class="swatch" style="background:${SHADES[c] || '#ccc'}" title="${c}"></span>`).join('');
    const liked = wish.includes(p.id) ? ' is-on' : '';

    return `
      <article class="card" data-id="${p.id}" data-reveal>
        <div class="card__frame">
          <a class="card__media" href="product.html?id=${p.id}" aria-label="${p.name}">
            <img src="assets/img/${p.img}.jpg" alt="${p.name}" loading="lazy" width="800" height="1000">
            <img src="assets/img/${p.img}-2.jpg" alt="" aria-hidden="true" loading="lazy" width="800" height="1000">
          </a>
          ${tag}
          <button class="card__wish${liked}" data-wish="${p.id}"
                  title="${liked ? 'Remove from wishlist' : 'Add to wishlist'}"
                  aria-label="${liked ? 'Remove' : 'Add'} ${p.name} ${liked ? 'from' : 'to'} wishlist"
                  aria-pressed="${liked ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.4 12 20 12 20z" stroke-linejoin="round"/></svg>
          </button>
          <button class="card__quick" data-add="${p.id}">Quick add</button>
        </div>
        <div class="card__body">
          <a class="card__name" href="product.html?id=${p.id}">${p.name}</a>
          <span class="card__meta">${p.fabric}</span>
          <span class="card__price">${price}</span>
          <span class="swatches">${dots}</span>
        </div>
      </article>`;
  }

  function renderGrid(target, list) {
    const box = typeof target === 'string' ? $(target) : target;
    if (!box) return;
    box.innerHTML = list.map(cardHTML).join('');
    observeReveals(box);
  }

  /* ------------------------------------------------------------ the cart */
  function cartCount() { return cart.reduce((n, i) => n + i.qty, 0); }
  function cartTotal() { return cart.reduce((n, i) => n + i.price * i.qty, 0); }

  function addToCart(id, opts) {
    const p = byId(id);
    if (!p) return;
    const size  = (opts && opts.size)  || 'M';
    const color = (opts && opts.color) || p.colors[0];
    const key   = id + '|' + size + '|' + color;
    const line  = cart.find((i) => i.key === key);

    if (line) line.qty += 1;
    else cart.push({ key, id, name: p.name, price: p.price, img: p.img, size, color, qty: 1 });

    store.write('cart', cart);
    paintCart();
    toast(p.name + ' added to bag');
    openCart();
  }

  function setQty(key, delta) {
    const line = cart.find((i) => i.key === key);
    if (!line) return;
    line.qty += delta;
    if (line.qty < 1) cart = cart.filter((i) => i.key !== key);
    store.write('cart', cart);
    paintCart();
  }

  function removeLine(key) {
    cart = cart.filter((i) => i.key !== key);
    store.write('cart', cart);
    paintCart();
    toast('Removed from bag');
  }

  function paintCart() {
    const n = cartCount();
    $$('[data-cart-count]').forEach((el) => {
      el.textContent = n;
      el.classList.toggle('is-on', n > 0);
    });

    const box = $('[data-cart-items]');
    if (!box) return;

    if (!cart.length) {
      box.innerHTML = '<p class="cart__empty">Your bag is empty.<br>Everything worth keeping starts somewhere.</p>';
    } else {
      box.innerHTML = cart.map((i) => `
        <div class="citem" data-key="${i.key}">
          <img src="assets/img/${i.img}.jpg" alt="${i.name}" width="800" height="1000">
          <div>
            <div class="citem__top">
              <div>
                <h4>${i.name}</h4>
                <small>${i.size} · ${i.color}</small>
              </div>
              <span>${inr(i.price * i.qty)}</span>
            </div>
            <div class="citem__foot">
              <span class="qty">
                <button data-qty="-1" aria-label="Decrease quantity">−</button>
                <span>${i.qty}</span>
                <button data-qty="1" aria-label="Increase quantity">+</button>
              </span>
              <button class="citem__rm" data-remove>Remove</button>
            </div>
          </div>
        </div>`).join('');
    }

    const total = $('[data-cart-total]');
    if (total) total.textContent = inr(cartTotal());

    const ship = $('[data-cart-ship]');
    if (ship) ship.textContent = cartTotal() >= 1999 || !cart.length ? 'Free' : inr(149);
  }

  /* ----------------------------------------------------------- wishlist */
  function toggleWish(id) {
    const on = wish.includes(id);
    wish = on ? wish.filter((w) => w !== id) : wish.concat(id);
    store.write('wish', wish);

    const saved = !on;
    $$(`[data-wish="${id}"]`).forEach((btn) => {
      btn.classList.toggle('is-on', saved);
      btn.setAttribute('aria-pressed', String(saved));
      btn.setAttribute('title', saved ? 'Remove from wishlist' : 'Add to wishlist');

      const label = $('[data-wish-label]', btn);
      if (label) label.textContent = saved ? 'In your wishlist' : 'Add to wishlist';
    });

    paintWishCount();
    renderWishlist();
    toast(saved ? 'Added to wishlist' : 'Removed from wishlist');
  }

  function paintWishCount() {
    $$('[data-wish-count]').forEach((el) => {
      el.textContent = wish.length;
      el.classList.toggle('is-on', wish.length > 0);
    });
  }

  /* The saved-items grid on the account page. */
  function renderWishlist() {
    const box = $('[data-wishlist-grid]');
    if (!box) return;

    const list = wish.map(byId).filter(Boolean);
    if (!list.length) {
      box.innerHTML = '<div class="empty-state" style="grid-column:1/-1">' +
        '<h3>Nothing saved yet</h3>' +
        '<p>Tap the heart on any piece and it will wait for you here.</p>' +
        '<p style="margin-top:1.25rem"><a class="btn" href="shop.html">Browse the collection</a></p>' +
        '</div>';
      return;
    }
    renderGrid(box, list);
  }

  /* ------------------------------------------------------- panels: cart */
  const scrim = () => $('[data-scrim]');

  function openCart() {
    const el = $('[data-cart]');
    if (!el) return;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    scrim() && scrim().classList.add('is-on');
    document.body.classList.add('is-locked');
  }
  function closeCart() {
    const el = $('[data-cart]');
    if (el) { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); }
    scrim() && scrim().classList.remove('is-on');
    document.body.classList.remove('is-locked');
  }

  function openNav() {
    const el = $('[data-mnav]');
    if (!el) return;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
  }
  function closeNav() {
    const el = $('[data-mnav]');
    if (el) { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('is-locked');
  }

  /* ------------------------------------------------ header hide on scroll */
  function stickyHeader() {
    const head = $('[data-head]');
    if (!head) return;
    let last = window.scrollY;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const down = y > last && y > 260;
      // don't retract while a panel is open — it looks broken
      if (!document.body.classList.contains('is-locked')) {
        head.classList.toggle('is-hidden', down);
      }
      last = y;
    }, { passive: true });
  }

  /* ------------------------------------------------------ announcement bar */
  function announcements() {
    const items = $$('[data-announce] .announce__item');
    if (items.length < 2) return;
    let i = 0;
    items[0].classList.add('is-on');
    setInterval(() => {
      items[i].classList.remove('is-on');
      i = (i + 1) % items.length;
      items[i].classList.add('is-on');
    }, 4200);
  }

  /* ---------------------------------------------------------- reveal obs */
  let revealObs;
  function observeReveals(root) {
    if (!('IntersectionObserver' in window)) {
      $$('[data-reveal]', root).forEach((el) => el.classList.add('is-in'));
      return;
    }
    if (!revealObs) {
      revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // stagger siblings slightly so grids cascade instead of popping
          const delay = Math.min(idx * 55, 330);
          setTimeout(() => el.classList.add('is-in'), delay);
          revealObs.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    $$('[data-reveal]', root).forEach((el) => revealObs.observe(el));
  }

  /* -------------------------------------------------------- accordions */
  function accordions() {
    $$('.acc__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item  = btn.closest('.acc__item');
        const panel = $('.acc__panel', item);
        const open  = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
      });
    });
  }

  /* -------------------------------------------------------------- forms */
  function fakeForms() {
    $$('[data-fakeform]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const note = $('.form-note', form) || form.parentElement.querySelector('.form-note');
        const msg  = form.dataset.fakeform || 'Thank you — we will be in touch shortly.';
        if (note) { note.textContent = msg; note.classList.add('is-ok'); }
        else toast(msg);
        form.reset();
      });
    });
  }

  /* ------------------------------------------------------- global events */
  function wireGlobals() {
    document.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (add) { e.preventDefault(); addToCart(add.dataset.add); return; }

      const heart = e.target.closest('[data-wish]');
      if (heart) { e.preventDefault(); toggleWish(heart.dataset.wish); return; }

      if (e.target.closest('[data-open-cart]'))  { e.preventDefault(); openCart(); return; }
      if (e.target.closest('[data-close-cart]') || e.target.closest('[data-scrim]')) { closeCart(); return; }
      if (e.target.closest('[data-open-nav]'))   { openNav(); return; }
      if (e.target.closest('[data-close-nav]'))  { closeNav(); return; }

      const step = e.target.closest('[data-qty]');
      if (step) { setQty(step.closest('.citem').dataset.key, Number(step.dataset.qty)); return; }

      const rm = e.target.closest('[data-remove]');
      if (rm) { removeLine(rm.closest('.citem').dataset.key); return; }

      if (e.target.closest('[data-checkout]')) {
        e.preventDefault();
        toast('Checkout is disabled in this demo');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeNav(); }
    });
  }

  /* -------------------------------------------------------- page: shop */
  function shopPage() {
    const grid = $('[data-shop-grid]');
    if (!grid) return;

    const params  = new URLSearchParams(location.search);
    let activeCat = params.get('cat') || 'all';
    let sortBy    = 'featured';

    const countEl = $('[data-result-count]');
    const chips   = $$('[data-filter]');

    function apply() {
      let list = activeCat === 'all'
        ? PRODUCTS.slice()
        : activeCat === 'sale'
          ? PRODUCTS.filter((p) => p.was)
          : activeCat === 'new'
            ? PRODUCTS.filter((p) => p.tag === 'new')
            : PRODUCTS.filter((p) => p.cat === activeCat);

      if (sortBy === 'low')      list.sort((a, b) => a.price - b.price);
      else if (sortBy === 'high') list.sort((a, b) => b.price - a.price);
      else if (sortBy === 'new')  list.sort((a, b) => (b.tag === 'new') - (a.tag === 'new'));
      else if (sortBy === 'loved') list.sort((a, b) => b.sold - a.sold);

      if (!list.length) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>Nothing here yet</h3><p>Try another edit — this one is still being cut and sewn.</p></div>';
      } else {
        renderGrid(grid, list);
      }

      if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' piece' : ' pieces');
      chips.forEach((c) => c.classList.toggle('is-on', c.dataset.filter === activeCat));

      const title = $('[data-shop-title]');
      if (title) {
        const found = typeof CATEGORIES !== 'undefined' && CATEGORIES.find((c) => c.id === activeCat);
        title.textContent = found ? found.label
          : activeCat === 'sale' ? 'The Sale'
          : activeCat === 'new'  ? 'New In'
          : 'All Clothing';
      }
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        activeCat = chip.dataset.filter;
        const url = new URL(location.href);
        if (activeCat === 'all') url.searchParams.delete('cat');
        else url.searchParams.set('cat', activeCat);
        history.replaceState(null, '', url);
        apply();
      });
    });

    const sortSel = $('[data-sort]');
    if (sortSel) sortSel.addEventListener('change', () => { sortBy = sortSel.value; apply(); });

    apply();
  }

  /* ----------------------------------------------------- page: product */
  function productPage() {
    const root = $('[data-pdp]');
    if (!root) return;

    const id = new URLSearchParams(location.search).get('id') || 'anaya';
    const p  = byId(id) || PRODUCTS[0];

    let size  = 'M';
    let color = p.colors[0];

    document.title = p.name + ' — PINK SKY';

    $('[data-pdp-name]').textContent   = p.name;
    $('[data-pdp-crumb]').textContent  = p.name;
    $('[data-pdp-fabric]').textContent = p.fabric;
    $('[data-pdp-price]').innerHTML    = p.was
      ? `<del>${inr(p.was)}</del><ins style="color:var(--sale);text-decoration:none">${inr(p.price)}</ins>`
      : inr(p.price);

    $('[data-pdp-rating]').textContent = `★ ${p.rating.toFixed(1)} · ${p.sold} sold this season`;

    // gallery: this product's two shots, then a detail from its category
    $('[data-pdp-gallery]').innerHTML = [
      `assets/img/${p.img}.jpg`,
      `assets/img/${p.img}-2.jpg`,
      `assets/img/det-${p.cat}.jpg`,
    ].map((src, i) => `<img src="${src}" alt="${p.name} — view ${i + 1}" width="800" height="1000" ${i ? 'loading="lazy"' : ''}>`).join('');

    // colours
    const colorRow = $('[data-pdp-colors]');
    colorRow.innerHTML = p.colors.map((c, i) =>
      `<button class="color-opt${i === 0 ? ' is-on' : ''}" data-color="${c}" style="background:${SHADES[c]}" aria-label="${c}" title="${c}"></button>`).join('');
    $('[data-pdp-color-name]').textContent = color;

    colorRow.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-color]');
      if (!btn) return;
      color = btn.dataset.color;
      $$('.color-opt', colorRow).forEach((b) => b.classList.toggle('is-on', b === btn));
      $('[data-pdp-color-name]').textContent = color;
    });

    // sizes
    const sizeRow = $('[data-pdp-sizes]');
    sizeRow.innerHTML = SIZES.map((s) =>
      `<button class="size${s.out ? ' is-out' : ''}${s.label === size ? ' is-on' : ''}" data-size="${s.label}" ${s.out ? 'disabled' : ''}>${s.label}</button>`).join('');

    sizeRow.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-size]');
      if (!btn || btn.disabled) return;
      size = btn.dataset.size;
      $$('.size', sizeRow).forEach((b) => b.classList.toggle('is-on', b === btn));
    });

    $('[data-pdp-add]').addEventListener('click', () => addToCart(p.id, { size, color }));

    const heart = $('[data-pdp-wish]');
    const saved = wish.includes(p.id);
    heart.dataset.wish = p.id;
    heart.classList.toggle('is-on', saved);
    heart.setAttribute('aria-pressed', String(saved));
    heart.setAttribute('title', saved ? 'Remove from wishlist' : 'Add to wishlist');
    $('[data-wish-label]', heart).textContent = saved ? 'In your wishlist' : 'Add to wishlist';

    // "you may also like" — same category first, then fill from the rest
    const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id)
      .concat(PRODUCTS.filter((x) => x.cat !== p.cat && x.id !== p.id))
      .slice(0, 4);
    renderGrid('[data-related]', related);
  }

  /* --------------------------------------------------------- hero slider */
  const HERO_SLIDES = [
    {
      eyebrow: 'Same women<br>Different skies',
      head: 'A different<br>sky is a<br><em>beautiful</em> place.',
      copy: 'Thoughtfully designed pieces for women who dress on their own terms.',
      cta: 'Explore collection', href: 'shop.html',
    },
    {
      eyebrow: 'Smaller batches<br>More intention',
      head: 'Made for the way you <em>actually</em> dress.',
      copy: 'Natural fibres, quiet colour, and cuts that hold their shape long after the season ends.',
      cta: 'See what’s new', href: 'shop.html?cat=new',
    },
    {
      eyebrow: 'Slower<br>Brighter<br>Kinder',
      head: 'Clothes that feel <em>uniquely</em> you.',
      copy: 'Distinctive, effortless and made in runs small enough to get every detail right.',
      cta: 'Read our story', href: 'about.html',
    },
  ];

  function heroSlider() {
    const hero = $('[data-hero]');
    if (!hero) return;

    const imgs  = $$('.hero__media--split img, .ps-hero__media img', hero);
    const eyeEl = $('[data-hero-eyebrow]', hero);
    const headEl= $('[data-hero-head]', hero);
    const copyEl= $('[data-hero-copy]', hero);
    const ctaEl = $('[data-hero-cta]', hero);
    const countEl = $('[data-hero-count]', hero);

    let i = 0;
    let timer;

    function show(n) {
      i = (n + HERO_SLIDES.length) % HERO_SLIDES.length;
      const s = HERO_SLIDES[i];

      eyeEl.innerHTML    = s.eyebrow;
      headEl.innerHTML   = s.head;
      copyEl.textContent = s.copy;
      ctaEl.firstChild.nodeValue = s.cta + ' ';
      ctaEl.setAttribute('href', s.href);
      countEl.textContent = '0' + (i + 1) + ' / 0' + HERO_SLIDES.length;

      imgs.forEach((img, n2) => img.classList.toggle('is-on', n2 === i));
    }

    function go(step) {
      show(i + step);
      clearInterval(timer);
      timer = setInterval(() => show(i + 1), 7000);
    }

    $('[data-hero-prev]', hero).addEventListener('click', () => go(-1));
    $('[data-hero-next]', hero).addEventListener('click', () => go(1));

    show(0);
    timer = setInterval(() => show(i + 1), 7000);
  }

  /* ------------------------------------------------------- page: tracking */
  const TRACK_STEPS = [
    { key: 'placed',    label: 'Order placed',      note: 'We have your order and payment.' },
    { key: 'workroom',  label: 'In the workroom',   note: 'Being cut, stitched and hand-finished in Erode.' },
    { key: 'dispatch',  label: 'Dispatched',        note: 'Handed to our courier partner in Erode.' },
    { key: 'transit',   label: 'In transit',        note: 'Moving through the delivery network.' },
    { key: 'delivered', label: 'Delivered',         note: 'Signed for at your address.' },
  ];

  /* Order numbers pinned to a fixed stage, so the one we show on the page
     always demonstrates the same thing. Index matches TRACK_STEPS. */
  const DEMO_STAGES = {
    'NIK-10482': 4,   // delivered — the reference used in the form and help text
  };

  function trackPage() {
    const root = $('[data-track]');
    if (!root) return;

    const form = $('[data-track-form]', root);
    const out  = $('[data-track-result]', root);
    const note = $('[data-track-note]', root);

    const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = $('#t-order').value.trim().toUpperCase();
      const ref = raw.replace(/^NIK-?/, 'NIK-');   // accept NIK10482 as well

      if (!/^NIK-\d{3,6}$/.test(ref)) {
        note.textContent = "That doesn't look like one of our order numbers — they run like NIK-10482.";
        note.classList.remove('is-ok');
        out.hidden = true;
        return;
      }

      note.textContent = 'Showing a sample parcel — this demo is not connected to a courier.';
      note.classList.add('is-ok');

      // Derive a stable stage from the reference so different numbers tell
      // different stories, rather than every lookup showing the same parcel.
      // The number we advertise on the page is pinned to the full journey.
      const seed  = [...ref].reduce((n, c) => n + c.charCodeAt(0), 0);
      const stage = ref in DEMO_STAGES ? DEMO_STAGES[ref] : seed % TRACK_STEPS.length;

      const placed = new Date();
      placed.setDate(placed.getDate() - (stage * 2 + 1));
      const eta = new Date(placed);
      eta.setDate(eta.getDate() + 7);

      const items = PRODUCTS.slice(seed % 18, (seed % 18) + 2);
      const total = items.reduce((n, p) => n + p.price, 0);
      const done  = TRACK_STEPS[stage].key === 'delivered';

      out.innerHTML = `
        <div class="track__head">
          <div>
            <p class="eyebrow">Order ${ref}</p>
            <h2>${done ? 'Delivered.' : TRACK_STEPS[stage].label + '.'}</h2>
            <p class="track__eta">${done
              ? 'Arrived ' + fmt(eta) + '. We hope it fits beautifully.'
              : 'Estimated delivery — <b>' + fmt(eta) + '</b>'}</p>
          </div>
          <div class="track__meta">
            <div><span>Placed</span><b>${fmt(placed)}</b></div>
            <div><span>Courier</span><b>${done ? 'Delivered' : 'Bluedart · BD' + (seed * 7 % 900000 + 100000)}</b></div>
            <div><span>Order total</span><b>${inr(total)}</b></div>
          </div>
        </div>

        <ol class="steps">
          ${TRACK_STEPS.map((s, i) => `
            <li class="step${i < stage ? ' is-done' : i === stage ? ' is-now' : ''}">
              <span class="step__dot"></span>
              <div>
                <b>${s.label}</b>
                <span>${i <= stage ? s.note : '—'}</span>
              </div>
            </li>`).join('')}
        </ol>

        <div class="track__items">
          <h3>In this parcel</h3>
          ${items.map((p) => `
            <a class="citem" href="product.html?id=${p.id}">
              <img src="assets/img/${p.img}.jpg" alt="${p.name}" width="800" height="1000">
              <div>
                <div class="citem__top">
                  <div><h4>${p.name}</h4><small>${p.fabric} · size M</small></div>
                  <span>${inr(p.price)}</span>
                </div>
              </div>
            </a>`).join('')}
        </div>

        <p class="track__foot">Something not right? <a href="contact.html#contact">Write to the studio</a> and quote ${ref}.</p>`;

      out.hidden = false;
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  /* ---------------------------------------------------------------- init */
  function init() {
    wireGlobals();
    stickyHeader();
    announcements();
    accordions();
    fakeForms();
    paintCart();

    paintWishCount();
    renderWishlist();

    // home page grids
    if (typeof PRODUCTS !== 'undefined') {
      const newIn = $('[data-grid-new]');
      if (newIn) renderGrid(newIn, PRODUCTS.filter((p) => p.tag === 'new')
        .concat(PRODUCTS.filter((p) => p.tag !== 'new')).slice(0, 8));

      const loved = $('[data-grid-loved]');
      if (loved) renderGrid(loved, PRODUCTS.slice().sort((a, b) => b.sold - a.sold).slice(0, 4));
    }

    heroSlider();
    shopPage();
    productPage();
    trackPage();
    observeReveals(document);

    // mark the current page in the nav
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.nav__link, .mnav__body a').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('?')[0];
      if (href === here) a.setAttribute('aria-current', 'page');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
