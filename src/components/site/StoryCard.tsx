import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { Story } from "./wedding-content";

/**
 * A single storybook card: photograph side and story side, joined by a slow
 * horizontal flip. Hover flips it on a mouse; a tap flips it on a touch screen.
 *
 * Layout: one card per row below 768px, two from 768px, four from 1200px.
 * From 768px up the card typography steps down so the smaller cards stay legible
 * without clipping; the full story always opens in the comfortable reader.
 */
export function StoryCard({ story }: { story: Story }) {
  const [flipped, setFlipped] = useState(false);
  const [reading, setReading] = useState(false);
  const [focusTo, setFocusTo] = useState<"front" | "back" | null>(null);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusTo === "back") backRef.current?.focus();
    if (focusTo === "front") frontRef.current?.focus();
    setFocusTo(null);
  }, [focusTo]);

  // Only a real mouse hovers: a finger scrolling past must never flip a card.
  const onHover = (e: ReactPointerEvent<HTMLDivElement>, next: boolean) => {
    if (e.pointerType === "mouse") setFlipped(next);
  };

  return (
    <div
      className="story-scene aspect-square"
      onPointerEnter={(e) => onHover(e, true)}
      onPointerLeave={(e) => onHover(e, false)}
    >
      <div className={cn("story-card", flipped && "is-flipped")}>
        {/* ---------------- PHOTOGRAPH SIDE ---------------- */}
        <div className="story-face" inert={flipped} aria-hidden={flipped}>
          {story.photo ? (
            <img
              src={story.photo.url}
              alt={story.photo.alt}
              width={story.photo.width}
              height={story.photo.height}
              loading="lazy"
              style={story.photo.objectPosition ? { objectPosition: story.photo.objectPosition } : undefined}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="placeholder-frame h-full w-full">
              <span className="eyebrow absolute left-5 top-5 text-muted-foreground min-[768px]:left-3 min-[768px]:top-3 min-[768px]:text-[0.5rem]">
                Photograph to come
              </span>
            </div>
          )}
          <div className="bg-image-veil pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 min-[768px]:gap-3 min-[768px]:p-4">
            <div className="min-w-0">
              <p className="eyebrow text-ivory/70 min-[768px]:text-[0.5rem]">{story.n}</p>
              <h3 className="display mt-3 text-4xl text-ivory min-[768px]:mt-2 min-[768px]:text-xl min-[768px]:leading-tight">
                {story.title}
              </h3>
              <p className="mt-3 font-serif text-lg italic text-ivory/85 min-[768px]:mt-2 min-[768px]:text-[0.8rem] min-[768px]:leading-snug">
                {story.subtitle}
              </p>
            </div>
            <span className="eyebrow hidden shrink-0 pb-2 text-ivory/60 md:block min-[1200px]:hidden">Flip to Read</span>
          </div>
          <button
            ref={frontRef}
            type="button"
            tabIndex={flipped ? -1 : 0}
            onClick={() => {
              setFlipped(true);
              setFocusTo("back");
            }}
            aria-label={`Read the story: ${story.title}`}
            className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold"
          />
        </div>

        {/* ---------------- STORY SIDE ---------------- */}
        <div
          className="story-face story-back"
          inert={!flipped}
          aria-hidden={!flipped}
          onClick={() => {
            setFlipped(false);
            setFocusTo("front");
          }}
        >
          <div className="flex h-full flex-col p-6 min-[768px]:p-4">
            <p className="eyebrow text-muted-foreground min-[768px]:text-[0.5rem]">{story.n}</p>
            <h3 className="display mt-2 text-3xl text-forest min-[768px]:mt-2 min-[768px]:text-lg min-[768px]:leading-tight">
              {story.title}
            </h3>
            <Divider className="mt-3" />
            <p className="story-body mt-4 min-h-0 flex-1 overflow-y-auto overscroll-y-contain font-serif text-[0.95rem] leading-relaxed text-charcoal min-[768px]:mt-3 min-[768px]:text-[0.8rem] min-[1200px]:text-[0.74rem]">
              {story.preview ??
                (story.body ? storyPreview(story.body) : "We’re putting the final words in order — the complete story is coming soon.")}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-start gap-2 border-t border-foreground/10 pt-4 min-[768px]:-mx-4 min-[768px]:mt-3 min-[768px]:flex-nowrap min-[768px]:gap-px min-[768px]:pt-3">
              <button
                ref={backRef}
                type="button"
                tabIndex={flipped ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  setReading(true);
                }}
                className="btn-label shrink-0 whitespace-nowrap bg-forest px-2 py-3 font-bold text-ivory transition-colors hover:bg-rust min-[768px]:px-0 min-[768px]:py-2 min-[768px]:text-[0.55rem]"
              >
                Read the Full Story
              </button>
              <button
                type="button"
                tabIndex={flipped ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                  setFocusTo("front");
                }}
                className="eyebrow shrink-0 whitespace-nowrap text-muted-foreground underline-offset-4 transition-colors hover:text-forest hover:underline min-[768px]:text-[0.5rem]"
              >
                Back to photograph
              </button>
            </div>
          </div>
        </div>
      </div>

      {reading && createPortal(<StoryReader story={story} onClose={() => setReading(false)} />, document.body)}
    </div>
  );
}

