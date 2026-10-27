import { useEffect, useRef, useState, type ReactNode } from "react";
import { RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Landscape } from "./Landscape";
import { INTRO_DURATION, INTRO_STORAGE_KEY, progress, smooth } from "./timeline";
import "./intro.css";

type Mode = "checking" | "welcome" | "playing" | "home";

export function WeddingIntro({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("checking");
  const [time, setTime] = useState(0);
  const [reduced, setReduced] = useState(false);
  const beginRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    try { setMode(localStorage.getItem(INTRO_STORAGE_KEY) === "true" ? "home" : "welcome"); }
    catch { setMode("welcome"); }
    return () => query.removeEventListener("change", update);
  }, []);

  function finish() {
    try { localStorage.setItem(INTRO_STORAGE_KEY, "true"); } catch { /* Private browsers can still enter. */ }
    setMode("home");
    if (hasOpened.current) window.scrollTo({ top: 0, behavior: "instant" });
  }

  useEffect(() => {
    if (mode === "home" || mode === "checking") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [mode]);

  useEffect(() => {
    if (mode === "welcome") { hasOpened.current = true; beginRef.current?.focus(); }
    if (mode === "playing") skipRef.current?.focus();
    if (mode === "home" && hasOpened.current) replayRef.current?.focus({ preventScroll: true });
  }, [mode]);

  useEffect(() => {
    if (mode !== "playing") return;
    if (reduced) { setMode("welcome"); return; }
    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    const tick = (now: number) => {
      // Pause the story in background tabs rather than skipping unseen scenes.
      if (!document.hidden) elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      setTime(Math.min(elapsed, INTRO_DURATION));
      if (elapsed >= INTRO_DURATION) { finish(); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode, reduced]);

  const playing = mode === "playing";
  const announcementOpacity = smooth(progress(time, 14, 15.5)) * (1 - smooth(progress(time, 19, 20)));
  const endingOpacity = smooth(progress(time, 27, 28)) * (1 - smooth(progress(time, 29.3, 30)));
  return <>
    {mode === "home" && <>
      {children}
      <Button ref={replayRef} variant="ghost" className="intro-replay" onClick={() => { setTime(0); setMode("welcome"); }}><RotateCcw aria-hidden="true" /> Replay Intro</Button>
    </>}
    {mode !== "home" && <section className="wedding-intro" role="dialog" aria-modal="true" aria-label="Gowda × Malhotra illustrated introduction" onKeyDown={event => {
      if (event.key === "Escape") finish();
      if (event.key === "Tab") {
        if (playing) { event.preventDefault(); skipRef.current?.focus(); }
        else if (event.shiftKey && document.activeElement === beginRef.current) { event.preventDefault(); skipRef.current?.focus(); }
        else if (!event.shiftKey && document.activeElement === skipRef.current) { event.preventDefault(); beginRef.current?.focus(); }
      }
    }}>
      <Landscape time={time} playing={playing} />
      {(mode === "welcome" || mode === "checking") && <div className="intro-welcome">
        <p className="intro-brand">GOWDA × MALHOTRA</p>
        <h1>An adventure <em>worth celebrating.</em></h1>
        <div className="intro-actions">
          <Button ref={beginRef} size="lg" className="intro-begin" disabled={mode === "checking"} onClick={() => { if (reduced) finish(); else { setTime(0); setMode("playing"); } }}>BEGIN OUR ADVENTURE <ArrowRight aria-hidden="true" /></Button>
          <Button ref={skipRef} variant="ghost" className="intro-skip" onClick={finish}>SKIP INTRO</Button>
        </div>
        {reduced && <p className="intro-reduced-note">A still moment, before the adventure.</p>}
      </div>}
      {playing && <>
        <Button ref={skipRef} variant="ghost" className="intro-skip intro-playback-skip" onClick={finish}>Skip Intro</Button>
        {time >= 14 && time < 20 && <div className="intro-announcement" style={{ opacity: announcementOpacity }}>
          <p className="intro-label">SAVE THE DATE</p>
          <h2>Sharanya &amp; Sahil</h2>
          <p>Friday, October 8, 2027</p>
          <p>Loon Mountain · New Hampshire</p>
        </div>}
        {time >= 27 && <p className="intro-ending" style={{ opacity: endingOpacity }}>Always an adventure.</p>}
        <div className="intro-progress" style={{ width: `${time / INTRO_DURATION * 100}%` }} />
      </>}
    </section>}
  </>;
}