import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollFade — wraps any children and animates them in when they enter the viewport.
 * Props:
 *  delay     — seconds before animation starts (for staggering siblings)
 *  duration  — animation duration in seconds
 *  y         — starting y offset in px
 *  blur      — starting blur in px (0 = disabled)
 *  className — forwarded to wrapper div
 *  as        — HTML tag for wrapper (default "div")
 */
export default function ScrollFade({
  children,
  delay = 0,
  duration = 0.65,
  y = 36,
  blur = 0,
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars = {
      opacity: 0,
      y,
      ...(blur > 0 ? { filter: `blur(${blur}px)` } : {}),
    };

    const toVars = {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      ...(blur > 0 ? { filter: 'blur(0px)' } : {}),
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    };

    gsap.fromTo(el, fromVars, toVars);

    return () => {
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === el)
        .forEach((t) => t.kill());
    };
  }, [delay, duration, y, blur]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
