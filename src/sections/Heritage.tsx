import { Words } from '../components/Words';

const MILESTONES = [
  {
    year: '1994',
    title: 'Frutex is founded',
    text: 'A drinks company sets up in Kosovo, starting out as a maker of juices.',
  },
  {
    year: '2006',
    title: 'Golden Eagle launches',
    text: 'The energy drink arrives in its gold and royal-blue can and becomes the Frutex flagship.',
  },
  {
    year: 'Today',
    title: 'Eight editions',
    text: 'Sugar Free, Tropical, Strawberry Apricot, Red and Coffee editions, plus Hydration and a non-energy can, sit alongside the Classic.',
  },
];

export function Heritage() {
  return (
    <section
      id="heritage"
      data-tone="light"
      className="relative z-[3] overflow-hidden bg-paper"
      style={{ ['--fg' as string]: '#1d1d1f', ['--accent' as string]: '#8a6414', color: 'var(--fg)' }}
      aria-labelledby="heritage-title"
    >
      <div className="px-[var(--gutter)] pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <p className="eyebrow mb-4" data-reveal="fade">
              Heritage
            </p>
            <Words
              as="h2"
              id="heritage-title"
              data-reveal="words"
              text={'Made in Kosovo,\ncarried across borders'}
              className="display-l invisible"
            />
          </div>
          <p className="lede md:col-span-4 md:self-end" data-reveal="fade">
            Golden Eagle is the flagship brand of Frutex, a Kosovar drinks company founded in 1994. The energy drink arrived in 2006, and the gold
            can now reaches shelves well beyond Kosovo.
          </p>
        </div>

        <ol className="mt-20 md:mt-24" data-reveal="group">
          {MILESTONES.map((m) => (
            <li
              key={m.year}
              data-reveal-item
              className="grid gap-3 border-t border-[color-mix(in_oklab,var(--fg)_10%,transparent)] py-8 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <span className="font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[0.9] tracking-[-0.045em] tabular-nums md:col-span-4">{m.year}</span>
              <h3 className="font-display text-[clamp(1.375rem,2vw,1.875rem)] font-semibold leading-tight tracking-[-0.025em] md:col-span-4 md:pt-2">{m.title}</h3>
              <p className="lede max-w-[30rem] md:col-span-4 md:pt-2">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
