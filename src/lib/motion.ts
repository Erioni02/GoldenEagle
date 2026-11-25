import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/** the one easing curve used by every UI motion on the site */
export const EASE = 'ge';
CustomEase.create(EASE, '0.22,1,0.36,1');
gsap.defaults({ ease: EASE, duration: 0.5 });

/** shared navigation anchors, populated by the journey builder */
export const anchors: { current: null | Record<string, number | ((i: number) => number)> } = { current: null };

/**
 * Scroll reveals, each plays once:
 *  [data-reveal="words"]  masked word rise for display headlines (needs <Words/> markup)
 *  [data-reveal="fade"]   fade and 12px rise
 *  [data-reveal="group"]  children with [data-reveal-item] fade in sequence
 */
export function initReveals(root: HTMLElement, reduced: boolean) {
  const ctx = gsap.context(() => {
    const words = gsap.utils.toArray<HTMLElement>('[data-reveal="words"]', root);
    const fades = gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]', root);
    const groups = gsap.utils.toArray<HTMLElement>('[data-reveal="group"]', root);

    if (reduced) {
      gsap.set([...words, ...fades, ...groups], { autoAlpha: 1 });
      gsap.set(root.querySelectorAll('[data-reveal-item]'), { autoAlpha: 1 });
      return;
    }

    words.forEach((el) => {
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        el.querySelectorAll('.split-word'),
        { yPercent: 105 },
        { yPercent: 0, duration: 0.8, stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 86%', once: true } },
      );
    });

    fades.forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
      );
    });

    groups.forEach((el) => {
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        el.querySelectorAll('[data-reveal-item]'),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 84%', once: true } },
      );
    });
  }, root);
  return () => ctx.revert();
}
