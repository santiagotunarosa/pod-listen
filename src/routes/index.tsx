import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { explainLine } from "@/lib/explain.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POD · Understand every podcast" },
      { name: "description", content: "POD explains what you just heard, in simpler words, the moment you tap your headphones. For ADHD, dyslexia and every mind that needs a second." },
      { property: "og:title", content: "POD · Understand every podcast" },
      { property: "og:description", content: "Podcasts move fast. Now you don’t have to. POD explains, saves and brings back the ideas that matter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EX = [
  { src: "Huberman Lab · Dopamine & motivation", line: "Dopamine is less about pleasure and more about motivation — the pursuit of reward.",
    simple: "Dopamine is your brain’s “go get it” signal. It makes you want to start something; it doesn’t make you feel good.", like: "the smell of food that makes you hungry before you eat.",
    simpler: "Dopamine is the wanting, not the having.", likeB: "wanting a gift is dopamine; opening it is the pleasure.", key: "Dopamine is wanting, not pleasure" },
  { src: "Jocko Podcast · Good — Bad — Good · takeaway (paraphrased)", line: "When life gets difficult, stop looking for someone to blame and start looking for what you can control.",
    simple: "When things go wrong, blaming others doesn’t fix anything. Look for the part you can change and start there.", like: "missing the bus: don’t blame the driver, leave five minutes earlier tomorrow.",
    simpler: "Fix what is yours to fix.", likeB: "you can’t control the rain, but you can bring an umbrella.", key: "Control what you can, drop the blame" },
  { src: "The Moth · takeaway (paraphrased)", line: "Everyone has a story that can change the way you see the world, if you’re willing to listen.",
    simple: "Every person has lived things you haven’t. If you really listen to them, their story can change how you think.", like: "a classmate’s story about moving countries changing how you see your own city.",
    simpler: "Listen to people. They can change your mind.", likeB: "one conversation with your grandparent can teach you more than a textbook chapter.", key: "Listening to stories widens your view" },
  { src: "Parts Unknown · takeaway (paraphrased)", line: "The world becomes bigger when you stop insisting on seeing it through your own perspective.",
    simple: "If you only judge things by your own habits, the world feels small. Try other people’s food, places and ideas, and it grows.", like: "trying a dish you’ve never heard of instead of ordering your usual.",
    simpler: "Step outside your routine to see more.", likeB: "taking a different street home and finding a new café.", key: "Other perspectives make the world bigger" },
];
const CHIPS = ["Huberman Lab", "Jocko Podcast", "The Moth", "Parts Unknown"];

function Logo() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" rx="28" fill="#1B1B1A" /><rect x="58" y="68" width="12" height="26" rx="6" fill="#F3F1EC" /><rect x="76" y="46" width="12" height="48" rx="6" fill="#CFE3D1" /><rect x="94" y="60" width="12" height="34" rx="6" fill="#F3F1EC" /></svg>
  );
}

type Note = { id: number; src: string; key: string; insight: string };
type Result = { simple: string; like: string; key: string };

