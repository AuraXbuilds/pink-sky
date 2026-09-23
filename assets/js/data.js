/* =========================================================================
   Demo catalogue. Placeholder copy and pricing — replace with the real
   product feed when it lands. Each product needs both `p-<img>.jpg` and
   `p-<img>-2.jpg` in assets/img/ (the second shows on card hover).
   ========================================================================= */

const SHADES = {
  ivory:    '#EFE7DA',
  oat:      '#DCC9AE',
  sand:     '#CDB79C',
  clay:     '#C08663',
  rose:     '#C39A94',
  blush:    '#DDBDB6',
  olive:    '#6B6F52',
  moss:     '#4B5445',
  stone:    '#A9A196',
  charcoal: '#39342F',
  black:    '#221E1A',
  cocoa:    '#6B4A3A',
};

const PRODUCTS = [
  /* ---------------------------------------------------------- tops */
  { id: 'everyday-shirt',   name: 'Everyday Shirt',      cat: 'tops',       fabric: 'Washed linen',      price: 1899, was: null, img: 'p-everyday-shirt',   colors: ['oat','ivory','black'],       tag: 'new',  rating: 4.8, sold: 214 },
  { id: 'relaxed-top',      name: 'Relaxed Top',         cat: 'tops',       fabric: 'Cotton poplin',     price: 1699, was: null, img: 'p-relaxed-top',      colors: ['rose','oat','black'],        tag: null,   rating: 4.6, sold: 188 },
  { id: 'linen-shirt',      name: 'Linen Shirt',         cat: 'tops',       fabric: 'Pure linen',        price: 1999, was: null, img: 'p-linen-shirt',      colors: ['rose','sand','black'],       tag: null,   rating: 4.7, sold: 246 },
  { id: 'poplin-blouse',    name: 'Poplin Blouse',       cat: 'tops',       fabric: 'Cotton poplin',     price: 1799, was: 2199, img: 'p-poplin-blouse',    colors: ['ivory','blush','stone'],     tag: 'sale', rating: 4.5, sold: 132 },

  /* ------------------------------------------------------- bottoms */
  { id: 'flow-pants',       name: 'Flow Pants',          cat: 'bottoms',    fabric: 'Washed linen',      price: 2299, was: null, img: 'p-flow-pants',       colors: ['oat','ivory','black'],       tag: 'new',  rating: 4.9, sold: 168 },
  { id: 'classic-trousers', name: 'Classic Trousers',    cat: 'bottoms',    fabric: 'Tencel twill',      price: 2499, was: null, img: 'p-classic-trousers', colors: ['ivory','sand','charcoal'],   tag: null,   rating: 4.7, sold: 143 },
  { id: 'wide-trousers',    name: 'Wide Trousers',       cat: 'bottoms',    fabric: 'Linen blend',       price: 2399, was: null, img: 'p-wide-trousers',    colors: ['sand','stone','black'],      tag: null,   rating: 4.6, sold: 119 },
  { id: 'tailored-pant',    name: 'Tailored Pant',       cat: 'bottoms',    fabric: 'Cotton twill',      price: 2599, was: 2999, img: 'p-tailored-pant',    colors: ['charcoal','oat','black'],    tag: 'sale', rating: 4.7, sold: 96  },

  /* ------------------------------------------------------- dresses */
  { id: 'day-dress',        name: 'The Day Dress',       cat: 'dresses',    fabric: 'Cotton voile',      price: 2799, was: null, img: 'p-day-dress',        colors: ['rose','blush','black'],      tag: 'new',  rating: 4.9, sold: 302 },
  { id: 'layer-dress',      name: 'Layer Dress',         cat: 'dresses',    fabric: 'Cotton lawn',       price: 2899, was: null, img: 'p-layer-dress',      colors: ['ivory','stone','black'],     tag: null,   rating: 4.8, sold: 176 },
  { id: 'slip-dress',       name: 'Slip Dress',          cat: 'dresses',    fabric: 'Satin crepe',       price: 2699, was: null, img: 'p-slip-dress',       colors: ['blush','oat','charcoal'],    tag: null,   rating: 4.6, sold: 205 },
  { id: 'midi-dress',       name: 'Midi Dress',          cat: 'dresses',    fabric: 'Handloom cotton',   price: 3099, was: null, img: 'p-midi-dress',       colors: ['sand','olive','cocoa'],      tag: null,   rating: 4.8, sold: 162 },

  /* -------------------------------------------------------- co-ords */
  { id: 'tie-back-set',     name: 'Tie Back Co-ord Set', cat: 'coords',     fabric: 'Washed linen',      price: 2999, was: null, img: 'p-tie-back-set',     colors: ['olive','sand','black'],      tag: 'new',  rating: 4.9, sold: 141 },
  { id: 'linen-set',        name: 'Linen Set',           cat: 'coords',     fabric: 'Pure linen',        price: 3299, was: null, img: 'p-linen-set',        colors: ['ivory','oat','stone'],       tag: null,   rating: 4.8, sold: 128 },
  { id: 'knit-set',         name: 'Knit Set',            cat: 'coords',     fabric: 'Organic knit',      price: 3499, was: null, img: 'p-knit-set',         colors: ['oat','blush','charcoal'],    tag: null,   rating: 4.7, sold: 87  },
  { id: 'summer-set',       name: 'Summer Set',          cat: 'coords',     fabric: 'Cotton dobby',      price: 2899, was: 3400, img: 'p-summer-set',       colors: ['ivory','rose','sand'],       tag: 'sale', rating: 4.6, sold: 113 },

  /* ------------------------------------------------------ outerwear */
  { id: 'soft-coat',        name: 'Soft Coat',           cat: 'outerwear',  fabric: 'Wool blend',        price: 4499, was: null, img: 'p-soft-coat',        colors: ['oat','sand','charcoal'],     tag: null,   rating: 4.9, sold: 64  },
  { id: 'linen-jacket',     name: 'Linen Jacket',        cat: 'outerwear',  fabric: 'Linen blend',       price: 3899, was: null, img: 'p-linen-jacket',     colors: ['sand','ivory','olive'],      tag: 'new',  rating: 4.7, sold: 49  },
  { id: 'long-coat',        name: 'Long Coat',           cat: 'outerwear',  fabric: 'Brushed cotton',    price: 4899, was: 5600, img: 'p-long-coat',        colors: ['stone','charcoal','cocoa'],  tag: 'sale', rating: 4.8, sold: 72  },
  { id: 'overshirt',        name: 'Overshirt',           cat: 'outerwear',  fabric: 'Cotton canvas',     price: 2999, was: null, img: 'p-overshirt',        colors: ['olive','oat','black'],       tag: null,   rating: 4.6, sold: 98  },

  /* ----------------------------------------------------- loungewear */
  { id: 'lounge-set',       name: 'Lounge Set',          cat: 'loungewear', fabric: 'Brushed cotton',    price: 2599, was: null, img: 'p-lounge-set',       colors: ['oat','ivory','stone'],       tag: null,   rating: 4.8, sold: 289 },
  { id: 'knit-cardigan',    name: 'Knit Cardigan',       cat: 'loungewear', fabric: 'Organic knit',      price: 2899, was: null, img: 'p-knit-cardigan',    colors: ['ivory','blush','charcoal'],  tag: null,   rating: 4.7, sold: 237 },
  { id: 'home-set',         name: 'Home Set',            cat: 'loungewear', fabric: 'Cotton jersey',     price: 2299, was: null, img: 'p-home-set',         colors: ['sand','oat','stone'],        tag: null,   rating: 4.5, sold: 198 },
  { id: 'soft-knit',        name: 'Soft Knit',           cat: 'loungewear', fabric: 'Merino blend',      price: 3199, was: null, img: 'p-soft-knit',        colors: ['blush','ivory','cocoa'],     tag: 'new',  rating: 4.9, sold: 156 },
];

const CATEGORIES = [
  { id: 'tops',       label: 'Tops',       img: 'ps-tops'       },
  { id: 'bottoms',    label: 'Bottoms',    img: 'ps-bottoms'    },
  { id: 'dresses',    label: 'Dresses',    img: 'ps-dresses'    },
  { id: 'coords',     label: 'Co-ords',    img: 'ps-coords'     },
  { id: 'outerwear',  label: 'Outerwear',  img: 'ps-outerwear'  },
];

/* Sizes are shared across the catalogue; a couple are marked sold out so the
   selector has something honest to say. */
const SIZES = [
  { label: 'XS', out: false },
  { label: 'S',  out: false },
  { label: 'M',  out: false },
  { label: 'L',  out: false },
  { label: 'XL', out: true  },
  { label: '2XL', out: false },
];