/** First two or three sentences of the story, capped so it fits the square card. */
export function storyPreview(body: string, max = 250): string {
  const first = (body.split(/\n{2,}/)[0] ?? "").replace(/\s+/g, " ").trim();
  const sentences = first.match(/[^.!?]+[.!?…]+["”’)]*\s*/g) ?? [first];
  let out = "";
  for (const sentence of sentences.slice(0, 3)) {
    if (out && (out + sentence).length > max) break;
    out += sentence;
  }
  out = out.trim();
  if (out.length > max) out = out.slice(0, out.lastIndexOf(" ", max)).replace(/[,;:]$/, "") + "…";
  return out;
}

/** Renders one paragraph, keeping the author's own line breaks inside it. */
function Paragraph({ text }: { text: string }) {
  return (
    <p>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  );
}

function Divider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("mt-5 flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-gold/50" />
      <span className="h-1 w-1 rotate-45 bg-gold" />
      <span className="h-px flex-1 bg-gold/50" />
    </div>
  );
}

/** The larger reading view: one story, comfortably typeset, scrollable. */
function StoryReader({ story, onClose }: { story: Story; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    const previous = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = previous;
      document.body.style.paddingRight = prevPad;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`story-${story.id}-title`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center overflow-hidden bg-charcoal/60 p-3 backdrop-blur-sm animate-in fade-in sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto flex max-h-full w-full max-w-[800px] flex-col bg-ivory p-7 shadow-2xl sm:p-10 md:p-14"
      >
        <div className="flex shrink-0 items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-muted-foreground">
              {story.n} · {story.readerSubtitle ?? story.subtitle}
            </p>
            <h3 id={`story-${story.id}-title`} className="display mt-4 text-3xl text-forest md:text-4xl">
              {story.title}
            </h3>
            <Divider />
          </div>
          <button
            autoFocus
            type="button"
            onClick={onClose}
            aria-label="Close story"
            className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-forest"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-8 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {story.body ? (
            <div className="space-y-5 font-serif text-[1.05rem] leading-[1.8] text-charcoal md:text-lg">
              {story.body
                .split(/\n{2,}/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p, i) => (
                  <Paragraph key={i} text={p} />
                ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="eyebrow text-muted-foreground">Story text to come</p>
              <p className="font-serif text-xl italic text-muted-foreground">
                We’re putting the final words in order — the complete story will appear here.
              </p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn-label mt-8 w-full shrink-0 bg-forest py-4 text-ivory transition-colors hover:bg-rust sm:mt-10 sm:w-auto sm:px-10"
        >
          Close
        </button>
      </div>
    </div>
  );
}