function TrySection() {
  const [ex, setEx] = useState<number | null>(0);
  const [line, setLine] = useState(EX[0].line);
  const [src, setSrc] = useState(EX[0].src);
  const [level, setLevel] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveKey, setSaveKey] = useState("");
  const [insight, setInsight] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [micOK, setMicOK] = useState(false);
  const [listening, setListening] = useState(false);
  const insightRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMicOK(typeof window !== "undefined" && "webkitSpeechRecognition" in window);
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const pick = (i: number) => {
    setEx(i); setLine(EX[i].line); setSrc(EX[i].src);
    setResult(null); setStatus(null); setLevel(0);
    window.speechSynthesis?.cancel(); setSpeaking(false);
  };

  const run = async (lvl: number) => {
    const text = line.trim();
    if (!text) { setResult(null); setStatus("Type or pick a line first."); return; }
    setBusy(true); setResult(null); setStatus("Rewinding 15 seconds… explaining.");
    const wait = new Promise((r) => setTimeout(r, 700));
    let r: Result | null = null;
    if (ex !== null) {
      const e = EX[ex];
      r = lvl === 0 ? { simple: e.simple, like: e.like, key: e.key } : { simple: e.simpler, like: e.likeB, key: e.key };
      await wait;
    } else {
      try {
        const [res] = await Promise.all([explainLine({ data: { line: text, level: lvl } }), wait]);
        r = res;
      } catch {
        r = null;
      }
    }
    setBusy(false);
    if (!r) { setStatus("Try one of the example lines."); return; }
    setStatus(null); setLevel(lvl); setResult(r);
    speak(r.simple + " Like " + r.like);
  };

  const openSave = () => {
    const k = result?.key || (ex !== null ? EX[ex].key : line.trim().slice(0, 80));
    if (!k) return;
    setSaveKey(k); setSaving(true);
    setTimeout(() => document.getElementById("saveBox")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  const keep = () => {
    const s = src.includes(" · ") ? src.split(" · ")[0] : ex === null ? "Your podcast" : src;
    setNotes((n) => [{ id: Date.now(), src: s || "Your podcast", key: saveKey, insight: insight.trim() }, ...n]);
    setInsight(""); setSaving(false);
  };

  const mic = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInsight((v) => (v ? v + " " : "") + t);
    };
    rec.onend = () => { setListening(false); insightRef.current?.focus(); };
    setListening(true); rec.start();
  };

  return (
    <section className={"try" + (saving ? " saving" : "")} id="try" aria-labelledby="try-h">
      <div className="wrap">
        <div className="head">
          <div><span className="eyebrow">Try it · the AI moment</span><h2 id="try-h" style={{ marginTop: 16 }}>Didn’t get that? Tap Explain.</h2></div>
          <p>Pick a line from a podcast, or paste one you heard. POD explains it in simpler words, reads it to you, and lets you save it as your own idea.</p>
        </div>
        <div className="lab">
          <div className="panel in">
            <label className="lbl" htmlFor="line">What you just heard</label>
            <div className="chips" role="group" aria-label="Example lines">
              {CHIPS.map((c, i) => (
                <button key={c} className="chip" type="button" aria-pressed={ex === i} onClick={() => pick(i)}>{c}</button>
              ))}
            </div>
            <textarea id="line" rows={5} value={line} onChange={(e) => {
              setLine(e.target.value); setEx(null); setSrc("Your own line"); setResult(null); setLevel(0); setStatus(null);
            }} />
            <p className="src" id="src">{src}</p>
            <div className="row">
              <button className="btn btn-chalk" id="explain" type="button" disabled={busy} onClick={() => run(0)}>Explain it simpler</button>
              <button className="btn btn-ghost-s" id="save1" type="button" onClick={openSave}>Save idea</button>
            </div>
            <p className="hint" id="mode">Live AI explanations are on — paste any line you heard.</p>
          </div>
          <div className={"panel out" + (speaking ? " speaking" : "")} id="out" aria-live="polite">
            <div className="tag"><span>The teacher</span><span className="wave" aria-hidden="true">{Array.from({ length: 12 }).map((_, i) => <i key={i} />)}</span></div>
            {!result && <p className="empty" id="empty">{status ?? "Your simpler explanation appears here, and POD reads it aloud."}</p>}
            {result && <>
              <p className="simple" id="simple">{result.simple}</p>
              <div className="like" id="like"><span>Like</span><span id="likeT">{result.like}</span></div>
              <div className="acts" id="acts">
                <button className="btn btn-sep" id="again" type="button" disabled={level >= 1 || busy} onClick={() => run(1)}>Even simpler</button>
                <button className="btn btn-line" id="listen" type="button" onClick={() => speak(result.simple + " Like " + result.like)}>Read it to me</button>
                <button className="btn btn-line" id="save2" type="button" onClick={openSave}>Save this as an idea</button>
              </div>
            </>}
          </div>
        </div>
        <div className={"save" + (saving ? " on" : "")} id="saveBox" aria-live="polite">
          <div>
            <span className="tag">Idea saved · now say it your way</span>
            <p className="q" id="saveQ">{saveKey}</p>
            <p style={{ marginTop: 10, color: "var(--mint-ink)" }}>Why does it matter to you? Explaining it shows you really understood.</p>
          </div>
          <div>
            <label className="sr" htmlFor="insight">Your insight</label>
            <textarea id="insight" ref={insightRef} value={insight} onChange={(e) => setInsight(e.target.value)} placeholder="Type, or tap the mic and speak…" />
            <div className="row">
              <button className="btn btn-ink" id="keep" type="button" onClick={keep}>Save my insight</button>
              <button className="btn btn-ghost" id="mic" type="button" hidden={!micOK} onClick={mic} disabled={listening}>{listening ? "Listening…" : "Speak"}</button>
            </div>
          </div>
        </div>
        <div className="notes" id="notes" aria-live="polite">
          {notes.map((n) => (
            <div className="note" key={n.id}>
              <span className="k">{n.src}</span>
              <b>{n.key}</b>
              {n.insight && <p>“{n.insight}”</p>}
              <span className="when">Comes back tomorrow · then 3 days · 1 week · 1 month</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinSection() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const fd = new FormData(f);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const hard = fd.getAll("hard").map(String);
    if (!name) { setMsg("Add your first name so we know what to call you."); (f.elements.namedItem("name") as HTMLInputElement).focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setMsg("That email looks incomplete. Check it and try again."); (f.elements.namedItem("email") as HTMLInputElement).focus(); return; }
    setMsg(""); setBusy(true);
    const { error } = await supabase.from("waitlist").insert({ name: name.slice(0, 100), email, hard });
    setBusy(false);
    if (error && error.code !== "23505") { setMsg("Something went wrong. Please try again."); return; }
    setDone(name);
  };

  return (
    <section className="join" id="join" aria-labelledby="join-h">
      <div className="wrap">
        <div className="side">
          <span className="eyebrow">Early access</span>
          <h2 id="join-h">Be first to listen with POD.</h2>
          <p>Join the waitlist and help shape it. Tell us what makes podcasts hard for you, and we’ll build for that first.</p>
          <ul><li>✓ Free early access</li><li>✓ One email when it’s ready, nothing else</li><li>✓ Leave any time</li></ul>
        </div>
        <div>
          <form className="lead" id="lead" noValidate onSubmit={submit} hidden={done !== null}>
            <div><label htmlFor="name">First name</label><input type="text" id="name" name="name" autoComplete="given-name" required /></div>
            <div><label htmlFor="email">Email</label><input type="email" id="email" name="email" autoComplete="email" required /></div>
            <fieldset>
              <legend>What makes podcasts hard for you? <span style={{ fontWeight: 400, color: "var(--grey)" }}>(optional)</span></legend>
              <div className="checks">
                <label><input type="checkbox" name="hard" value="fast" /> They speak too fast</label>
                <label><input type="checkbox" name="hard" value="words" /> Difficult words</label>
                <label><input type="checkbox" name="hard" value="focus" /> I lose focus</label>
                <label><input type="checkbox" name="hard" value="forget" /> I forget it after</label>
                <label><input type="checkbox" name="hard" value="notes" /> Can’t take notes</label>
              </div>
            </fieldset>
            <button className="btn btn-ink" type="submit" id="submit" disabled={busy}>{busy ? "Saving…" : "Join the waitlist"}</button>
            <p className="formmsg" id="formmsg" role="status">{msg}</p>
          </form>
          <div className={"done" + (done !== null ? " on" : "")} id="done" role="status">
            <span className="eyebrow" style={{ color: "var(--mint-ink)" }}>You’re on the list</span>
            <p className="big" id="doneT">{done ? `Thanks, ${done}. You’re on the list.` : "Thanks. We’ll write when POD is ready."}</p>
            <p style={{ color: "var(--mint-ink)" }}>Meanwhile, try the Explain button above with a line from your favourite show.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <nav className="top" aria-label="Main">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="POD home"><Logo />POD</a>
          <div className="links"><a href="#problem">Why</a><a href="#how">How it works</a><a href="#try">Try it</a><a href="#proof">Research</a></div>
          <a className="btn btn-paper cta" href="#join">Join the waitlist</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap">
          <div>
            <span className="eyebrow">For ADHD, dyslexia and every mind that needs a second</span>
            <h1>Podcasts move fast.<br /><em>Now you don’t have to.</em></h1>
            <p className="lede">POD explains what you just heard, in simpler words, the moment you tap your headphones. Save the ideas that matter and it brings them back until you remember them.</p>
            <div className="actions">
              <a className="btn btn-paper" href="#join">Join the waitlist</a>
              <a className="btn btn-ghost-d" href="#try">Try it now</a>
            </div>
            <div className="gesture"><span><b>1 tap</b> · explain it simpler</span><span><b>2 taps</b> · save the idea</span><span><b>No notes</b> · hands-free</span></div>
          </div>
          <div className="phone" aria-label="POD player preview">
            <div className="meta"><span>Now playing</span><span>24:19 / 2:00:00</span></div>
            <div className="show"><div className="art" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CFE3D1" strokeWidth="1.8" strokeLinecap="round"><path d="M3 15v-3a9 9 0 0 1 18 0v3" /><path d="M21 15v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2zM3 15v3a2 2 0 0 0 2 2h2v-7H5a2 2 0 0 0-2 2z" /></svg></div><div><strong>Dopamine &amp; motivation</strong><span>Huberman Lab · Ep 127</span></div></div>
            <div className="karaoke" aria-hidden="true"><ol id="kar">
              <li>…and that baseline matters more than the peaks.</li>
              <li className="hl">Dopamine is less about pleasure and more about motivation.</li>
              <li>It’s the pursuit of reward — the wanting.</li>
              <li>When you stack too many rewards, the drive drops.</li>
              <li>…and that baseline matters more than the peaks.</li>
            </ol></div>
            <div className="bar"><i /></div>
            <div className="two"><div className="s"><b>Save idea</b><small>or 2 taps on your headphones</small></div><div className="e"><b>Explain</b><small>or 1 tap on your headphones</small></div></div>
          </div>
        </div>
      </header>

      <section className="problem" id="problem">
        <div className="wrap">
          <div className="head">
            <div><span className="eyebrow">The problem</span><h2 style={{ marginTop: 16 }}>Audio doesn’t wait for you.</h2></div>
            <p>People with ADHD, dyslexia and other learning difficulties struggle to follow podcasts: concepts are hard and the information moves faster than they can process. Today they pause to take notes, splitting their attention between listening, understanding and writing.</p>
          </div>
          <div className="stats">
            <div className="stat"><span className="n">88%</span><p>of US podcast listeners say they listen to learn.</p><cite>Pew Research Center, 2023</cite></div>
            <div className="stat"><span className="n">52%</span><p>say a major reason is having something on while doing something else.</p><cite>Pew Research Center, 2023</cite></div>
            <div className="stat"><span className="n">~½</span><p>of new information is forgotten within the first hour without review.</p><cite>Ebbinghaus, Memory, 1885</cite></div>
            <div className="stat"><span className="n">↓</span><p>Students who listened to a lecture podcast recalled less than students who read the same material.</p><cite>Daniel &amp; Woody, Teaching of Psychology, 2010</cite></div>
          </div>
          <div className="today">
            <strong style={{ fontSize: 20 }}>Today, people try to keep up by</strong>
            <div className="ico"><span className="x">pausing</span><span className="x">rewinding</span><span className="x">typing notes</span><span className="x">giving up</span></div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="wrap">
          <span className="eyebrow">How POD works</span>
          <h2 style={{ marginTop: 16, maxWidth: "16ch" }}>Listen. Understand. Connect. Remember.</h2>
          <div className="steps">
            <article className="step s1"><span className="k">01 · Listen</span><h3>Read along, hands-free</h3><p>The transcript follows the voice, one sentence at a time, so eyes can help the ears.</p><span className="tap">Black screen = just listening</span></article>
            <article className="step s2"><span className="k">02 · Understand</span><h3>Tap once. It explains.</h3><p>POD rewinds 15 seconds and explains it simpler, by voice. Still lost? It tries again with an everyday example.</p><span className="tap">Sepia = the AI teacher is talking</span></article>
            <article className="step s3"><span className="k">03 · Connect</span><h3>Ideas meet ideas</h3><p>Responsibility from Jocko, failure from The Diary of a CEO, motivation from Huberman: POD shows how what you saved fits together.</p><span className="tap">Your idea map</span></article>
            <article className="step s4"><span className="k">04 · Remember</span><h3>It comes back to you</h3><p>Tap twice to save, say it in your own words, and POD brings it back after 1 day, 3 days, 1 week and 1 month.</p><span className="tap">Mint = your notes</span></article>
          </div>
        </div>
      </section>

      <TrySection />

      <section className="benefits">
        <div className="wrap">
          <span className="eyebrow">Made for minds that work differently</span>
          <h2 style={{ marginTop: 16, maxWidth: "18ch" }}>Less to hold in your head. More that stays.</h2>
          <div className="bgrid">
            <div className="b"><span className="k">Hands-free</span><h3>Your headphones are the remote</h3><p>Tap to explain, double-tap to save. No unlocking, no typing, no lost thread.</p></div>
            <div className="b"><span className="k">Your level</span><h3>Explanations that meet you</h3><p>Plain words first, then a real-life example. You choose how simple “simple” is.</p></div>
            <div className="b"><span className="k">Spaced review</span><h3>1 day · 3 days · 1 week · 1 month</h3><p>Short reviews at the moments memory fades, until the idea is yours.</p></div>
            <div className="b"><span className="k">Free recall</span><h3>“What stayed with you?”</h3><p>After each episode you just talk. POD saves what you said and brings back what you missed.</p></div>
            <div className="b"><span className="k">It ends</span><h3>No endless feeds</h3><p>Ten idea clips, four-minute reviews, five-step setup. Clear finish lines make it easier to start.</p></div>
            <div className="b"><span className="k">Readable</span><h3>Designed for legibility</h3><p>Atkinson Hyperlegible type, no all-caps, calm colours, and every colour backed by a word or a symbol.</p></div>
          </div>
        </div>
      </section>

      <section className="proof" id="proof">
        <div className="wrap">
          <span className="eyebrow">Why it works</span>
          <h2 style={{ marginTop: 16, maxWidth: "18ch" }}>Built on how memory actually works.</h2>
          <div className="quotes">
            <div className="quote"><p>Retrieval beats re-reading. Trying to recall an idea strengthens memory more than seeing it again.</p><cite>Testing effect · Roediger &amp; Karpicke, 2006</cite></div>
            <div className="quote"><p>Forgetting is steepest in the first hours, which is why POD asks “what stayed with you?” the moment an episode ends.</p><cite>Forgetting curve · Ebbinghaus, 1885</cite></div>
            <div className="quote"><p>Explaining an idea in your own words reveals the gaps and makes it stick.</p><cite>Self-explanation · Chi et al., 1994</cite></div>
          </div>
          <div className="shows">
            <span className="eyebrow">Learn from the shows you already listen to</span>
            <ul><li>Huberman Lab</li><li>Jocko Podcast</li><li>The Moth</li><li>The Diary of a CEO</li><li>Lex Fridman Podcast</li><li>Modern Wisdom</li><li>TED Talks Daily</li><li>Parts Unknown</li></ul>
            <small>POD is a student concept. Show names are examples; POD is not affiliated with these podcasts.</small>
          </div>
        </div>
      </section>

      <JoinSection />

      <footer>
        <div className="wrap">
          <div className="grid">
            <div>
              <a className="brand" href="#top" style={{ color: "var(--paper)" }}><Logo />POD</a>
              <p style={{ marginTop: 14, maxWidth: "34ch" }}>Learn at your own pace. Understand every podcast, remember what matters.</p>
            </div>
            <div><h4>Explore</h4><ul><li><a href="#problem">The problem</a></li><li><a href="#how">How it works</a></li><li><a href="#try">Try it</a></li><li><a href="#join">Join the waitlist</a></li></ul></div>
            <div><h4>Sources</h4><ul>
              <li><a href="https://www.pewresearch.org/journalism/2023/04/18/podcasts-as-a-source-of-news-and-information/">Pew Research Center, Podcasts as a Source of News and Information (2023)</a></li>
              <li>Ebbinghaus, H. (1885). Memory: A Contribution to Experimental Psychology</li>
              <li>Daniel, D. B. &amp; Woody, W. D. (2010). They Hear, but Do Not Listen. Teaching of Psychology</li>
            </ul></div>
          </div>
          <div className="fine"><span>© 2026 POD · A concept by Santiago Tunarosa</span><span>Privacy: your email is used only to tell you when POD launches.</span></div>
        </div>
      </footer>
    </>
  );
}
