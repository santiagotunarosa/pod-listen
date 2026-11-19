import { useEffect, useRef } from 'react';

// The earphone cable that follows you down the page.
// level 5 = a messy knot, level 0 = almost straight, so the cable "untangles" as you scroll.
const W = 1440, H = 280;

function rng(seed: number) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
}

// A pen walks left to right. At each knot point it curls round in a loop; the higher the level,
// the more loops, the bigger they are and the more they pile on top of each other.
function buildPath(level: number, seed: number) {
  const rand = rng(seed);
  const mid = H / 2;
  const count = [0, 1, 2, 4, 6, 10][level];
  const span = [0, 0.1, 0.22, 0.3, 0.36, 0.42][level];
  const centre = [0.5, 0.62, 0.3, 0.68, 0.36, 0.42][level]; // knots alternate sides as you scroll
  const knots = Array.from({ length: count }, (_, i) => W * (centre - span / 2 + span * (count === 1 ? 0.5 : i / (count - 1)) + (rand() - 0.5) * 0.04)).sort((a, b) => a - b);
  let x = -30, y = mid, heading = 0, curl = 0, turnLeft = 0, next = 0, guard = 0;
  const pts: [number, number][] = [[x, y]];
  const stop = level === 0 ? W * 0.86 : W + 40;
  while (x < stop && guard++ < 8000) {
    if (turnLeft <= 0 && next < knots.length && x >= knots[next]) {
      next++;
      turnLeft = Math.PI * 2 * (0.95 + rand() * 0.5);
      curl = (rand() < 0.5 ? -1 : 1) * (0.04 + rand() * 0.07);
    }
    if (turnLeft > 0) {
      const k = curl * (1 + (rand() - 0.5) * 0.9) * (1 + Math.sin(turnLeft * 1.3) * 0.35);
      heading += k; turnLeft -= Math.abs(k);
    } else {
      heading += (rand() - 0.5) * 0.05 * (1 + level * 0.4);
      const want = Math.atan2((mid + Math.sin(x / 170) * (level === 0 ? 14 : 6 + level * 4) - y) * 0.03, 1);
      let d = want - heading; d = Math.atan2(Math.sin(d), Math.cos(d)); heading += d * 0.12;
    }
    // in big knots, loops pile straight onto each other
    if (turnLeft <= 0 && next > 0 && next < knots.length && level >= 3 && rand() < 0.04 * level) knots[next] = Math.min(knots[next], x);
    x += Math.cos(heading) * 4; y += Math.sin(heading) * 4;
    pts.push([x, y]);
  }
  return 'M' + pts.filter((_, i) => i % 2 === 0 || i === pts.length - 1).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
}

const PATHS = [0, 1, 2, 3, 4, 5].map(l => buildPath(l, 11 + l * 7));
const END = PATHS[0].split(' L').pop()!.split(' ').map(Number);

export function ScrollCable({ level, plug = false }: { level: number; plug?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--draw', '1'); return; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts drawing when the cable enters the bottom of the screen, done by ~40% from the top.
      const p = Math.min(1, Math.max(0, (vh - box.top) / (vh * 0.6)));
      el.style.setProperty('--draw', p.toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <div className={'cable-divider' + (plug ? ' with-plug' : '')} ref={ref} aria-hidden="true">
    <svg viewBox={`0 0 ${W} ${H}`} fill="none">
      <path className="cable-line" pathLength="1" d={PATHS[Math.max(0, Math.min(5, level))]} />
      {plug && <g className="cable-plug" transform={`translate(${END[0]} ${END[1]})`}><rect x="0" y="-8" width="40" height="16" rx="3"/><path d="M8 -8 V8 M14 -8 V8"/><path className="pin" d="M40 0 H72"/><circle cx="74" cy="0" r="3"/></g>}
    </svg>
  </div>;
}
