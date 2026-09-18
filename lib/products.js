// Demo catalogue. Every maker and product here is fictional.
// `bottle` drives the illustrated bottle in components/Bottle.jsx.

export const CATEGORIES = [
  { slug: 'wine', name: 'Wine', blurb: 'Reds, whites and rosé from growers we know.', tint: '#EFE8E6' },
  { slug: 'sparkling', name: 'Champagne & sparkling', blurb: 'Champagne, crémant and prosecco.', tint: '#F1EDE2' },
  { slug: 'whisky', name: 'Whisky', blurb: 'Single malts, bourbon and Japanese blends.', tint: '#F0EAE1' },
  { slug: 'gin', name: 'Gin', blurb: 'London dry and botanical gins.', tint: '#E7EDEA' },
  { slug: 'agave', name: 'Tequila & mezcal', blurb: '100% agave, blanco to añejo.', tint: '#ECEEE5' },
  { slug: 'rum', name: 'Rum', blurb: 'Aged, spiced and dark rums.', tint: '#EFE8E1' },
  { slug: 'vodka', name: 'Vodka', blurb: 'Clean, cold and well made.', tint: '#E9ECEF' },
  { slug: 'beer', name: 'Beer', blurb: 'Pale ales, lagers and stouts.', tint: '#EFEBE2' },
]

