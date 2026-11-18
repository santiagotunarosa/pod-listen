# Pod Listen

Build a one-page marketing landing page for "POD", a podcast app concept for people with ADHD, dyslexia and learning difficulties. It is for a university final presentation TODAY, so fidelity matters more than creativity.

REPRODUCE THE HTML BELOW EXACTLY as a React + Tailwind page (you may keep the CSS as a global stylesheet / CSS module rather than converting every rule to Tailwind — visual result must be pixel-identical): same fonts (Google Fonts Atkinson Hyperlegible Next + Atkinson Hyperlegible Mono), same colours (ink #0E0E0E, sepia #2B2219, mint #CFE3D1, paper #F3F1EC, amber #D9A66B…), same copy word for word, same sections in the same order, same responsive breakpoints, same hero karaoke animation, same logo SVG. Single route "/". Page title "POD · Understand every podcast". No extra sections, no stock images, no emoji, no testimonials invented.

Functional requirements:
1. "Try it" section: example chips switch the line; "Explain it simpler" shows the simplified explanation + "Like …" comparison and reads it aloud with the browser SpeechSynthesis (rate 0.9) and animates the wave while speaking; "Even simpler" shows the second level; "Save idea"/"Save this as an idea" opens the mint save box (section background turns #24302A) with the key idea; "Save my insight" adds a rotated paper note card to the notes list. Use the pre-written EX examples from the script. ALSO enable Lovable Cloud + Lovable AI: when the user types their own line (no chip selected) call an edge function using Lovable AI (fast/cheap model) with the same prompt as in the script returning JSON {simple, like, key}; if AI fails, show the message "Try one of the example lines." For example chips, use the pre-written text (instant, no AI call). Mode hint text: "Live AI explanations are on — paste any line you heard."
2. Hide the "Speak" mic button (no dictation) unless the browser supports webkitSpeechRecognition; if it does, use it to fill the insight textarea.
3. Waitlist form: validate as in the script, then insert into a Lovable Cloud table `waitlist` (id uuid, name text, email text unique, hard text[], created_at timestamptz default now()). RLS: anonymous INSERT allowed, no public SELECT. On duplicate email still show the success state. Show the success state "Thanks, {name}. You're on the list." Remove the people-count line.
4. Remove all `window.claude` capability code (that was for another host).
5. Smooth-scroll anchor nav, sticky nav, visible focus styles, prefers-reduced-motion respected.

HTML SOURCE (the reference to reproduce):

```html
<nav class="top" aria-label="Main">
  <div class="wrap">
    <a class="brand" href="#top" aria-label="POD home">
      <svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" rx="28" fill="#1B1B1A"/><rect x="58" y="68" width="12" height="26" rx="6" fill="#F3F1EC"/><rect x="76" y="46" width="12" height="48" rx="6" fill="#CFE3D1"/><rect x="94" y="60" width="12" height="34" rx="6" fill="#F3F1EC"/></svg>
      POD
    </a>
    <div class="links">
      <a href="#problem">Why</a><a href="#how">How it works</a><a href="#try">Try it</a><a href="#proof">Research</a>
    </div>
    <a class="btn btn-paper cta" href="#join">Join the waitlist</a>
  </div>
</nav>

<header class="hero" id="top">
  <div class="wrap">
    <div>
      <span class="eyebrow">For ADHD, dyslexia and every mind that needs a second</span>
      <h1>Podcasts move fast.<br><em>Now you don’t have to.</em></h1>
      <p class="lede">POD explains what you just heard, in simpler words, the moment you tap your headphones. Save the ideas that matter and it brings them back until you remember them.</p>
      <div class="actions">
        <a class="btn btn-paper" href="#join">Join the waitlist</a>
        <a class="btn btn-ghost-d" href="#try">Try it now</a>
      </div>
      <div class="gesture"><span><b>1 tap</b> · explain it simpler</span><span><b>2 taps</b> · save the idea</span><span><b>No notes</b> · hands-free</span></div>
    </div>
    <div class="phone" aria-label="POD player preview">
      <div class="meta"><span>Now playing</span><span>24:19 / 2:00:00</span></div>
      <div class="show"><div class="art" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CFE3D1" stroke-width="1.8" stroke-linecap="round"><path d="M3 15v-3a9 9 0 0 1 18 0v3"/><path d="M21 15v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2zM3 15v3a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2z"/></svg></div><div><strong>Dopamine &amp; motivation</strong><span>Huberman Lab · Ep 127</span></div></div>
      <div class="karaoke" aria-hidden="true"><ol id="kar">
        <li>…and that baseline matters more than the peaks.</li>
        <li class="hl">Dopamine is less about pleasure and more about motivation.</li>
        <li>It’s the pursuit of reward — the wanting.</li>
        <li>When you stack too many rewards, the drive drops.</li>
        <li>…and that baseline matters more than the peaks.</li>
      </ol></div>
      <div class="bar"><i></i></div>
      <div class="two"><div class="s"><b>Save idea</b><small>or 2 taps on your headphones</small></div><div class="e"><b>Explain</b><small>or 1 tap on your headphones</small></div></div>
    </div>
  </div>
</header>

<section class="problem" id="problem">
  <div class="wrap">
    <div class="head">
      <div><span class="eyebrow">The problem</span><h2 style="margin-top:16px">Audio doesn’t wait for you.</h2></div>
      <p>People with ADHD, dyslexia and other learning difficulties struggle to follow podcasts: concepts are hard and the information moves faster than they can process. Today they pause to take notes, splitting their attention between listening, understanding and writing.</p>
    </div>
    <div class="stats">
      <div class="stat"><span class="n">88%</span><p>of US podcast listeners say they listen to learn.</p><cite>Pew Research Center, 2023</cite></div>
      <div class="stat"><span class="n">52%</span><p>say a major reason is having something on while doing something else.</p><cite>Pew Research Center, 2023</cite></div>
      <div class="stat"><span class="n">~½</span><p>of new information is forgotten within the first hour without review.</p><cite>Ebbinghaus, Memory, 1885</cite></div>
      <div class="stat"><span class="n">↓</span><p>Students who listened to a lecture podcast recalled less than students who read the same material.</p><cite>Daniel &amp; Woody, Teaching of Psychology, 2010</cite></div>
    </div>
    <div class="today">
      <strong style="font-size:20px">Today, people try to keep up by</strong>
      <div class="ico"><span class="x">pausing</span><span class="x">rewinding</span><span class="x">typing notes</span><span class="x">giving up</span></div>
    </div>
  </div>
</section>

<section class="how" id="how">
  <div class="wrap">
    <span class="eyebrow">How POD works</span>
    <h2 style="margin-top:16px;max-width:16ch">Listen. Understand. Connect. Remember.</h2>
    <div class="steps">
      <article class="step s1"><span class="k">01 · Listen</span><h3>Read along, hands-free</h3><p>The transcript follows the voice, one sentence at a time, so eyes can help the ears.</p><span class="tap">Black screen = just listening</span></article>
      <article class="step s2"><span class="k">02 · Understand</span><h3>Tap once. It explains.</h3><p>POD rewinds 15 seconds and explains it simpler, by voice. Still lost? It tries again with an everyday example.</p><span class="tap">Sepia = the AI teacher is talking</span></article>
      <article class="step s3"><span class="k">03 · Connect</span><h3>Ideas meet ideas</h3><p>Responsibility from Jocko, failure from The Diary of a CEO, motivation from Huberman: POD shows how what you saved fits together.</p><span class="tap">Your idea map</span></article>
      <article class="step s4"><span class="k">04 · Remember</span><h3>It comes back to you</h3><p>Tap twice to save, say it in your own words, and POD brings it back after 1 day, 3 days, 1 week and 1 month.</p><span class="tap">Mint = your notes</span></article>
    </div>
  </div>
</section>

<section class="try" id="try" aria-labelledby="try-h">
  <div class="wrap">
    <div class="head">
      <div><span class="eyebrow">Try it · the AI moment</span><h2 id="try-h" style="margin-top:16px">Didn’t get that? Tap Explain.</h2></div>
      <p>Pick a line from a podcast, or paste one you heard. POD explains it in simpler words, reads it to you, and lets you save it as your own idea.</p>
    </div>
    <div class="lab">
      <div class="panel in">
        <label class="lbl" for="line">What you just heard</label>
        <div class="chips" role="group" aria-label="Example lines">
          <button class="chip" type="button" data-ex="0" aria-pressed="true">Huberman Lab</button>
          <button class="chip" type="button" data-ex="1" aria-pressed="false">Jocko Podcast</button>
          <button class="chip" type="button" data-ex="2" aria-pressed="false">The Moth</button>
          <button class="chip" type="button" data-ex="3" aria-pressed="false">Parts Unknown</button>
        </div>
        <textarea id="line" rows="5"></textarea>
        <p class="src" id="src"></p>
        <div class="row">
          <button class="btn btn-chalk" id="explain" type="button">Explain it simpler</button>
          <button class="btn btn-ghost-s" id="save1" type="button">Save idea</button>
        </div>
        <p class="hint" id="mode">Live AI explanations are on.</p>
      </div>
      <div class="panel out" id="out" aria-live="polite">
        <div class="tag"><span>The teacher</span><span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
        <p class="empty" id="empty">Your simpler explanation appears here, and POD reads it aloud.</p>
        <p class="simple" id="simple" hidden></p>
        <div class="like" id="like" hidden><span>Like</span><span id="likeT"></span></div>
        <div class="acts" id="acts" hidden>
          <button class="btn btn-sep" id="again" type="button">Even simpler</button>
          <button class="btn btn-line" id="listen" type="button">Read it to me</button>
          <button class="btn btn-line" id="save2" type="button">Save this as an idea</button>
        </div>
      </div>
    </div>
    <div class="save" id="saveBox" aria-live="polite">
      <div>
        <span class="tag">Idea saved · now say it your way</span>
        <p class="q" id="saveQ"></p>
        <p style="margin-top:10px;color:var(--mint-ink)">Why does it matter to you? Explaining it shows you really understood.</p>
      </div>
      <div>
        <label class="sr" for="insight">Your insight</label>
        <textarea id="insight" placeholder="Type, or tap the mic and speak…"></textarea>
        <div class="row">
          <button class="btn btn-ink" id="keep" type="button">Save my insight</button>
          <button class="btn btn-ghost" id="mic" type="button" hidden>Speak</button>
        </div>
      </div>
    </div>
    <div class="notes" id="notes" aria-live="polite"></div>
  </div>
</section>

<section class="benefits">
  <div class="wrap">
    <span class="eyebrow">Made for minds that work differently</span>
    <h2 style="margin-top:16px;max-width:18ch">Less to hold in your head. More that stays.</h2>
    <div class="bgrid">
      <div class="b"><span class="k">Hands-free</span><h3>Your headphones are the remote</h3><p>Tap to explain, double-tap to save. No unlocking, no typing, no lost thread.</p></div>
      <div class="b"><span class="k">Your level</span><h3>Explanations that meet you</h3><p>Plain words first, then a real-life example. You choose how simple “simple” is.</p></div>
      <div class="b"><span class="k">Spaced review</span><h3>1 day · 3 days · 1 week · 1 month</h3><p>Short reviews at the moments memory fades, until the idea is yours.</p></div>
      <div class="b"><span class="k">Free recall</span><h3>“What stayed with you?”</h3><p>After each episode you just talk. POD saves what you said and brings back what you missed.</p></div>
      <div class="b"><span class="k">It ends</span><h3>No endless feeds</h3><p>Ten idea clips, four-minute reviews, five-step setup. Clear finish lines make it easier to start.</p></div>
      <div class="b"><span class="k">Readable</span><h3>Designed for legibility</h3><p>Atkinson Hyperlegible type, no all-caps, calm colours, and every colour backed by a word or a symbol.</p></div>
    </div>
  </div>
</section>

<section class="proof" id="proof">
  <div class="wrap">
    <span class="eyebrow">Why it works</span>
    <h2 style="margin-top:16px;max-width:18ch">Built on how memory actually works.</h2>
    <div class="quotes">
      <div class="quote"><p>Retrieval beats re-reading. Trying to recall an idea strengthens memory more than seeing it again.</p><cite>Testing effect · Roediger &amp; Karpicke, 2006</cite></div>
      <div class="quote"><p>Forgetting is steepest in the first hours, which is why POD asks “what stayed with you?” the moment an episode ends.</p><cite>Forgetting curve · Ebbinghaus, 1885</cite></div>
      <div class="quote"><p>Explaining an idea in your own words reveals the gaps and makes it stick.</p><cite>Self-explanation · Chi et al., 1994</cite></div>
    </div>
    <div class="shows">
      <span class="eyebrow">Learn from the shows you already listen to</span>
      <ul><li>Huberman Lab</li><li>Jocko Podcast</li><li>The Moth</li><li>The Diary of a CEO</li><li>Lex Fridman Podcast</li><li>Modern Wisdom</li><li>TED Talks Daily</li><li>Parts Unknown</li></ul>
      <small>POD is a student concept. Show names are examples; POD is not affiliated with these podcasts.</small>
    </div>
  </div>
</section>

<section class="join" id="join" aria-labelledby="join-h">
  <div class="wrap">
    <div class="side">
      <span class="eyebrow">Early access</span>
      <h2 id="join-h">Be first to listen with POD.</h2>
      <p>Join the waitlist and help shape it. Tell us what makes podcasts hard for you, and we’ll build for that first.</p>
      <ul><li>✓ Free early access</li><li>✓ One email when it’s ready, nothing else</li><li>✓ Leave any time</li></ul>
    </div>
    <div>
      <form class="lead" id="lead" novalidate>
        <div><label for="name">First name</label><input type="text" id="name" name="name" autocomplete="given-name" required></div>
        <div><label for="email">Email</label><input type="email" id="email" name="email" autocomplete="email" required></div>
        <fieldset>
          <legend>What makes podcasts hard for you? <span style="font-weight:400;color:var(--grey)">(optional)</span></legend>
          <div class="checks">
            <label><input type="checkbox" name="hard" value="fast"> They speak too fast</label>
            <label><input type="checkbox" name="hard" value="words"> Difficult words</label>
            <label><input type="checkbox" name="hard" value="focus"> I lose focus</label>
            <label><input type="checkbox" name="hard" value="forget"> I forget it after</label>
            <label><input type="checkbox" name="hard" value="notes"> Can’t take notes</label>
          </div>
        </fieldset>
        <button class="btn btn-ink" type="submit" id="submit">Join the waitlist</button>
        <p class="formmsg" id="formmsg" role="status"></p>
      </form>
      <div class="done" id="done" role="status">
        <span class="eyebrow" style="color:var(--mint-ink)">You’re on the list</span>
        <p class="big" id="doneT">Thanks. We’ll write when POD is ready.</p>
        <p style="color:var(--mint-ink)">Meanwhile, try the Explain button above with a line from your favourite show.</p>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="grid">
      <div>
        <a class="brand" href="#top" style="color:var(--paper)">[same logo svg, 32px]POD</a>
        <p style="margin-top:14px;max-width:34ch">Learn at your own pace. Understand every podcast, remember what matters.</p>
      </div>
      <div><h4>Explore</h4><ul><li><a href="#problem">The problem</a></li><li><a href="#how">How it works</a></li><li><a href="#try">Try it</a></li><li><a href="#join">Join the waitlist</a></li></ul></div>
      <div><h4>Sources</h4><ul>
        <li><a href="https://www.pewresearch.org/journalism/2023/04/18/podcasts-as-a-source-of-news-and-information/">Pew Research Center, Podcasts as a Source of News and Information (2023)</a></li>
        <li>Ebbinghaus, H. (1885). Memory: A Contribution to Experimental Psychology</li>
        <li>Daniel, D. B. &amp; Woody, W. D. (2010). They Hear, but Do Not Listen. Teaching of Psychology</li>
      </ul></div>
    </div>
    <div class="fine"><span>© 2026 POD · A concept by Santiago Tunarosa</span><span>Privacy: your email is used only to tell you when POD launches.</span></div>
  </div>
</footer>
```

CSS (use as-is, global):

```css
:root{--ink:#0E0E0E;--ink-2:#1B1B1A;--ink-3:#2C2C2A;--paper:#F3F1EC;--paper-2:#E8E5DD;--line:#D6D2C7;--mint:#CFE3D1;--mint-ink:#2F4A37;--sepia:#2B2219;--sepia-2:#3A2E22;--chalk:#F1E9DC;--amber:#D9A66B;--grey:#8C8A84;--grey-d:#A3A098;--sans:"Atkinson Hyperlegible Next","Atkinson Hyperlegible",system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"Atkinson Hyperlegible Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace;color-scheme:light}
*{box-sizing:border-box}[hidden]{display:none!important}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:18px;line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:inherit}
:focus-visible{outline:3px solid var(--amber);outline-offset:3px;border-radius:6px}
.wrap{max-width:1160px;margin:0 auto;padding:0 24px}
h1,h2,h3{text-wrap:balance;margin:0;font-weight:800;letter-spacing:-0.025em}
h2{font-size:clamp(34px,5vw,60px);line-height:1.02}
h3{font-size:22px;line-height:1.2;letter-spacing:-0.01em}
p{margin:0}
.eyebrow{font-family:var(--mono);font-size:14px;display:inline-flex;gap:10px;align-items:center}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:56px;padding:0 28px;border-radius:28px;font:700 17px/1 var(--sans);text-decoration:none;border:1.5px solid transparent;cursor:pointer;transition:transform .15s ease,background .2s ease}
.btn:hover{transform:translateY(-1px)}
.btn-paper{background:var(--paper);color:var(--ink)}.btn-ink{background:var(--ink);color:var(--paper)}
.btn-ghost-d{background:transparent;color:var(--paper);border-color:#55534D}
.btn-ghost{background:transparent;color:var(--ink);border-color:var(--ink)}
.btn-chalk{background:var(--chalk);color:var(--sepia)}
.btn-ghost-s{background:transparent;color:var(--chalk);border-color:#6B5A47}
.btn[disabled]{opacity:.5;cursor:default;transform:none}
nav.top{position:sticky;top:0;z-index:20;background:rgba(14,14,14,.92);backdrop-filter:blur(8px);color:var(--paper)}
nav.top .wrap{display:flex;align-items:center;gap:28px;height:68px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:800;letter-spacing:.12em;font-size:16px}
.brand svg{width:32px;height:32px}
nav.top .links{display:flex;gap:24px;margin-left:auto;font-size:15px}
nav.top .links a{text-decoration:none;color:var(--grey-d)}nav.top .links a:hover{color:var(--paper)}
nav.top .cta{min-height:42px;padding:0 18px;font-size:15px}
@media (max-width:760px){nav.top .links{display:none}nav.top .cta{margin-left:auto}}
.hero{background:var(--ink);color:var(--paper);padding:72px 0 88px}
.hero .wrap{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center}
@media (max-width:900px){.hero .wrap{grid-template-columns:1fr}}
.hero .eyebrow{color:var(--mint)}
.hero h1{font-size:clamp(46px,7.4vw,96px);line-height:.95;letter-spacing:-0.045em;margin:22px 0 26px}
.hero h1 em{font-style:normal;color:var(--mint)}
.hero .lede{font-size:21px;color:var(--grey-d);max-width:34ch}
.hero .actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}
.hero .gesture{margin-top:30px;display:flex;flex-wrap:wrap;gap:22px;font-family:var(--mono);font-size:14px;color:var(--grey-d)}
.hero .gesture b{color:var(--paper);font-weight:500}
.phone{background:var(--ink-2);border:1px solid var(--ink-3);border-radius:40px;padding:26px 22px 22px;max-width:380px;justify-self:center;width:100%;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.phone .meta{display:flex;justify-content:space-between;font-family:var(--mono);font-size:12px;color:var(--grey-d)}
.phone .show{display:flex;gap:12px;align-items:center;margin:18px 0 6px}
.phone .show .art{width:44px;height:44px;border-radius:6px;background:linear-gradient(135deg,#2C2C2A,#0E0E0E);display:grid;place-items:center}
.phone .show strong{font-size:16px;display:block}.phone .show span{font-family:var(--mono);font-size:12px;color:var(--grey-d)}
.karaoke{height:228px;overflow:hidden;position:relative;margin:14px 0 10px}
.karaoke ol{list-style:none;margin:0;padding:0 0 0 16px;border-left:3px solid var(--mint);animation:roll 11s cubic-bezier(.65,0,.35,1) infinite}
.karaoke li{font-size:22px;line-height:1.3;font-weight:700;color:#5C5B56;height:76px;display:flex;align-items:center;transition:color .4s}
.karaoke::after{content:"";position:absolute;inset:auto 0 0 0;height:70px;background:linear-gradient(transparent,var(--ink-2))}
.karaoke li.hl{color:var(--paper)}
@keyframes roll{0%,22%{transform:translateY(0)}27%,47%{transform:translateY(-76px)}52%,72%{transform:translateY(-152px)}77%,97%{transform:translateY(-228px)}100%{transform:translateY(0)}}
.bar{height:3px;background:var(--ink-3);border-radius:2px;margin:12px 0 8px;position:relative;overflow:hidden}.bar i{position:absolute;inset:0 auto 0 0;width:24%;background:var(--paper)}
.phone .two{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
.phone .two div{border-radius:14px;padding:14px;min-height:96px;display:flex;flex-direction:column;justify-content:space-between}
.phone .two .s{background:var(--mint);color:var(--ink)}.phone .two .e{background:var(--sepia-2);color:var(--chalk)}
.phone .two b{font-size:19px;font-weight:800}.phone .two small{font-family:var(--mono);font-size:11px;opacity:.8}
.problem{padding:110px 0 100px}
.problem .head{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:end}
@media (max-width:900px){.problem .head{grid-template-columns:1fr}}
.problem .head p{font-size:20px;color:#4A4944;max-width:46ch}
.stats{display:grid;grid-template-columns:repeat(4,1fr);margin-top:64px;border-top:1.5px solid var(--ink)}
@media (max-width:900px){.stats{grid-template-columns:1fr 1fr}}@media (max-width:520px){.stats{grid-template-columns:1fr}}
.stat{padding:26px 22px 8px 0;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:10px}.stat:last-child{border-right:0}
.stat .n{font-size:clamp(52px,6vw,76px);font-weight:800;letter-spacing:-0.05em;line-height:1;font-variant-numeric:tabular-nums}
.stat p{font-size:16px;max-width:26ch}.stat cite{font-family:var(--mono);font-style:normal;font-size:12px;color:var(--grey)}
.today{margin-top:56px;display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;background:var(--paper-2);border-radius:14px;padding:26px 28px}
.today .ico{display:flex;flex-wrap:wrap;gap:8px;font-family:var(--mono);font-size:14px}
.today .ico span{border:1.5px solid var(--ink);border-radius:20px;padding:6px 12px}.today .ico span.x{text-decoration:line-through;opacity:.5}
@media (max-width:700px){.today{grid-template-columns:1fr}}
.how{padding:0 0 110px}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:48px}
@media (max-width:900px){.steps{grid-template-columns:1fr 1fr}}@media (max-width:520px){.steps{grid-template-columns:1fr}}
.step{border-radius:16px;padding:24px;min-height:300px;display:flex;flex-direction:column;gap:14px}
.step .k{font-family:var(--mono);font-size:13px}.step h3{font-size:30px;font-weight:800;letter-spacing:-0.03em}.step p{font-size:16px}
.step .tap{margin-top:auto;font-family:var(--mono);font-size:13px;padding-top:14px;border-top:1px solid currentColor;opacity:.85}
.s1{background:var(--ink);color:var(--paper)}.s2{background:var(--sepia);color:var(--chalk)}.s2 .k{color:var(--amber)}.s3{background:var(--paper-2);color:var(--ink)}.s4{background:var(--mint);color:var(--ink)}
.try{background:var(--sepia);color:var(--chalk);padding:110px 0;transition:background .5s ease}.try.saving{background:#24302A}
.try .head{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:end}@media (max-width:900px){.try .head{grid-template-columns:1fr}}
.try .eyebrow{color:var(--amber)}.try .head p{font-size:19px;color:#D8CCB9;max-width:44ch}
.lab{margin-top:48px;display:grid;grid-template-columns:.95fr 1.05fr;gap:20px}@media (max-width:900px){.lab{grid-template-columns:1fr}}
.panel{border-radius:18px;padding:26px}.panel.in{background:var(--sepia-2)}
.panel.out{background:var(--chalk);color:var(--sepia);min-height:420px;display:flex;flex-direction:column;gap:16px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 16px}
.chip{font:500 14px/1 var(--mono);padding:10px 14px;border-radius:20px;border:1.5px solid #6B5A47;background:transparent;color:var(--chalk);cursor:pointer}
.chip[aria-pressed="true"]{background:var(--chalk);color:var(--sepia);border-color:var(--chalk)}
label.lbl{display:block;font-family:var(--mono);font-size:13px;color:var(--amber);margin-bottom:8px}
textarea,input[type=text],input[type=email]{width:100%;font:400 19px/1.5 var(--sans);color:inherit;background:transparent;border:1.5px solid #6B5A47;border-radius:12px;padding:14px 16px;resize:vertical}
.panel.in textarea{color:var(--chalk);min-height:150px}.panel.in .row{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
.src{font-family:var(--mono);font-size:13px;color:#B59B7E;margin-top:12px}
.out .tag{font-family:var(--mono);font-size:13px;color:#8A5A2B;display:flex;gap:10px;align-items:center}
.out .simple{font-size:clamp(24px,2.6vw,30px);font-weight:800;line-height:1.25;letter-spacing:-0.015em}
.out .like{display:grid;grid-template-columns:auto 1fr;gap:14px;font-size:18px;color:#5A4632}
.out .like span:first-child{font-family:var(--mono);font-size:14px;color:#8A5A2B;padding-top:3px}
.out .empty{color:#8A7863;font-size:18px;margin:auto 0}
.out .acts{margin-top:auto;display:flex;flex-wrap:wrap;gap:10px}.out .acts .btn{min-height:50px;font-size:16px;padding:0 20px}
.btn-sep{background:var(--sepia);color:var(--chalk)}.btn-line{background:transparent;color:var(--sepia);border-color:var(--sepia)}
.wave{display:flex;gap:4px;align-items:center;height:34px}.wave i{width:4px;border-radius:2px;background:#8A5A2B;height:8px}
.speaking .wave i{animation:w .9s ease-in-out infinite}
.wave i:nth-child(2n){animation-delay:.15s}.wave i:nth-child(3n){animation-delay:.3s}.wave i:nth-child(5n){animation-delay:.45s}
@keyframes w{0%,100%{height:8px}50%{height:30px}}
.save{margin-top:20px;background:var(--mint);color:var(--ink);border-radius:18px;padding:26px;display:none;gap:18px;grid-template-columns:1fr 1fr}.save.on{display:grid}
@media (max-width:900px){.save{grid-template-columns:1fr}}
.save .q{font-size:24px;font-weight:800;line-height:1.25}
.save textarea{border-color:#8FB597;font-family:var(--mono);font-size:18px;min-height:120px}
.save .tag{font-family:var(--mono);font-size:13px;color:var(--mint-ink)}.save .row{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
.notes{display:flex;flex-wrap:wrap;gap:16px;margin-top:22px}
.note{background:var(--paper);color:var(--ink);padding:18px;width:280px;box-shadow:0 6px 16px rgba(0,0,0,.25);transform:rotate(-1.2deg);display:flex;flex-direction:column;gap:10px}
.note:nth-child(2n){transform:rotate(1.4deg)}
.note .k{font-family:var(--mono);font-size:12px;color:var(--grey)}.note b{font-size:17px;line-height:1.3}.note p{font-family:var(--mono);font-size:15px;line-height:1.5}
.note .when{font-family:var(--mono);font-size:12px;color:#3D7A4F;border-top:1px dashed var(--line);padding-top:8px}
.hint{font-family:var(--mono);font-size:13px;color:#B59B7E;margin-top:14px}
.benefits{padding:110px 0}
.bgrid{display:grid;grid-template-columns:repeat(3,1fr);margin-top:56px;border-top:1.5px solid var(--ink)}
@media (max-width:900px){.bgrid{grid-template-columns:1fr 1fr}}@media (max-width:560px){.bgrid{grid-template-columns:1fr}}
.b{padding:28px 26px 30px 0;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:10px}
.b .k{font-family:var(--mono);font-size:13px;color:var(--grey)}.b p{font-size:17px;color:#4A4944;max-width:34ch}
.proof{background:var(--ink);color:var(--paper);padding:110px 0}.proof .eyebrow{color:var(--mint)}
.quotes{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:52px}@media (max-width:900px){.quotes{grid-template-columns:1fr}}
.quote{background:var(--ink-2);border:1px solid var(--ink-3);border-radius:16px;padding:26px;display:flex;flex-direction:column;gap:18px}
.quote p{font-size:21px;line-height:1.4;font-weight:700}.quote cite{font-family:var(--mono);font-style:normal;font-size:13px;color:var(--grey-d);margin-top:auto}
.shows{margin-top:64px;padding-top:28px;border-top:1px solid var(--ink-3)}
.shows ul{list-style:none;margin:18px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:12px 34px;font-size:clamp(20px,2.4vw,28px);font-weight:800;letter-spacing:-0.02em;color:#6E6C66}
.shows ul li:nth-child(3n+1){color:var(--paper)}
.shows small{display:block;margin-top:18px;font-family:var(--mono);font-size:12px;color:var(--grey)}
.join{background:var(--mint);padding:110px 0}
.join .wrap{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}@media (max-width:900px){.join .wrap{grid-template-columns:1fr}}
.join .eyebrow{color:var(--mint-ink)}.join h2{margin:18px 0 20px}
.join .side p{font-size:19px;color:var(--mint-ink);max-width:40ch}
.join .side ul{margin:26px 0 0;padding:0;list-style:none;font-family:var(--mono);font-size:15px;display:grid;gap:10px}
form.lead{background:var(--paper);border-radius:20px;padding:30px;display:grid;gap:18px;box-shadow:0 10px 30px rgba(47,74,55,.15)}
form.lead label{font-weight:700;font-size:16px;display:block;margin-bottom:8px}
form.lead input[type=text],form.lead input[type=email]{border-color:var(--line);font-size:18px}
form.lead input:focus{border-color:var(--ink);outline:none}
fieldset{border:0;padding:0;margin:0}legend{font-weight:700;font-size:16px;margin-bottom:10px;padding:0}
.checks{display:flex;flex-wrap:wrap;gap:8px}
.checks label{font:500 15px/1 var(--sans);border:1.5px solid var(--line);border-radius:22px;padding:11px 14px;cursor:pointer;display:inline-flex;gap:8px;align-items:center;margin:0}
.checks input{accent-color:var(--ink);width:18px;height:18px;margin:0}
.checks label:has(input:checked){background:var(--mint);border-color:var(--mint-ink)}
.formmsg{font-family:var(--mono);font-size:14px;min-height:1.4em}
.done{display:none;flex-direction:column;gap:14px}.done.on{display:flex}
.done .big{font-size:40px;font-weight:800;letter-spacing:-0.03em;line-height:1.05}
footer{background:var(--ink);color:var(--grey-d);padding:64px 0 48px;font-size:15px}
footer .grid{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:40px}@media (max-width:760px){footer .grid{grid-template-columns:1fr}}
footer h4{color:var(--paper);font-size:15px;margin:0 0 12px}footer ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
footer a{text-decoration:none}footer a:hover{color:var(--paper)}
footer .fine{margin-top:48px;padding-top:20px;border-top:1px solid var(--ink-3);font-family:var(--mono);font-size:12px;display:flex;flex-wrap:wrap;gap:12px 28px;justify-content:space-between}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
```

Demo data and behaviour (port to React state):

```js
const EX=[
 {src:"Huberman Lab · Dopamine & motivation", line:"Dopamine is less about pleasure and more about motivation — the pursuit of reward.",
  simple:"Dopamine is your brain’s “go get it” signal. It makes you want to start something; it doesn’t make you feel good.", like:"the smell of food that makes you hungry before you eat.",
  simpler:"Dopamine is the wanting, not the having.", likeB:"wanting a gift is dopamine; opening it is the pleasure.", key:"Dopamine is wanting, not pleasure"},
 {src:"Jocko Podcast · Good — Bad — Good · takeaway (paraphrased)", line:"When life gets difficult, stop looking for someone to blame and start looking for what you can control.",
  simple:"When things go wrong, blaming others doesn’t fix anything. Look for the part you can change and start there.", like:"missing the bus: don’t blame the driver, leave five minutes earlier tomorrow.",
  simpler:"Fix what is yours to fix.", likeB:"you can’t control the rain, but you can bring an umbrella.", key:"Control what you can, drop the blame"},
 {src:"The Moth · takeaway (paraphrased)", line:"Everyone has a story that can change the way you see the world, if you’re willing to listen.",
  simple:"Every person has lived things you haven’t. If you really listen to them, their story can change how you think.", like:"a classmate’s story about moving countries changing how you see your own city.",
  simpler:"Listen to people. They can change your mind.", likeB:"one conversation with your grandparent can teach you more than a textbook chapter.", key:"Listening to stories widens your view"},
 {src:"Parts Unknown · takeaway (paraphrased)", line:"The world becomes bigger when you stop insisting on seeing it through your own perspective.",
  simple:"If you only judge things by your own habits, the world feels small. Try other people’s food, places and ideas, and it grows.", like:"trying a dish you’ve never heard of instead of ordering your usual.",
  simpler:"Step outside your routine to see more.", likeB:"taking a different street home and finding a new café.", key:"Other perspectives make the world bigger"}
];
// Typing in the textarea deselects chips and sets src to "Your own line".
// Explain: show "Rewinding 15 seconds… explaining." briefly (~700ms), then result. Speak simple + " Like " + like.
// "Even simpler" disabled after level 1.
// AI prompt for own lines: "You help people with ADHD, dyslexia or other learning difficulties understand podcasts. Explain the line below in plain, friendly words (max 2 short sentences, under 35 words) [level 1: EVEN MORE simply, in one short sentence a 12-year-old understands]. Then give one everyday comparison (under 20 words, no starting word like 'Like'). Also give a key idea of max 7 words. No jargon, no lists. Reply ONLY as JSON: {simple, like, key}."
// Save note: source = first part of src before " · " (or "Your podcast"), bold key idea, optional “insight” in mono, footer "Comes back tomorrow · then 3 days · 1 week · 1 month". Newest first.
// Form errors: "Add your first name so we know what to call you." / "That email looks incomplete. Check it and try again." Button shows "Saving…" while submitting.
```

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pod-listen.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2d56a2f9-ce18-4f86-a217-12431a6d5e54).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
