/* =========================================================================
   PINK SKY — community feed
   Demo conversations with topic tabs, search, load-more and a like toggle.
   Likes persist in localStorage; nothing is posted anywhere.
   ========================================================================= */

(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const TOPICS = [
    { id: 'all',       label: 'All' },
    { id: 'fit',       label: 'Fit & Sizing' },
    { id: 'fabric',    label: 'Fabric & Comfort' },
    { id: 'everyday',  label: 'Everyday Wear' },
    { id: 'workwear',  label: 'Workwear' },
    { id: 'dresses',   label: 'Dresses' },
    { id: 'styling',   label: 'Styling' },
    { id: 'wish',      label: 'What I Wish Existed' },
  ];

  /* `chip` is what the card shows; `topic` is what the tabs filter on. */
  const POSTS = [
    { id: 1,  topic: 'dresses',  chip: 'Dresses',          when: '2 hours ago',
      title: 'Why are good midi dresses so hard to find?',
      body:  'I love wearing dresses, but most are either too short or too long. I wish brands had more midi options that actually fit well and look good…',
      likes: 42, replies: 18 },
    { id: 2,  topic: 'fit',      chip: 'Fit & Sizing',     when: '5 hours ago',
      title: "The waist fits but the bust doesn't!",
      body:  "Does anyone else always have this issue? Either the bust is too tight or the waist is loose. Why can't brands just design for real body proportions?",
      likes: 67, replies: 31 },
    { id: 3,  topic: 'wish',     chip: 'Pockets',          when: '8 hours ago',
      title: 'Can we talk about pockets?',
      body:  "Why are pockets either missing or so small they're useless? I just want functional pockets in everyday dresses, trousers and even ethnic wear…",
      likes: 96, replies: 27 },
    { id: 4,  topic: 'workwear', chip: 'Workwear',         when: '1 day ago',
      title: 'Looking for comfortable office wear',
      body:  "I'm tired of uncomfortable fabrics and stiff fits. What are your go-to brands (or styles) for workwear that feel good and still look put together?",
      likes: 51, replies: 19 },
    { id: 5,  topic: 'fabric',   chip: 'Fabric & Comfort', when: '1 day ago',
      title: 'What fabric do you actually love wearing?',
      body:  "I'm trying to build a wardrobe with better fabrics. What fabrics work best for our weather and everyday wear?",
      likes: 38, replies: 24 },
    { id: 6,  topic: 'styling',  chip: 'Styling',          when: '2 days ago',
      title: 'How do you restyle one piece three ways?',
      body:  'I keep buying new things when I should be rewearing what I own. Show me your best one-piece-three-ways combinations — especially for everyday.',
      likes: 44, replies: 16 },
    { id: 7,  topic: 'everyday', chip: 'Everyday Wear',    when: '2 days ago',
      title: 'Clothes that survive a full day out',
      body:  'Between commuting, work and evening plans, most of my clothes give up by 6pm. What actually holds its shape and still feels good at the end of the day?',
      likes: 33, replies: 21 },
    { id: 8,  topic: 'fit',      chip: 'Fit & Sizing',     when: '3 days ago',
      title: 'Why is every brand a different size?',
      body:  "I'm a small in one label and a large in another. Does anyone actually check the measurements chart, or have you just given up like me?",
      likes: 58, replies: 29 },
    { id: 9,  topic: 'fabric',   chip: 'Fabric & Comfort', when: '3 days ago',
      title: 'Linen in humid weather — yes or no?',
      body:  'Everyone swears by linen but mine creases the moment I sit down. Is there a blend that breathes without looking slept in by noon?',
      likes: 29, replies: 14 },
    { id: 10, topic: 'wish',     chip: 'What I Wish Existed', when: '4 days ago',
      title: 'I wish more brands made half sizes',
      body:  'One size is tight, the next is a tent. Half sizes would solve this for so many of us. Is there any reason this is so rare?',
      likes: 72, replies: 25 },
    { id: 11, topic: 'dresses',  chip: 'Dresses',          when: '5 days ago',
      title: 'Dresses with sleeves that actually work',
      body:  'Either sleeveless or full sleeves that pinch at the arm. Where are the dresses with comfortable elbow-length sleeves for daily wear?',
      likes: 47, replies: 20 },
    { id: 12, topic: 'workwear', chip: 'Workwear',         when: '6 days ago',
      title: 'Is there such a thing as a wrinkle-free commute?',
      body:  'My outfit looks pressed at home and crumpled by the time I reach the office. What fabrics survive a scooter or a packed metro?',
      likes: 36, replies: 17 },
  ];

  const PER_PAGE = 5;

  function readLikes() {
    try { return JSON.parse(localStorage.getItem('pinksky:likes')) || []; }
    catch (e) { return []; }
  }
  function writeLikes(v) {
    try { localStorage.setItem('pinksky:likes', JSON.stringify(v)); } catch (e) { /* private mode */ }
  }

  /* Conversations written on this device. Nothing leaves the browser. */
  function readMine() {
    try { return JSON.parse(localStorage.getItem('pinksky:posts')) || []; }
    catch (e) { return []; }
  }
  function writeMine(v) {
    try { localStorage.setItem('pinksky:posts', JSON.stringify(v)); } catch (e) { /* private mode */ }
  }

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function ago(ts) {
    const secs = Math.max(0, (Date.now() - ts) / 1000);
    if (secs < 90) return 'Just now';
    const mins = Math.round(secs / 60);
    if (mins < 60) return mins + (mins === 1 ? ' minute ago' : ' minutes ago');
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? ' hour ago' : ' hours ago');
    const days = Math.round(hrs / 24);
    return days + (days === 1 ? ' day ago' : ' days ago');
  }

  let liked = readLikes();
  let mine  = readMine();
  let topic = 'all';
  let query = '';
  let shown = PER_PAGE;

  const allPosts = () => mine.concat(POSTS);

  const feed    = $('[data-cm-feed]');
  const moreBox = $('[data-cm-more-wrap]');
  const moreBtn = $('[data-cm-more]');
  if (!feed) return;

  const ICON_USER  = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.35"/><path d="M4.9 19.4c.65-3.55 3.45-5.65 7.1-5.65s6.45 2.1 7.1 5.65" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_HEART = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.4 12 20 12 20z" stroke-linejoin="round"/></svg>';
  const ICON_REPLY = '<svg viewBox="0 0 24 24"><path d="M20 12.5c0 3.6-3.6 6.5-8 6.5a9.6 9.6 0 0 1-2.6-.35L5 20l1.2-3.1A6.1 6.1 0 0 1 4 12.5C4 8.9 7.6 6 12 6s8 2.9 8 6.5z" stroke-linejoin="round"/></svg>';

  function match(p) {
    const inTopic = topic === 'all' || p.topic === topic;
    if (!inTopic) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (p.title + ' ' + p.body + ' ' + p.chip).toLowerCase().includes(q);
  }

  function postHTML(p) {
    const on = liked.includes(p.id);
    return `
      <article class="cm-post${p.mine ? ' cm-post--mine' : ''}" data-post="${p.id}">
        <div class="cm-who">
          <span class="cm-avatar">${ICON_USER}</span>
          <b>${esc(p.author || 'Anonymous')}</b>
          <span>${p.at ? ago(p.at) : p.when}</span>
        </div>
        <div>
          <span class="cm-chip">${esc(p.chip)}</span>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.body)}</p>
          <div class="cm-actions">
            <button class="cm-act cm-act--like${on ? ' is-on' : ''}" data-like="${p.id}"
                    aria-pressed="${on}" aria-label="${on ? 'Unlike' : 'Like'} this conversation">
              ${ICON_HEART}<span>${p.likes + (on ? 1 : 0)}</span>
            </button>
            <span class="cm-act">${ICON_REPLY}<span>${p.replies}</span></span>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const list = allPosts().filter(match);
    const page = list.slice(0, shown);

    feed.innerHTML = page.length
      ? page.map(postHTML).join('')
      : '<div class="cm-empty"><b>No conversations yet</b><p>Nothing here on this topic — try another, or start one.</p></div>';

    if (moreBox) moreBox.style.display = shown >= list.length ? 'none' : 'flex';
    $$('[data-cm-tab]').forEach((t) => t.classList.toggle('is-on', t.dataset.cmTab === topic));
  }

  $$('[data-cm-tab]').forEach((t) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      topic = t.dataset.cmTab;
      shown = PER_PAGE;
      render();
    });
  });

  const search = $('[data-cm-search]');
  if (search) {
    search.addEventListener('input', () => {
      query = search.value.trim();
      shown = PER_PAGE;
      render();
    });
  }

  if (moreBtn) moreBtn.addEventListener('click', () => { shown += PER_PAGE; render(); });

  feed.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-like]');
    if (!btn) return;
    const id = Number(btn.dataset.like);
    liked = liked.includes(id) ? liked.filter((x) => x !== id) : liked.concat(id);
    writeLikes(liked);
    render();
  });

  /* ------------------------------------------------------- composer */
  const compose = $('[data-cm-compose]');
  const starts  = $$('[data-cm-start]');

  if (compose) {
    const topicSel = $('[data-cm-topic]', compose);
    const titleEl  = $('[data-cm-title]', compose);
    const bodyEl   = $('[data-cm-body]', compose);
    const anonEl   = $('[data-cm-anon]', compose);
    const nameWrap = $('[data-cm-name-wrap]', compose);
    const nameEl   = $('[data-cm-name]', compose);

    topicSel.innerHTML = TOPICS
      .filter((t) => t.id !== 'all')
      .map((t) => `<option value="${t.id}">${t.label}</option>`)
      .join('');

    function openCompose() {
      compose.hidden = false;
      starts.forEach((b) => b.setAttribute('aria-expanded', 'true'));
      compose.scrollIntoView({ behavior: 'smooth', block: 'center' });
      titleEl.focus({ preventScroll: true });
    }
    function closeCompose() {
      compose.hidden = true;
      starts.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    }

    starts.forEach((b) => {
      b.addEventListener('click', (e) => { e.preventDefault(); openCompose(); });
    });

    $('[data-cm-cancel]', compose).addEventListener('click', closeCompose);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !compose.hidden) closeCompose();
    });

    // a name is only needed when you are not posting anonymously
    anonEl.addEventListener('change', () => {
      nameWrap.hidden = anonEl.checked;
      if (!anonEl.checked) nameEl.focus();
    });

    compose.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = titleEl.value.trim();
      const body  = bodyEl.value.trim();
      if (!title || !body) return;

      const t = TOPICS.find((x) => x.id === topicSel.value) || TOPICS[1];
      const post = {
        id: Date.now(),
        topic: t.id,
        chip: t.label,
        title: title,
        body: body,
        author: anonEl.checked ? 'Anonymous' : (nameEl.value.trim() || 'Anonymous'),
        at: Date.now(),
        likes: 0,
        replies: 0,
        mine: true,
      };

      mine = [post].concat(mine);
      writeMine(mine);

      // clear the filters so the new conversation is actually on screen
      topic = 'all';
      query = '';
      if (search) search.value = '';
      shown = PER_PAGE;

      compose.reset();
      nameWrap.hidden = true;
      closeCompose();
      render();

      const card = $(`[data-post="${post.id}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  render();
})();
