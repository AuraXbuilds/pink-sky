/* =========================================================================
   Demo catalogue. Placeholder copy and pricing — replace with the real
   product feed when it lands. Image names map to files in assets/img/.
   ========================================================================= */

const SHADES = {
  ivory:    '#EFE7DA',
  sand:     '#DCC9AE',
  clay:     '#C08663',
  rust:     '#A9573A',
  olive:    '#6B6F52',
  moss:     '#4B5445',
  charcoal: '#39342F',
  black:    '#221E1A',
  rose:     '#D2A79C',
  indigo:   '#3D4A61',
  wine:     '#6E3440',
  gold:     '#C2A25E',
};

const PRODUCTS = [
  { id: 'anaya',   name: 'Anaya Slip Dress',        cat: 'dresses',     fabric: 'Handloom cotton',   price: 3490,  was: null,  img: 'p-anaya',   colors: ['ivory','clay','olive'],      tag: 'new',  rating: 4.8, sold: 214 },
  { id: 'meher',   name: 'Meher Co-ord Set',        cat: 'separates',   fabric: 'Washed linen',      price: 5250,  was: null,  img: 'p-meher',   colors: ['sand','ivory','charcoal'],   tag: null,   rating: 4.9, sold: 168 },
  { id: 'ira',     name: 'Ira Wrap Dress',          cat: 'dresses',     fabric: 'Mulberry silk',     price: 6890,  was: 8200,  img: 'p-ira',     colors: ['rose','wine','black'],       tag: 'sale', rating: 4.7, sold: 96  },
  { id: 'saanjh',  name: 'Saanjh Kurta Set',        cat: 'kurtas',      fabric: 'Mul cotton',        price: 4750,  was: null,  img: 'p-saanjh',  colors: ['ivory','indigo','olive'],    tag: null,   rating: 4.9, sold: 302 },
  { id: 'noor',    name: 'Noor Organza Saree',      cat: 'sarees',      fabric: 'Silk organza',      price: 8400,  was: null,  img: 'p-noor',    colors: ['ivory','rose','gold'],       tag: 'new',  rating: 5.0, sold: 58  },
  { id: 'vyom',    name: 'Vyom Oversized Shirt',    cat: 'separates',   fabric: 'Cotton poplin',     price: 2990,  was: null,  img: 'p-vyom',    colors: ['ivory','olive','indigo'],    tag: null,   rating: 4.6, sold: 188 },
  { id: 'tara',    name: 'Tara Wide-Leg Trousers',  cat: 'separates',   fabric: 'Tencel twill',      price: 3250,  was: 3900,  img: 'p-tara',    colors: ['sand','charcoal','black'],   tag: 'sale', rating: 4.7, sold: 143 },
  { id: 'rukmini', name: 'Rukmini Woven Blouse',    cat: 'sarees',      fabric: 'Handwoven khadi',   price: 2450,  was: null,  img: 'p-rukmini', colors: ['clay','wine','black'],       tag: null,   rating: 4.5, sold: 87  },
  { id: 'anvi',    name: 'Anvi Tiered Midi',        cat: 'dresses',     fabric: 'Cotton voile',      price: 4190,  was: null,  img: 'p-anvi',    colors: ['ivory','sand','rose'],       tag: null,   rating: 4.8, sold: 176 },
  { id: 'suri',    name: 'Suri Relaxed Blazer',     cat: 'outerwear',   fabric: 'Linen blend',       price: 6250,  was: null,  img: 'p-suri',    colors: ['sand','charcoal','olive'],   tag: 'new',  rating: 4.9, sold: 64  },
  { id: 'kaya',    name: 'Kaya Everyday Kurta',     cat: 'kurtas',      fabric: 'Mul cotton',        price: 2890,  was: null,  img: 'p-kaya',    colors: ['ivory','clay','indigo'],     tag: null,   rating: 4.7, sold: 421 },
  { id: 'lila',    name: 'Lila Bias-Cut Skirt',     cat: 'separates',   fabric: 'Satin crepe',       price: 3690,  was: null,  img: 'p-lila',    colors: ['sand','wine','black'],       tag: null,   rating: 4.6, sold: 119 },
  { id: 'jahan',   name: 'Jahan Quilted Jacket',    cat: 'outerwear',   fabric: 'Quilted cotton',    price: 7450,  was: 8900,  img: 'p-jahan',   colors: ['charcoal','olive','rust'],   tag: 'sale', rating: 4.8, sold: 72  },
  { id: 'amara',   name: 'Amara Ribbed Tank',       cat: 'separates',   fabric: 'Organic knit',      price: 1690,  was: null,  img: 'p-amara',   colors: ['ivory','black','olive'],     tag: null,   rating: 4.5, sold: 356 },
  { id: 'nayra',   name: 'Nayra Chanderi Dupatta',  cat: 'accessories', fabric: 'Chanderi silk',     price: 2250,  was: null,  img: 'p-nayra',   colors: ['rose','gold','ivory'],       tag: null,   rating: 4.9, sold: 134 },
  { id: 'devi',    name: 'Devi Block-Print Dress',  cat: 'dresses',     fabric: 'Hand block cotton', price: 4490,  was: null,  img: 'p-devi',    colors: ['indigo','olive','clay'],     tag: null,   rating: 4.8, sold: 205 },
  { id: 'mira',    name: 'Mira Shirt Dress',        cat: 'dresses',     fabric: 'Cotton poplin',     price: 3990,  was: null,  img: 'p-mira',    colors: ['ivory','sand','indigo'],     tag: null,   rating: 4.6, sold: 162 },
  { id: 'sanya',   name: 'Sanya Pleated Palazzo',   cat: 'separates',   fabric: 'Georgette',         price: 3450,  was: null,  img: 'p-sanya',   colors: ['sand','black','wine'],       tag: null,   rating: 4.7, sold: 128 },
  { id: 'reva',    name: 'Reva Linen Waistcoat',    cat: 'outerwear',   fabric: 'Pure linen',        price: 3890,  was: null,  img: 'p-reva',    colors: ['clay','ivory','charcoal'],   tag: 'new',  rating: 4.7, sold: 49  },
  { id: 'ahalya',  name: 'Ahalya Zari Saree',       cat: 'sarees',      fabric: 'Kanjivaram silk',   price: 11200, was: null,  img: 'p-ahalya',  colors: ['wine','gold','indigo'],      tag: null,   rating: 5.0, sold: 41  },
  { id: 'nila',    name: 'Nila Slip Skirt',         cat: 'separates',   fabric: 'Satin crepe',       price: 2750,  was: 3300,  img: 'p-nila',    colors: ['ivory','rose','charcoal'],   tag: 'sale', rating: 4.5, sold: 183 },
  { id: 'zoya',    name: 'Zoya Cropped Kurti',      cat: 'kurtas',      fabric: 'Cotton dobby',      price: 2350,  was: null,  img: 'p-zoya',    colors: ['ivory','olive','rust'],      tag: null,   rating: 4.6, sold: 237 },
  { id: 'kiara',   name: 'Kiara Tie-Back Top',      cat: 'separates',   fabric: 'Cotton lawn',       price: 2190,  was: null,  img: 'p-kiara',   colors: ['rose','ivory','moss'],       tag: null,   rating: 4.4, sold: 198 },
  { id: 'bhoomi',  name: 'Bhoomi Canvas Tote',      cat: 'accessories', fabric: 'Recycled canvas',   price: 1950,  was: null,  img: 'p-bhoomi',  colors: ['sand','olive','charcoal'],   tag: null,   rating: 4.8, sold: 289 },
];

const CATEGORIES = [
  { id: 'dresses',     label: 'Dresses',     img: 'cat-dresses'     },
  { id: 'kurtas',      label: 'Kurta Sets',  img: 'cat-kurtas'      },
  { id: 'sarees',      label: 'Sarees',      img: 'cat-sarees'      },
  { id: 'separates',   label: 'Separates',   img: 'cat-separates'   },
  { id: 'outerwear',   label: 'Outerwear',   img: 'cat-outerwear'   },
  { id: 'accessories', label: 'Accessories', img: 'cat-accessories' },
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
