export type Edition = {
  id: string;
  name: string;
  /** word set huge behind the can */
  backdrop: string;
  group: 'The original' | 'Energy editions' | 'Beyond energy';
  tagline: string;
  copy: string;
  /** facts printed on the can or its label, nothing invented */
  notes: { k: string; v: string }[];
  /** photo cut-out (null for the Classic, which is the real-time 3D can) */
  image: string | null;
  bg: string;
  fg: string;
  accent: string;
  rim: string;
  light?: boolean;
};

export const EDITIONS: Edition[] = [
  {
    id: 'classic',
    name: 'Classic',
    backdrop: 'Classic',
    group: 'The original',
    tagline: 'Where it started in 2006',
    copy: 'The gold and royal-blue can with the red eagle. Caffeine, taurine and B-vitamins in 250 ml.',
    notes: [
      { k: 'Caffeine', v: '32 mg per 100 ml' },
      { k: 'Taurine', v: '400 mg per 100 ml' },
      { k: 'Can', v: '250 ml' },
    ],
    image: null,
    bg: '#0d0b07',
    fg: '#efe8d6',
    accent: '#d9b45f',
    rim: '#f2c66b',
  },
  {
    id: 'sugarfree',
    name: 'Sugar Free',
    backdrop: 'Sugar Free',
    group: 'Energy editions',
    tagline: 'The Classic without sugar',
    copy: 'Same eagle and the same navy lettering, with silver in place of royal blue.',
    notes: [
      { k: 'Sugar', v: 'Free' },
      { k: 'Type', v: 'Energy drink' },
    ],
    image: '/images/editions/sugarfree.webp',
    bg: '#0a1029',
    fg: '#eef0f6',
    accent: '#f1da6c',
    rim: '#fff0a8',
  },
  {
    id: 'tropical',
    name: 'Tropical Edition',
    backdrop: 'Tropical',
    group: 'Energy editions',
    tagline: 'A tropical Golden Eagle',
    copy: 'A tropical-flavoured edition in an all-gold can with white lettering.',
    notes: [
      { k: 'Flavour', v: 'Tropical' },
      { k: 'Type', v: 'Energy drink' },
    ],
    image: '/images/editions/tropical.webp',
    bg: '#052620',
    fg: '#f3efdf',
    accent: '#f6c533',
    rim: '#ffd25a',
  },
  {
    id: 'strawberry',
    name: 'Strawberry Apricot',
    backdrop: 'Strawberry',
    group: 'Energy editions',
    tagline: 'Strawberry and apricot in one can',
    copy: 'A deep burgundy can with the apricot line set in gold under the strawberry.',
    notes: [
      { k: 'Flavour', v: 'Strawberry, apricot' },
      { k: 'Type', v: 'Energy drink' },
    ],
    image: '/images/editions/strawberry.webp',
    bg: '#16070a',
    fg: '#f6e9e2',
    accent: '#f2b98c',
    rim: '#ff9e7a',
  },
  {
    id: 'red',
    name: 'Red Edition',
    backdrop: 'Red',
    group: 'Energy editions',
    tagline: 'The eagle’s own red',
    copy: 'The whole can in the red of the eagle, with the edition mark in white.',
    notes: [
      { k: 'Edition', v: 'Red' },
      { k: 'Type', v: 'Energy drink' },
    ],
    image: '/images/editions/red.webp',
    bg: '#190405',
    fg: '#f8e7e4',
    accent: '#ff5a47',
    rim: '#ff4535',
  },
  {
    id: 'coffee',
    name: 'Coffee Edition',
    backdrop: 'Coffee',
    group: 'Energy editions',
    tagline: 'Golden Eagle meets coffee',
    copy: 'A coffee edition in black and gold, with a gold eagle in place of the red one.',
    notes: [
      { k: 'Flavour', v: 'Coffee' },
      { k: 'Type', v: 'Energy drink' },
    ],
    image: '/images/editions/coffee.webp',
    bg: '#110c07',
    fg: '#f1e9d8',
    accent: '#e6c869',
    rim: '#f1cf6e',
  },
  {
    id: 'hydration',
    name: 'Hydration Tropical',
    backdrop: 'Hydration',
    group: 'Beyond energy',
    tagline: 'Minerals and B-complex',
    copy: 'A hydration drink rather than an energy drink, with minerals, B-complex vitamins and a tropical taste.',
    notes: [
      { k: 'With', v: 'Minerals, B-complex' },
      { k: 'Flavour', v: 'Tropical' },
    ],
    image: '/images/editions/hydration.webp',
    bg: '#efe7d4',
    fg: '#1b150c',
    accent: '#8a6414',
    rim: '#e3ad35',
    light: true,
  },
  {
    id: 'nonenergy',
    name: 'Non-Energy',
    backdrop: 'Zero',
    group: 'Beyond energy',
    tagline: '0% caffeine, 0% taurine',
    copy: 'Golden Eagle without caffeine or taurine, in electric blue.',
    notes: [
      { k: 'Caffeine', v: '0%' },
      { k: 'Taurine', v: '0%' },
    ],
    image: '/images/editions/nonenergy.webp',
    bg: '#e3e9f3',
    fg: '#0c1838',
    accent: '#1f4fd1',
    rim: '#3a6cf0',
    light: true,
  },
];

/** editions that are photographs (everything except the 3D Classic), in chapter order */
export const PHOTO_EDITIONS = EDITIONS.filter((e) => e.image);

/** photo framing produced by scripts/prepare-editions.mjs */
export const PHOTO_FRAME = { w: 360, h: 760, canTop: 40, canH: 680, canW: 264 };