export const PRODUCTS = [
  // Wine
  {
    id: 1, slug: 'chateau-mireval-2018', name: 'Château Mireval 2018', maker: 'Château Mireval',
    category: 'wine', style: 'Red', region: 'Bordeaux, France', volume: '750 ml', abv: 13.5,
    price: 48, rating: 4.7, reviews: 212, tags: ['bestseller'],
    notes: ['Blackcurrant', 'Cedar', 'Graphite'],
    description: 'A Merlot-led Right Bank blend with firm, fine tannins. Drinking well now and will keep for another decade.',
    bottle: { shape: 'bordeaux', glass: '#233026', label: '#F2EEE4', ink: '#3A1E22', cap: '#5C1A28' },
  },
  {
    id: 2, slug: 'cote-sauvage-pinot-noir-2021', name: 'Côte Sauvage Pinot Noir 2021', maker: 'Domaine Côte Sauvage',
    category: 'wine', style: 'Red', region: 'Burgundy, France', volume: '750 ml', abv: 13,
    price: 62, rating: 4.8, reviews: 96, tags: ['staff'],
    staffNote: 'Light enough for fish, serious enough for a roast. Serve slightly cool.',
    notes: ['Red cherry', 'Forest floor', 'Violet'],
    description: 'Hand-harvested Pinot Noir from limestone slopes. Silky, bright and perfumed.',
    bottle: { shape: 'burgundy', glass: '#2A3526', label: '#EDE6D6', ink: '#2B2A24', cap: '#1E1E1C' },
  },
  {
    id: 3, slug: 'alto-viento-malbec-2020', name: 'Alto Viento Malbec 2020', maker: 'Bodega Alto Viento',
    category: 'wine', style: 'Red', region: 'Mendoza, Argentina', volume: '750 ml', abv: 14,
    price: 24, rating: 4.5, reviews: 341, tags: [],
    notes: ['Plum', 'Cocoa', 'Violet'],
    description: 'High-altitude Malbec with ripe dark fruit and a soft, round finish. Made for steak.',
    bottle: { shape: 'bordeaux', glass: '#1F2A23', label: '#1B1B1B', ink: '#E8DCC2', cap: '#1B1B1B' },
  },
  {
    id: 4, slug: 'vigna-rossa-chianti-classico-2019', name: 'Vigna Rossa Chianti Classico 2019', maker: 'Vigna Rossa',
    category: 'wine', style: 'Red', region: 'Tuscany, Italy', volume: '750 ml', abv: 13.5,
    price: 29, rating: 4.4, reviews: 158, tags: [],
    notes: ['Sour cherry', 'Dried herbs', 'Leather'],
    description: 'Sangiovese with lively acidity and savoury depth. The pasta-night bottle.',
    bottle: { shape: 'bordeaux', glass: '#27301F', label: '#F4EFE3', ink: '#7A2233', cap: '#7A2233' },
  },
  {
    id: 5, slug: 'harrow-creek-cabernet-2019', name: 'Harrow Creek Cabernet Sauvignon 2019', maker: 'Harrow Creek',
    category: 'wine', style: 'Red', region: 'Napa Valley, USA', volume: '750 ml', abv: 14.5,
    price: 56, rating: 4.6, reviews: 124, tags: [],
    notes: ['Cassis', 'Vanilla', 'Mocha'],
    description: 'Full-bodied Napa Cabernet, aged 20 months in French oak. Rich and polished.',
    bottle: { shape: 'bordeaux', glass: '#1C2620', label: '#E9E2D2', ink: '#1D3B30', cap: '#A6834C' },
  },
  {
    id: 6, slug: 'domaine-lesage-sancerre-2022', name: 'Domaine Lesage Sancerre 2022', maker: 'Domaine Lesage',
    category: 'wine', style: 'White', region: 'Loire Valley, France', volume: '750 ml', abv: 12.5,
    price: 38, rating: 4.7, reviews: 187, tags: ['bestseller'],
    notes: ['Citrus peel', 'Flint', 'Cut grass'],
    description: 'Crisp, mineral Sauvignon Blanc from chalky soils. Oysters, goat cheese, a sunny afternoon.',
    bottle: { shape: 'burgundy', glass: '#C9CFA8', liquid: '#E6DC9A', label: '#FFFFFF', ink: '#1D3B30', cap: '#D8D2C2' },
  },
  {
    id: 7, slug: 'kelpie-bay-sauvignon-blanc-2023', name: 'Kelpie Bay Sauvignon Blanc 2023', maker: 'Kelpie Bay',
    category: 'wine', style: 'White', region: 'Marlborough, New Zealand', volume: '750 ml', abv: 13,
    price: 19, rating: 4.3, reviews: 402, tags: ['bestseller'],
    notes: ['Passion fruit', 'Lime', 'Green pepper'],
    description: 'Zesty and tropical. Our best-selling everyday white.',
    bottle: { shape: 'bordeaux', glass: '#BFCBA6', liquid: '#E3E0A4', label: '#E4EEF0', ink: '#1F3E52', cap: '#1F3E52' },
  },
  {
    id: 8, slug: 'maison-calanque-rose-2023', name: 'Maison Calanque Rosé 2023', maker: 'Maison Calanque',
    category: 'wine', style: 'Rosé', region: 'Provence, France', volume: '750 ml', abv: 12.5,
    price: 26, rating: 4.5, reviews: 233, tags: ['new'],
    notes: ['Wild strawberry', 'Peach', 'Sea salt'],
    description: 'Pale, dry and delicate Provence rosé. Best served very cold.',
    bottle: { shape: 'vodka', glass: '#F3E1DC', liquid: '#F0B9A8', label: '#FFFFFF', ink: '#8C4A3C', cap: '#E8D8C4' },
  },
  // Sparkling
  {
    id: 9, slug: 'delorme-freres-brut-reserve', name: 'Delorme Frères Brut Réserve', maker: 'Delorme Frères',
    category: 'sparkling', style: 'Champagne', region: 'Champagne, France', volume: '750 ml', abv: 12,
    price: 64, rating: 4.8, reviews: 318, tags: ['bestseller'],
    notes: ['Brioche', 'Green apple', 'Almond'],
    description: 'A house-style non-vintage Champagne with fine bubbles and toasty depth. Aged three years on lees.',
    bottle: { shape: 'champagne', glass: '#22301F', label: '#F2ECDD', ink: '#1D3B30', cap: '#B8975C' },
  },
  {
    id: 10, slug: 'delorme-freres-rose', name: 'Delorme Frères Rosé', maker: 'Delorme Frères',
    category: 'sparkling', style: 'Champagne', region: 'Champagne, France', volume: '750 ml', abv: 12,
    price: 82, rating: 4.7, reviews: 88, tags: [],
    notes: ['Raspberry', 'Blood orange', 'Pastry'],
    description: 'Salmon-pink rosé Champagne with red-berry fruit and a creamy mousse.',
    bottle: { shape: 'champagne', glass: '#EBD2C8', liquid: '#E8A99A', label: '#FFFFFF', ink: '#7A2233', cap: '#D9B8AE' },
  },
  {
    id: 11, slug: 'casa-brio-prosecco-superiore', name: 'Casa Brio Prosecco Superiore', maker: 'Casa Brio',
    category: 'sparkling', style: 'Prosecco', region: 'Veneto, Italy', volume: '750 ml', abv: 11,
    price: 21, rating: 4.4, reviews: 276, tags: ['new'],
    notes: ['Pear', 'Acacia', 'Lemon'],
    description: 'DOCG prosecco from steep Valdobbiadene hillsides. Light, floral and very easy to open.',
    bottle: { shape: 'champagne', glass: '#3A4A2E', label: '#F7F3E8', ink: '#2F4A6A', cap: '#E7E2D5' },
  },
  // Whisky
  {
    id: 12, slug: 'glen-aird-12', name: 'Glen Aird 12 Year Single Malt', maker: 'Glen Aird Distillery',
    category: 'whisky', style: 'Single malt Scotch', region: 'Speyside, Scotland', volume: '700 ml', abv: 40,
    price: 58, rating: 4.7, reviews: 520, tags: ['bestseller'],
    notes: ['Honey', 'Baked apple', 'Oak'],
    description: 'Matured in ex-bourbon and sherry casks. Smooth, fruity and a fine place to start with single malt.',
    bottle: { shape: 'whisky', glass: '#EDE7DA', liquid: '#C98A2E', label: '#F4EEE0', ink: '#1D3B30', cap: '#3B2A1E' },
  },
  {
    id: 13, slug: 'glen-aird-18', name: 'Glen Aird 18 Year Single Malt', maker: 'Glen Aird Distillery',
    category: 'whisky', style: 'Single malt Scotch', region: 'Speyside, Scotland', volume: '700 ml', abv: 43,
    price: 140, rating: 4.9, reviews: 74, tags: [],
    notes: ['Dried fig', 'Dark chocolate', 'Orange peel'],
    description: 'Eighteen years in first-fill sherry butts. Deep, rich and made to be sipped slowly.',
    bottle: { shape: 'whisky', glass: '#E9E0D0', liquid: '#9A5418', label: '#1D3B30', ink: '#C9AE7E', cap: '#2A1D14' },
  },
  {
    id: 14, slug: 'ferris-hale-small-batch-bourbon', name: 'Ferris & Hale Small Batch Bourbon', maker: 'Ferris & Hale',
    category: 'whisky', style: 'Bourbon', region: 'Kentucky, USA', volume: '750 ml', abv: 45,
    price: 42, rating: 4.6, reviews: 389, tags: ['bestseller'],
    notes: ['Caramel', 'Toasted pecan', 'Cinnamon'],
    description: 'High-rye bourbon from barrels picked by hand. Sweet up front, with a spicy finish.',
    bottle: { shape: 'rum', glass: '#EFE6D6', liquid: '#B4661F', label: '#F1E4C8', ink: '#5A2A14', cap: '#1B1B1B' },
  },
  {
    id: 15, slug: 'koyo-blended-japanese-whisky', name: 'Kōyō Blended Japanese Whisky', maker: 'Kōyō',
    category: 'whisky', style: 'Japanese whisky', region: 'Japan', volume: '700 ml', abv: 43,
    price: 74, rating: 4.6, reviews: 142, tags: ['new'],
    notes: ['White peach', 'Sandalwood', 'Honey'],
    description: 'A delicate blend of malt and grain whiskies, partly aged in mizunara oak.',
    bottle: { shape: 'gin', glass: '#F0EBE0', liquid: '#D9A24A', label: '#FFFFFF', ink: '#9E2B25', cap: '#2A2622' },
  },
  {
    id: 16, slug: 'isle-of-corran-10', name: 'Isle of Corran 10 Year Peated', maker: 'Corran Distillers',
    category: 'whisky', style: 'Single malt Scotch', region: 'Islay, Scotland', volume: '700 ml', abv: 46,
    price: 66, rating: 4.7, reviews: 201, tags: ['staff'],
    staffNote: 'Big smoke, then sweetness. Try it with a drop of water.',
    notes: ['Peat smoke', 'Sea spray', 'Vanilla'],
    description: 'Bold coastal smoke balanced with sweet malt. Non-chill filtered.',
    bottle: { shape: 'whisky', glass: '#2C3A33', label: '#E7E3D8', ink: '#1B1B1B', cap: '#1B1B1B' },
  },
  // Gin
  {
    id: 17, slug: 'hedgerow-london-dry', name: 'Hedgerow London Dry Gin', maker: 'Hedgerow Distillery',
    category: 'gin', style: 'London dry', region: 'England', volume: '700 ml', abv: 43,
    price: 34, rating: 4.6, reviews: 455, tags: ['bestseller'],
    notes: ['Juniper', 'Coriander', 'Lemon peel'],
    description: 'Classic, juniper-forward gin made in copper pot stills. The one for a G&T.',
    bottle: { shape: 'gin', glass: '#E3ECE6', liquid: '#F4F7F2', label: '#1D3B30', ink: '#F2EEE4', cap: '#A6834C' },
  },
  {
    id: 18, slug: 'nightjar-botanical-gin', name: 'Nightjar Botanical Gin', maker: 'Nightjar',
    category: 'gin', style: 'Botanical', region: 'Scotland', volume: '700 ml', abv: 41.5,
    price: 39, rating: 4.5, reviews: 167, tags: ['staff'],
    staffNote: 'Floral without being perfumey. Great in a martini with a twist.',
    notes: ['Elderflower', 'Pink pepper', 'Bitter orange'],
    description: 'Twelve botanicals, including heather and elderflower, foraged near the distillery.',
    bottle: { shape: 'vodka', glass: '#27354A', label: '#E9E4F0', ink: '#27354A', cap: '#C9AE7E' },
  },
  {
    id: 19, slug: 'saltmarsh-coastal-gin', name: 'Saltmarsh Coastal Gin', maker: 'Saltmarsh',
    category: 'gin', style: 'Contemporary', region: 'Cornwall, England', volume: '700 ml', abv: 42,
    price: 44, rating: 4.4, reviews: 58, tags: ['new'],
    notes: ['Samphire', 'Sea buckthorn', 'Juniper'],
    description: 'A savoury, saline gin distilled with coastal botanicals.',
    bottle: { shape: 'gin', glass: '#D5E3E1', liquid: '#EEF5F3', label: '#FFFFFF', ink: '#2E5E63', cap: '#2E5E63' },
  },
  // Agave
  {
    id: 24, slug: 'sol-de-arandas-blanco', name: 'Sol de Arandas Blanco', maker: 'Sol de Arandas',
    category: 'agave', style: 'Tequila blanco', region: 'Jalisco, Mexico', volume: '750 ml', abv: 40,
    price: 45, rating: 4.6, reviews: 298, tags: ['bestseller'],
    notes: ['Cooked agave', 'Black pepper', 'Lime'],
    description: 'Highland tequila from slow-roasted agave. Bright and peppery; ideal for margaritas.',
    bottle: { shape: 'tequila', glass: '#EEF0EC', liquid: '#F7F8F5', label: '#F3E7CF', ink: '#8C3B1F', cap: '#6B4A2E' },
  },
  {
    id: 25, slug: 'sol-de-arandas-reposado', name: 'Sol de Arandas Reposado', maker: 'Sol de Arandas',
    category: 'agave', style: 'Tequila reposado', region: 'Jalisco, Mexico', volume: '750 ml', abv: 40,
    price: 55, rating: 4.7, reviews: 131, tags: ['staff'],
    staffNote: 'Rested eight months in oak. Sip it neat with an orange slice.',
    notes: ['Vanilla', 'Agave', 'Toffee'],
    description: 'Rested in American oak for eight months. Soft vanilla over sweet agave.',
    bottle: { shape: 'tequila', glass: '#F0EADF', liquid: '#E0B45E', label: '#F3E7CF', ink: '#8C3B1F', cap: '#6B4A2E' },
  },
  {
    id: 26, slug: 'tierra-roja-mezcal-espadin', name: 'Tierra Roja Mezcal Espadín', maker: 'Tierra Roja',
    category: 'agave', style: 'Mezcal', region: 'Oaxaca, Mexico', volume: '700 ml', abv: 45,
    price: 62, rating: 4.5, reviews: 64, tags: ['new'],
    notes: ['Wood smoke', 'Green mango', 'Clay'],
    description: 'Espadín agave roasted in earthen pits and distilled in clay pots.',
    bottle: { shape: 'rum', glass: '#E8E6DD', liquid: '#F2F1EA', label: '#9E3B22', ink: '#F3E7CF', cap: '#3B2A1E' },
  },
  // Rum
  {
    id: 22, slug: 'cayo-viejo-8', name: 'Cayo Viejo 8 Year Rum', maker: 'Cayo Viejo',
    category: 'rum', style: 'Aged rum', region: 'Barbados', volume: '700 ml', abv: 40,
    price: 38, rating: 4.6, reviews: 243, tags: ['bestseller'],
    notes: ['Molasses', 'Banana', 'Clove'],
    description: 'Pot and column still rum aged eight years in the Caribbean heat.',
    bottle: { shape: 'rum', glass: '#E6DCC8', liquid: '#8A4A16', label: '#F1E6D0', ink: '#1D3B30', cap: '#2A1D14' },
  },
  {
    id: 23, slug: 'black-reef-spiced-rum', name: 'Black Reef Spiced Rum', maker: 'Black Reef',
    category: 'rum', style: 'Spiced rum', region: 'Jamaica', volume: '700 ml', abv: 37.5,
    price: 29, rating: 4.3, reviews: 187, tags: [],
    notes: ['Vanilla', 'Nutmeg', 'Orange'],
    description: 'Jamaican rum spiced with vanilla, nutmeg and orange peel. Built for cola and ginger beer.',
    bottle: { shape: 'whisky', glass: '#1E1E1C', label: '#C9AE7E', ink: '#1E1E1C', cap: '#1E1E1C' },
  },
  // Vodka
  {
    id: 20, slug: 'polar-line-vodka', name: 'Polar Line Vodka', maker: 'Polar Line',
    category: 'vodka', style: 'Wheat vodka', region: 'Finland', volume: '700 ml', abv: 40,
    price: 28, rating: 4.4, reviews: 310, tags: [],
    notes: ['Clean', 'Cracked pepper', 'Creamy'],
    description: 'Distilled from winter wheat and glacial spring water. Clean and soft.',
    bottle: { shape: 'vodka', glass: '#E4EAEF', liquid: '#F6F8FA', label: '#FFFFFF', ink: '#1F3E52', cap: '#1F3E52' },
  },
  {
    id: 21, slug: 'wheatfield-reserve-vodka', name: 'Wheatfield Reserve Vodka', maker: 'Wheatfield',
    category: 'vodka', style: 'Rye vodka', region: 'Poland', volume: '700 ml', abv: 40,
    price: 36, rating: 4.5, reviews: 96, tags: [],
    notes: ['Rye bread', 'White pepper', 'Anise'],
    description: 'Single-estate rye vodka with a gently spicy, bready character. Excellent ice-cold.',
    bottle: { shape: 'vodka', glass: '#ECEBE6', liquid: '#F7F7F4', label: '#1B1B1B', ink: '#E8DCC2', cap: '#1B1B1B' },
  },
  // Beer
  {
    id: 27, slug: 'tollgate-pale-ale-6', name: 'Tollgate Pale Ale, 6-pack', maker: 'Tollgate Brewing',
    category: 'beer', style: 'Pale ale', region: 'Oregon, USA', volume: '6 × 355 ml', abv: 5.6,
    price: 14, rating: 4.4, reviews: 222, tags: [],
    notes: ['Grapefruit', 'Pine', 'Biscuit'],
    description: 'A crisp, hoppy pale ale with a dry finish. Brewed with Cascade and Centennial.',
    bottle: { shape: 'beer', glass: '#5A3314', label: '#F2E6C9', ink: '#1D3B30', cap: '#A6834C' },
  },
  {
    id: 28, slug: 'old-quarry-stout-4', name: 'Old Quarry Oatmeal Stout, 4-pack', maker: 'Old Quarry Brewery',
    category: 'beer', style: 'Stout', region: 'Yorkshire, England', volume: '4 × 440 ml', abv: 6.2,
    price: 12, rating: 4.5, reviews: 119, tags: [],
    notes: ['Espresso', 'Dark chocolate', 'Oats'],
    description: 'Smooth and roasty, with a creamy body from malted oats.',
    bottle: { shape: 'beer', glass: '#1E1A16', label: '#1D1D1B', ink: '#C9AE7E', cap: '#1D1D1B' },
  },
]

export const FREE_DELIVERY_THRESHOLD = 75
export const DELIVERY_FEE = 6.95

export function getProduct(idOrSlug) {
  return PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
}

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function byTag(tag) {
  return PRODUCTS.filter((p) => p.tags.includes(tag))
}

export function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
