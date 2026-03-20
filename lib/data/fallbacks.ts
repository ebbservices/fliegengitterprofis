import type { ConfiguratorMetadata } from '@/lib/types';
import type { ProductData } from './products';

const FLIEGENGITTER_METADATA: ConfiguratorMetadata = {
  configurator_type: 'fliegengitter',
  pricing: { base_price_per_sqm_cents: 4500, min_price_cents: 8900 },
  dimensions: { width_min: 100, width_max: 3000, height_min: 100, height_max: 3000 },
  options_config: {
    Farbe: {
      'Weiß (RAL 9016)': { surcharge_cents: 0 },
      'Anthrazit (RAL 7016)': { surcharge_cents: 1500 },
      'Braun (RAL 8014)': { surcharge_cents: 1500 },
      'RAL Wunschfarbe': { surcharge_cents: 3500 },
    },
    Rahmentyp: {
      'Aluminium-Rahmen': { surcharge_cents: 0 },
      'Kunststoff-Rahmen': { surcharge_cents: -1000 },
      'Premium Aluminium': { surcharge_cents: 2500 },
    },
    Gittertyp: {
      'Standard-Polenfilter': { surcharge_cents: 0 },
      'Pollenschutzgewebe': { surcharge_cents: 2000 },
      'Katzennetz': { surcharge_cents: 1500 },
    },
  },
};

const PLISSEE_METADATA: ConfiguratorMetadata = {
  configurator_type: 'plissee',
  pricing: { base_price_per_sqm_cents: 6500, min_price_cents: 12900 },
  dimensions: { width_min: 100, width_max: 3000, height_min: 100, height_max: 3000 },
  options_config: {
    'Plissee-Typ': {
      Sonnenschutz: { surcharge_cents: 0 },
      Verdunkelung: { surcharge_cents: 3500 },
      Wabenplissee: { surcharge_cents: 5000 },
    },
  },
};

const LICHTSCHACHT_METADATA: ConfiguratorMetadata = {
  configurator_type: 'lichtschacht',
  pricing: { base_price_per_sqm_cents: 8500, min_price_cents: 14900 },
  dimensions: { width_min: 100, width_max: 2500, height_min: 100, height_max: 2500 },
  options_config: {
    Farbe: {
      Verzinkt: { surcharge_cents: 0 },
      'Anthrazit (RAL 7016)': { surcharge_cents: 2500 },
      'Weiß (RAL 9016)': { surcharge_cents: 2500 },
    },
  },
};

export const FALLBACK_PRODUCTS: Record<string, ProductData> = {
  'fliegengitter-nach-mass': {
    id: 'fallback-fliegengitter',
    title: 'Fliegengitter nach Maß',
    handle: 'fliegengitter-nach-mass',
    description: 'Stellen Sie Ihr individuelles Fliegengitter zusammen',
    metadata: FLIEGENGITTER_METADATA,
    variants: [],
    thumbnail: '/images/image-2.jpg',
    images: [],
  },
  'plissee-nach-mass': {
    id: 'fallback-plissee',
    title: 'Plissee nach Maß',
    handle: 'plissee-nach-mass',
    description: 'Stellen Sie Ihr individuelles Plissee zusammen',
    metadata: PLISSEE_METADATA,
    variants: [],
    thumbnail: '/images/image-2.jpg',
    images: [],
  },
  'lichtschachtabdeckung-nach-mass': {
    id: 'fallback-lichtschacht',
    title: 'Lichtschachtabdeckung nach Maß',
    handle: 'lichtschachtabdeckung-nach-mass',
    description: 'Stellen Sie Ihre individuelle Lichtschachtabdeckung zusammen',
    metadata: LICHTSCHACHT_METADATA,
    variants: [],
    thumbnail: '/images/image-2.jpg',
    images: [],
  },
};
