import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Story } from "./wedding-content";

/**
 * A single storybook card: photograph side and story side, joined by a slow
 * horizontal flip. Hover flips it on a mouse; a tap flips it on a touch screen.
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
      className="story-scene aspect-[4/5] md:aspect-[3/2] wide:aspect-[4/5]"
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
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="placeholder-frame h-full w-full">
              <span className="eyebrow absolute left-5 top-5 text-muted-foreground wide:left-3 wide:top-3 wide:text-[0.5rem]">Photograph to come</span>
            </div>
          )}
          <div className="bg-image-veil pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 md:p-8 wide:gap-3 wide:p-4">
            <div className="min-w-0">
              <p className="eyebrow text-ivory/70 wide:text-[0.5rem]">{story.n}</p>
              <h3 className="display mt-3 text-4xl text-ivory md:text-5xl wide:mt-2 wide:text-xl wide:leading-tight">{story.title}</h3>
              <p className="mt-3 font-serif text-lg italic text-ivory/85 md:text-xl wide:mt-2 wide:text-[0.8rem] wide:leading-snug">{story.subtitle}</p>
            </div>
            <span className="eyebrow hidden shrink-0 pb-2 text-ivory/60 md:block wide:hidden">Flip to Read</span>
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
          <div className="flex h-full flex-col p-6 md:p-8 wide:p-4">
            <p className="eyebrow text-muted-foreground wide:text-[0.5rem] wide:leading-snug">
              {story.n} · {story.subtitle}
            </p>
            <h3 className="display mt-3 text-3xl text-forest md:text-4xl wide:mt-2 wide:text-lg wide:leading-tight">{story.title}</h3>
            <Divider className="wide:mt-3" />
            <div className="story-body mt-5 flex-1 overflow-y-auto pr-1 wide:mt-3">
              {story.body ? (
                <div className="space-y-4 text-[0.95rem] leading-relaxed text-charcoal md:text-base wide:space-y-2 wide:text-[0.7rem]">
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
                  <p className="font-serif text-lg italic text-muted-foreground">
                    We’re putting the final words in order — the complete story will appear here.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 pt-5 wide:mt-3 wide:gap-2 wide:pt-3">
              <button
                ref={backRef}
                type="button"
                tabIndex={flipped ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  setReading(true);
                }}
                className="btn-label bg-forest px-6 py-3 text-ivory transition-colors hover:bg-rust wide:px-3 wide:py-2 wide:text-[0.55rem]"
              >
                Read Full Story
              </button>
              <button
                type="button"
                tabIndex={flipped ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  setFlipped(false);
                  setFocusTo("front");
                }}
                className="eyebrow text-muted-foreground underline-offset-4 transition-colors hover:text-forest hover:underline wide:text-[0.5rem]"
              >
                Back to photograph
              </button>
            </div>
          </div>
        </div>
      </div>

      {reading && <StoryReader story={story} onClose={() => setReading(false)} />}
    </div>
  );
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`story-${story.id}-title`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/60 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col bg-ivory p-7 sm:p-10 md:p-12"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-muted-foreground">
              {story.n} · {story.subtitle}
            </p>
            <h3 id={`story-${story.id}-title`} className="display mt-4 text-4xl text-forest md:text-5xl">
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
        <div className="story-body mt-6 flex-1 overflow-y-auto pr-2">
          {story.body ? (
            <div className="space-y-5 font-serif text-lg leading-relaxed text-charcoal md:text-xl">
              {story.body
                .split(/\n{2,}/)
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
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
          className="btn-label mt-8 w-full bg-forest py-4 text-ivory transition-colors hover:bg-rust sm:mt-10 sm:w-auto sm:px-10"
        >
          Close
        </button>
      </div>
    </div>
  );
}
