import re

with open('j:/pink sky/shop.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_header_section = """
  <section class="shop-hero">
    <div class="shop-hero__text">
      <p class="crumbs"><a href="index.html">Home</a> &rsaquo; Shop</p>
      <h1 data-shop-title>Shop</h1>
      <p>Thoughtfully designed pieces for women<br>who dress on their own terms.</p>
    </div>
    <div class="shop-hero__img">
      <img src="assets/img/ps-hero-landscape.png" alt="Same women. Different skies." loading="lazy">
    </div>
  </section>

  <section class="shop-cats wrap">
    <div class="shop-cats__grid">
      <a href="?cat=separates" class="shop-cat">
        <div class="shop-cat__img"><img src="assets/img/ps-tops.jpg" alt="Tops"></div>
        <span>Tops</span>
      </a>
      <a href="?cat=separates" class="shop-cat">
        <div class="shop-cat__img"><img src="assets/img/ps-bottoms.jpg" alt="Bottoms"></div>
        <span>Bottoms</span>
      </a>
      <a href="?cat=dresses" class="shop-cat">
        <div class="shop-cat__img"><img src="assets/img/ps-dresses.jpg" alt="Dresses"></div>
        <span>Dresses</span>
      </a>
      <a href="?cat=kurtas" class="shop-cat">
        <div class="shop-cat__img"><img src="assets/img/ps-coords.jpg" alt="Co-ords"></div>
        <span>Co-ords</span>
      </a>
      <a href="?cat=outerwear" class="shop-cat">
        <div class="shop-cat__img"><img src="assets/img/cat-outerwear.jpg" alt="Outerwear"></div>
        <span>Outerwear</span>
      </a>
      <a href="?cat=loungewear" class="shop-cat">
        <div class="shop-cat__img"><img src="assets/img/ps-story.jpg" alt="Loungewear"></div>
        <span>Loungewear</span>
      </a>
    </div>
  </section>

  <div class="shop-toolbar wrap">
    <div class="result-count">All Products (24)</div>
    <div class="sort-wrap">
      <label class="sort">Sort by
        <select data-sort aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="new">Newest</option>
          <option value="loved">Most loved</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </label>
    </div>
  </div>
"""

html = re.sub(r'<section class="wrap">\s*<div class="promise">.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<section class="signup">.*?</section>', '', html, flags=re.DOTALL)

load_more = """
  <div style="text-align: center; margin: 4rem 0 6rem;">
    <button class="btn-outline" style="padding: 0.8rem 2.5rem; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid #CFC3B4; background: none; color: var(--ps-ink); cursor: pointer;">LOAD MORE &darr;</button>
  </div>
"""
html = re.sub(r'(<div class="grid" data-shop-grid></div>\s*</section>)', r'\1\n' + load_more, html)

html = re.sub(r'<section class="page-head wrap">.*?</section>\s*<div class="toolbar wrap">.*?</div>', new_header_section, html, flags=re.DOTALL)

with open('j:/pink sky/shop.html', 'w', encoding='utf-8') as f:
    f.write(html)
