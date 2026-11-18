import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { explainLine } from "@/lib/explain.functions";
import { Button } from "@/components/ui/button";
import { Logo, Hero, Problem, Introducing, How, Features, JoinHeading, Footer, EditorialMotion, supportLine } from "@/components/pod-editorial";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POD — Podcasts move fast. Now you don't have to." },
      { name: "description", content: supportLine },
      { property: "og:title", content: "POD — Podcasts move fast. Now you don't have to." },
      { property: "og:description", content: supportLine },
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
const exAt = (i: number) => EX[i] ?? EX[0] ?? { src: "Your podcast", line: "", simple: "", like: "", simpler: "", likeB: "", key: "" };
const CHIPS = ["Huberman Lab", "Jocko Podcast", "The Moth", "Parts Unknown"];

type Note = { id: number; src: string; key: string; insight: string };
type Result = { simple: string; like: string; key: string };

function TrySection() {
  const [ex, setEx] = useState<number | null>(0);
  const [line, setLine] = useState(exAt(0).line);
  const [src, setSrc] = useState(exAt(0).src);
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
    setEx(i); setLine(exAt(i).line); setSrc(exAt(i).src);
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
      const e = exAt(ex);
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
    const k = result?.key || (ex !== null ? exAt(ex).key : line.trim().slice(0, 80));
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
          <div><span className="eyebrow">Try it — the AI moment</span><h2 className="reveal" id="try-h">Didn't get that? Tap Explain.</h2></div>
          <p>Pick a line from a podcast, or paste one you heard. POD explains it in simpler words, reads it to you, and lets you save it as your own idea.</p>
        </div>
        <div className="lab">
          <div className="panel in">
            <label className="lbl" htmlFor="line">What you just heard</label>
            <div className="chips" role="group" aria-label="Example lines">
              {CHIPS.map((c, i) => (
                <Button variant="editorial" key={c} className="chip" type="button" aria-pressed={ex === i} onClick={() => pick(i)}>{c}</Button>
              ))}
            </div>
            <textarea id="line" rows={5} value={line} onChange={(e) => {
              setLine(e.target.value); setEx(null); setSrc("Your own line"); setResult(null); setLevel(0); setStatus(null);
            }} />
            <p className="src" id="src">{src}</p>
            <div className="row">
              <Button variant="editorial" className="btn btn-chalk" id="explain" type="button" disabled={busy} onClick={() => run(0)}>Explain it simpler</Button>
              <Button variant="editorial" className="btn btn-ghost-s" id="save1" type="button" onClick={openSave}>Save idea</Button>
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
                <Button variant="editorial" className="btn btn-sep" id="again" type="button" disabled={level >= 1 || busy} onClick={() => run(1)}>Even simpler</Button>
                <Button variant="editorial" className="btn btn-line" id="listen" type="button" onClick={() => speak(result.simple + " Like " + result.like)}>Read it to me</Button>
                <Button variant="editorial" className="btn btn-line" id="save2" type="button" onClick={openSave}>Save this as an idea</Button>
              </div>
            </>}
          </div>
        </div>
        <div className={"save" + (saving ? " on" : "")} id="saveBox" aria-live="polite">
          <div>
            <span className="tag">Idea saved · now say it your way</span>
            <p className="q" id="saveQ">{saveKey}</p>
            <p className="save-context">Why does it matter to you? Explaining it shows you really understood.</p>
          </div>
          <div>
            <label className="sr" htmlFor="insight">Your insight</label>
            <textarea id="insight" ref={insightRef} value={insight} onChange={(e) => setInsight(e.target.value)} placeholder="Type, or tap the mic and speak…" />
            <div className="row">
              <Button variant="editorial" className="btn btn-ink" id="keep" type="button" onClick={keep}>Save my insight</Button>
              <Button variant="editorial" className="btn btn-ghost" id="mic" type="button" hidden={!micOK} onClick={mic} disabled={listening}>{listening ? "Listening…" : "Speak"}</Button>
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
        <JoinHeading />
        <div>
          <form className="lead" id="lead" noValidate onSubmit={submit} hidden={done !== null}>
            <div><label htmlFor="name">First name</label><input type="text" id="name" name="name" autoComplete="given-name" required /></div>
            <div><label htmlFor="email">Email</label><input type="email" id="email" name="email" autoComplete="email" required /></div>
            <fieldset>
              <legend>What makes podcasts hard for you? <span className="optional">(optional)</span></legend>
              <div className="checks">
                <label><input type="checkbox" name="hard" value="fast" /> They speak too fast</label>
                <label><input type="checkbox" name="hard" value="words" /> Difficult words</label>
                <label><input type="checkbox" name="hard" value="focus" /> I lose focus</label>
                <label><input type="checkbox" name="hard" value="forget" /> I forget it after</label>
                <label><input type="checkbox" name="hard" value="notes" /> Can’t take notes</label>
              </div>
            </fieldset>
            <Button variant="editorial" className="btn btn-ink" type="submit" id="submit" disabled={busy}>{busy ? "Saving…" : "Join the waitlist"}</Button>
            <p className="formmsg" id="formmsg" role="status">{msg}</p>
            <p className="eyebrow email-promise">One email when it's ready. Nothing else.</p>
          </form>
          <div className={"done" + (done !== null ? " on" : "")} id="done" role="status">
            <span className="eyebrow">You’re on the list</span>
            <p className="big" id="doneT">{done ? `Thanks, ${done}. You’re on the list.` : "Thanks. We’ll write when POD is ready."}</p>
            <p>Meanwhile, try the Explain button above with a line from your favourite show.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return <>
    <EditorialMotion />
    <nav className="top" aria-label="Main"><div className="wrap"><a className="brand" href="#top" aria-label="POD home"><Logo />POD</a><div className="links"><a href="#problem">The problem</a><a href="#how">How it works</a><a href="#try">Try it</a><a href="#join">Join</a></div><Button asChild variant="ink" className="cta"><a href="#join">Join the waitlist</a></Button></div></nav>
    <main><Hero /><Problem /><Introducing /><How /><Features /><TrySection /><JoinSection /></main>
    <Footer />
  </>;
}
