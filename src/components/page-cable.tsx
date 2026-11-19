import { useEffect, useRef } from 'react';

// One continuous earphone cable. It starts at the jack of the hero earphones and runs down the page,
// sweeping across the gap between each section. The loops get fewer as you go down: it untangles.
// Where the jack is in tangled-earphones.png (fraction of the image's width / height).
const JACK = { u: 178 / 1224, v: 1154 / 1285 };
const LOOPS = [3, 2, 1, 1, 0, 0]; // loops in each sweep, top to bottom

type Pt = [number, number];

function sweep(pts: Pt[], from: Pt, to: Pt, loops: number, r: number, amp: number, seed: number) {
  const dir = Math.sign(to[0] - from[0]) || 1;
  const steps = 260;
  // loops sit together, a bit off-centre, so they read as one small knot
  const centres = Array.from({ length: loops }, (_, i) => 0.55 + (i - (loops - 1) / 2) * 0.06 + (seed % 2 ? 0.08 : -0.08));
  for (let i = 1; i <= steps; i++) {
    const s = i / steps;
    const ease = s * s * (3 - 2 * s);
    let x = from[0] + (to[0] - from[0]) * s;
    let y = from[1] + (to[1] - from[1]) * ease + Math.sin(s * Math.PI * 2 + seed) * amp * Math.sin(s * Math.PI);
    centres.forEach((c, j) => {
      const w = 0.045;
      const t = (s - c) / w;
      if (t > -0.5 && t < 0.5) {
        const th = (t + 0.5) * Math.PI * 2;
        const rr = r * (1 - j * 0.12);
        x += -dir * rr * Math.sin(th);
        y += -rr * (1 - Math.cos(th)) * 0.9;
      }
    });
    pts.push([x, y]);
  }
}

export function PageCable() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    const svg = svgRef.current, path = pathRef.current;
    const main = svg?.parentElement;
    if (!svg || !path || !main) return;
    let lengths: number[] = [], reach: number[] = [], total = 0, frame = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const build = () => {
      const img = main.querySelector<HTMLImageElement>('.earphones');
      const sections = Array.from(main.children).filter(el => el !== svg && !el.classList.contains('hero')) as HTMLElement[];
      if (!img || !img.complete || !sections.length) return;
      const base = main.getBoundingClientRect();
      const W = main.clientWidth;
      const H = main.scrollHeight;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.style.height = H + 'px';
      // jack position: image centre + rotated offset
      const box = img.getBoundingClientRect();
      const m = new DOMMatrixReadOnly(getComputedStyle(img).transform === 'none' ? undefined : getComputedStyle(img).transform);
      const ox = (JACK.u - 0.5) * img.offsetWidth, oy = (JACK.v - 0.5) * img.offsetHeight;
      const jack: Pt = [box.left + box.width / 2 - base.left + m.a * ox + m.c * oy, box.top + box.height / 2 - base.top + m.b * ox + m.d * oy];
      // the middle of the white space above each section
      const gaps = sections.map((sec, i) => {
        const prev = (sections[i - 1] || main.querySelector('.hero')) as HTMLElement;
        const top = sec.getBoundingClientRect().top - base.top;
        const above = parseFloat(getComputedStyle(prev).paddingBottom) || 0;
        const below = parseFloat(getComputedStyle(sec).paddingTop) || 0;
        return { y: top + (below - above) / 2, room: above + below };
      });
      const pts: Pt[] = [jack];
      // from the jack, drop down-left into the first gap
      const g0 = gaps[0];
      const first: Pt = [Math.max(16, jack[0] - W * 0.18), g0.y];
      for (let i = 1; i <= 40; i++) { const s = i / 40; pts.push([jack[0] + (first[0] - jack[0]) * Math.sin(s * Math.PI / 2), jack[1] + (first[1] - jack[1]) * (1 - Math.cos(s * Math.PI / 2))]); }
      let side = 1; // heading right first
      gaps.forEach((g, i) => {
        const start = pts[pts.length - 1];
        const r = Math.max(14, Math.min(48, g.room / 5, W / 22));
        const amp = Math.min(g.room / 6, 40);
        const end: Pt = [side > 0 ? W + 40 : -40, g.y + (i % 2 ? -1 : 1) * amp * 0.4];
        if (i > 0) pts.push([start[0], g.y], [start[0], g.y]);
        sweep(pts, i > 0 ? [start[0], g.y] : start, end, LOOPS[Math.min(i, LOOPS.length - 1)], r, amp, i);
        side = -side;
      });
      path.setAttribute('d', 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'));
      // map how far down the page each length of cable reaches
      total = path.getTotalLength();
      lengths = []; reach = [];
      let maxY = 0;
      for (let i = 0; i <= 600; i++) { const l = (total * i) / 600; const p = path.getPointAtLength(l); maxY = Math.max(maxY, p.y); lengths.push(l); reach.push(maxY); }
      path.style.strokeDasharray = `${total} ${total}`;
      draw();
    };
    const draw = () => {
      frame = 0;
      if (!total) return;
      if (reduce) { path.style.strokeDashoffset = '0'; return; }
      const line = window.scrollY + window.innerHeight * 0.7 - (main.getBoundingClientRect().top + window.scrollY);
      let shown = 0;
      for (let i = 0; i < reach.length; i++) { if (reach[i] <= line) shown = lengths[i]; else break; }
      path.style.strokeDashoffset = String(total - shown);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(draw); };
    let resizeTimer = 0;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(build, 150); };
    const img = main.querySelector<HTMLImageElement>('.earphones');
    img?.addEventListener('load', build);
    build();
    const ro = new ResizeObserver(onResize); ro.observe(main);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.fonts?.ready.then(build);
    return () => { img?.removeEventListener('load', build); ro.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); clearTimeout(resizeTimer); };
  }, []);
  return <svg ref={svgRef} className="page-cable" aria-hidden="true" fill="none"><path ref={pathRef} /></svg>;
}
