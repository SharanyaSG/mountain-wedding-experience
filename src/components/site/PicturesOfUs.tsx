import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Images, X, ZoomIn, ZoomOut } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import {
  collectionCover,
  photoCollections,
  type GalleryPhoto,
  type PhotoCollection,
} from "@/components/site/photo-gallery-content";
import { cn } from "@/lib/utils";

type GalleryLocation = {
  collectionId: string;
  photoIndex: number | null;
};

const HISTORY_KEY = "picturesOfUs";

function validLocation(value: unknown): GalleryLocation | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<GalleryLocation>;
  const collection = photoCollections.find((item) => item.id === candidate.collectionId);
  if (!collection) return null;
  const photoIndex =
    typeof candidate.photoIndex === "number" && candidate.photoIndex >= 0 && candidate.photoIndex < collection.photos.length
      ? Math.floor(candidate.photoIndex)
      : null;
  return { collectionId: collection.id, photoIndex };
}

function historyLocation(): GalleryLocation | null {
  const state = window.history.state as Record<string, unknown> | null;
  return validLocation(state?.[HISTORY_KEY]);
}

/** Four compact, curated entrances to the couple's photograph collections. */
export function PicturesOfUs() {
  const [location, setLocation] = useState<GalleryLocation | null>(null);
  const [present, setPresent] = useState(false);
  const [closing, setClosing] = useState(false);
  const lastLocation = useRef<GalleryLocation | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);

  if (location) lastLocation.current = location;
  const displayedLocation = location ?? lastLocation.current;
  const collection = displayedLocation
    ? photoCollections.find((item) => item.id === displayedLocation.collectionId) ?? null
    : null;

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state as Record<string, unknown> | null;
      setLocation(validLocation(state?.[HISTORY_KEY]));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (location) {
      setPresent(true);
      setClosing(false);
    } else if (present) {
      setClosing(true);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      timer = setTimeout(() => {
        setPresent(false);
        setClosing(false);
      }, reducedMotion ? 0 : 180);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [location, present]);

  const writeHistory = (next: GalleryLocation, mode: "push" | "replace") => {
    const current = window.history.state;
    const base = current && typeof current === "object" ? current : {};
    const state = { ...base, [HISTORY_KEY]: next };
    if (mode === "push") window.history.pushState(state, "", window.location.href);
    else window.history.replaceState(state, "", window.location.href);
  };

  const openCollection = (collectionId: string, focusTarget: HTMLButtonElement | null) => {
    const next = { collectionId, photoIndex: null };
    returnFocus.current = focusTarget;
    writeHistory(next, "push");
    setLocation(next);
  };

  const openPhoto = (photoIndex: number) => {
    if (!location) return;
    const next = { ...location, photoIndex };
    writeHistory(next, "push");
    setLocation(next);
  };

  const navigatePhoto = (photoIndex: number) => {
    if (!location) return;
    const next = { ...location, photoIndex };
    writeHistory(next, "replace");
    setLocation(next);
  };

  const closePhoto = () => {
    if (!location || location.photoIndex === null) return;
    setLocation({ ...location, photoIndex: null });
    if (historyLocation()?.photoIndex !== null) window.history.back();
  };

  const closeCollection = () => {
    setLocation(null);
    if (historyLocation()) window.history.back();
  };

  return (
    <section id="gallery" aria-labelledby="pictures-of-us-title" className="section-divider scroll-mt-24 bg-card md:scroll-mt-28">
      <div className="section-shell">
        <Reveal delay={100}>
          <h2 id="pictures-of-us-title" className="display text-5xl md:text-7xl">
            Pictures of <em>Us</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base min-[1200px]:max-w-none min-[1200px]:whitespace-nowrap">
            Hover over a card to discover a collection. On a phone, tap the card to turn it over.
          </p>
        </Reveal>
        <div className="section-content grid gap-6 min-[540px]:max-[767px]:grid-cols-2 min-[540px]:max-[767px]:gap-4 min-[768px]:max-[1200px]:grid-cols-2 min-[768px]:max-[1200px]:gap-8 min-[1200px]:grid-cols-4 min-[1200px]:gap-5">
          {photoCollections.map((item, index) => (
            <Reveal key={item.id} delay={(index % 4) * 120}>
              <PhotoCategoryCard collection={item} onOpen={openCollection} />
            </Reveal>
          ))}
        </div>
      </div>

      {present && collection && displayedLocation &&
        createPortal(
          <PhotoGallery
            collection={collection}
            photoIndex={location?.photoIndex ?? null}
            closing={closing}
            returnFocus={returnFocus}
            onOpenPhoto={openPhoto}
            onNavigatePhoto={navigatePhoto}
            onClosePhoto={closePhoto}
            onClose={closeCollection}
          />,
          document.body,
        )}
    </section>
  );
}

export function PhotoCategoryCard({
  collection,
  onOpen,
}: {
  collection: PhotoCollection;
  onOpen: (collectionId: string, focusTarget: HTMLButtonElement | null) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [focusTo, setFocusTo] = useState<"front" | "back" | null>(null);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const cover = collectionCover(collection);

  useEffect(() => {
    if (focusTo === "back") backRef.current?.focus();
    if (focusTo === "front") frontRef.current?.focus();
    setFocusTo(null);
  }, [focusTo]);

  const onHover = (event: ReactPointerEvent<HTMLDivElement>, next: boolean) => {
    if (event.pointerType === "mouse") setFlipped(next);
  };

  return (
    <div
      className="story-scene aspect-square @container"
      onPointerEnter={(event) => onHover(event, true)}
      onPointerLeave={(event) => onHover(event, false)}
    >
      <div className={cn("story-card", flipped && "is-flipped")}>
        <div className="story-face" inert={flipped} aria-hidden={flipped}>
          {cover ? (
            <img
              src={cover.thumbnail ?? cover.src}
              srcSet={cover.thumbnailSrcSet ?? cover.srcSet}
              sizes="(min-width: 1200px) 23vw, (min-width: 768px) 43vw, (min-width: 540px) 45vw, 90vw"
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="placeholder-frame h-full w-full">
              <span className="eyebrow absolute left-5 top-5 text-muted-foreground min-[540px]:max-[767px]:left-3 min-[540px]:max-[767px]:top-3 min-[540px]:max-[767px]:text-[0.5rem] min-[768px]:left-3 min-[768px]:top-3 min-[768px]:text-[0.5rem]">
                Photograph to come
              </span>
            </div>
          )}
          <div className="bg-image-veil pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 min-[540px]:max-[767px]:p-4 min-[768px]:p-4">
            <p className="eyebrow text-ivory/70 min-[540px]:max-[767px]:text-[0.5rem] min-[768px]:text-[0.5rem]">{collection.n}</p>
            <h3 className="display mt-3 text-4xl text-ivory min-[540px]:max-[767px]:mt-2 min-[540px]:max-[767px]:text-xl min-[540px]:max-[767px]:leading-tight min-[768px]:mt-2 min-[768px]:text-xl min-[768px]:leading-tight">
              {collection.title}
            </h3>
          </div>
          <button
            ref={frontRef}
            type="button"
            tabIndex={flipped ? -1 : 0}
            onClick={() => {
              setFlipped(true);
              setFocusTo("back");
            }}
            aria-label={`Explore the photo collection: ${collection.title}`}
            className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold"
          />
        </div>

        <div className="story-face story-back" inert={!flipped} aria-hidden={!flipped}>
          <div className="flex h-full flex-col p-5 min-[540px]:max-[767px]:p-3 min-[768px]:p-4">
            <p className="eyebrow text-muted-foreground min-[540px]:max-[767px]:text-[0.5rem] min-[768px]:text-[0.5rem]">{collection.n}</p>
            <h3 className="display mt-2 text-3xl text-forest min-[540px]:max-[767px]:text-xl min-[540px]:max-[767px]:leading-tight min-[768px]:text-lg min-[768px]:leading-tight">
              {collection.title}
            </h3>
            <div aria-hidden className="mt-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-gold/50" />
              <span className="h-1 w-1 rotate-45 bg-gold" />
              <span className="h-px flex-1 bg-gold/50" />
            </div>
            <p className="mt-4 flex-1 font-serif text-[0.95rem] leading-relaxed text-charcoal min-[540px]:max-[767px]:mt-3 min-[540px]:max-[767px]:text-[0.72rem] min-[540px]:max-[767px]:leading-snug min-[768px]:mt-3 min-[768px]:text-[0.78rem] min-[1200px]:text-[0.76rem]">
              {collection.description}
            </p>
            <div className="mt-4 flex flex-col items-stretch gap-2 border-t border-foreground/10 pt-4 min-[540px]:max-[767px]:mt-3 min-[540px]:max-[767px]:pt-3 min-[768px]:mt-3 min-[768px]:pt-3 @[300px]:flex-row @[300px]:items-center @[300px]:justify-between">
              <button
                ref={backRef}
                type="button"
                tabIndex={flipped ? 0 : -1}
                onClick={() => {
                  setFlipped(false);
                  onOpen(collection.id, frontRef.current);
                }}
                className="btn-label min-h-10 shrink-0 bg-forest px-3 py-2 text-[0.62rem] text-ivory transition-colors hover:bg-rust min-[768px]:text-[0.55rem] min-[1200px]:text-[0.58rem]"
              >
                View All Photos
              </button>
              <button
                type="button"
                tabIndex={flipped ? 0 : -1}
                onClick={() => {
                  setFlipped(false);
                  setFocusTo("front");
                }}
                className="eyebrow min-h-10 shrink-0 px-1 py-2 text-[0.58rem] text-muted-foreground underline-offset-4 transition-colors hover:text-forest hover:underline min-[768px]:text-[0.5rem]"
              >
                Back to Photograph
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhotoGallery({
  collection,
  photoIndex,
  closing,
  returnFocus,
  onOpenPhoto,
  onNavigatePhoto,
  onClosePhoto,
  onClose,
}: {
  collection: PhotoCollection;
  photoIndex: number | null;
  closing: boolean;
  returnFocus: RefObject<HTMLButtonElement | null>;
  onOpenPhoto: (index: number) => void;
  onNavigatePhoto: (index: number) => void;
  onClosePhoto: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const viewerCloseRef = useRef<HTMLButtonElement>(null);
  const previousPhotoIndex = useRef<number | null>(null);
  const viewerOpen = photoIndex !== null;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      returnFocus.current?.focus();
    };
  }, [returnFocus]);

  useEffect(() => {
    const wasOpen = previousPhotoIndex.current !== null;
    if (viewerOpen && !wasOpen) viewerCloseRef.current?.focus();
    if (!viewerOpen && wasOpen) {
      const previous = previousPhotoIndex.current;
      panelRef.current
        ?.querySelector<HTMLButtonElement>(`[data-photo-index="${previous}"]`)
        ?.focus({ preventScroll: true });
    }
    previousPhotoIndex.current = photoIndex;
  }, [photoIndex, viewerOpen]);

  const navigate = (direction: -1 | 1) => {
    if (photoIndex === null || collection.photos.length < 2) return;
    onNavigatePhoto((photoIndex + direction + collection.photos.length) % collection.photos.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (viewerOpen) onClosePhoto();
      else onClose();
      return;
    }
    if (viewerOpen && event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
      return;
    }
    if (viewerOpen && event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
      return;
    }
    if (event.key !== "Tab") return;

    const container = viewerOpen ? viewerRef.current : panelRef.current;
    const focusable = Array.from(
      container?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => !element.hasAttribute("inert"));
    if (!focusable.length) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      data-state={closing ? "closed" : "open"}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[80] flex items-stretch justify-center bg-charcoal/45 animate-in fade-in fill-mode-forwards duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out md:items-center md:p-6"
    >
      <div
        ref={panelRef}
        role={viewerOpen ? undefined : "dialog"}
        aria-modal={viewerOpen ? undefined : true}
        aria-labelledby="photo-gallery-title"
        aria-hidden={viewerOpen}
        inert={viewerOpen}
        className="relative flex h-dvh w-full flex-col overflow-y-auto overscroll-contain bg-ivory shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 fill-mode-forwards duration-200 data-[state=closed]:animate-out md:h-auto md:max-h-[90dvh] md:w-[90vw] md:max-w-[1400px]"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-foreground/10 bg-ivory/95 px-5 py-5 backdrop-blur-sm sm:px-8 md:px-10 md:py-7">
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground">{collection.n} · Photograph collection</p>
            <h2 id="photo-gallery-title" className="display mt-2 text-3xl text-forest sm:text-4xl md:text-5xl">
              {collection.title}
            </h2>
            <p className="mt-3 max-w-2xl font-serif text-sm italic leading-relaxed text-muted-foreground">
              {collection.description}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close photo gallery"
            className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        {collection.photos.length ? (
          <div className="columns-2 gap-3 p-3 sm:gap-4 sm:p-5 md:columns-3 md:p-8 min-[1200px]:columns-4">
            {collection.photos.map((photo, index) => (
              <GalleryGridPhoto
                key={photo.id}
                photo={photo}
                index={index}
                count={collection.photos.length}
                onOpen={() => onOpenPhoto(index)}
              />
            ))}
          </div>
        ) : (
          <div role="status" className="flex min-h-[55vh] flex-1 flex-col items-center justify-center px-6 py-20 text-center">
            <Images aria-hidden className="h-8 w-8 text-gold" strokeWidth={1.25} />
            <h3 className="display mt-6 text-2xl text-forest">Photographs to come</h3>
            <p className="mt-4 max-w-sm font-serif text-base italic leading-relaxed text-muted-foreground">
              No photographs have been added to this collection yet.
            </p>
          </div>
        )}
      </div>

      <PhotoViewer
        ref={viewerRef}
        closeRef={viewerCloseRef}
        collection={collection}
        photoIndex={photoIndex}
        onClose={onClosePhoto}
        onNavigate={navigate}
      />
    </div>
  );
}

function GalleryGridPhoto({
  photo,
  index,
  count,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  count: number;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      type="button"
      data-photo-index={index}
      onClick={onOpen}
      aria-label={`Open photograph ${index + 1} of ${count}${photo.caption ? `: ${photo.caption}` : ""}`}
      className="group mb-3 block w-full break-inside-avoid text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:mb-4"
    >
      <span
        className="relative block w-full overflow-hidden bg-stone"
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      >
        <img
          src={photo.thumbnail ?? photo.src}
          srcSet={photo.thumbnailSrcSet ?? photo.srcSet}
          sizes="(min-width: 1200px) 21vw, (min-width: 768px) 28vw, 46vw"
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      {photo.caption && (
        <span className="mt-2 block font-serif text-sm italic leading-relaxed text-muted-foreground">{photo.caption}</span>
      )}
    </button>
  );
}

type PhotoViewerProps = {
  collection: PhotoCollection;
  photoIndex: number | null;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
};

const PhotoViewer = function PhotoViewer({
  ref,
  closeRef,
  collection,
  photoIndex,
  onClose,
  onNavigate,
}: PhotoViewerProps & { ref: RefObject<HTMLDivElement | null> }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [loadedPhoto, setLoadedPhoto] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ x: 0, y: 0, panX: 0, panY: 0, zoom: 1, distance: 0, pinched: false });
  const active = photoIndex !== null;
  const photo = active ? collection.photos[photoIndex] : null;

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    pointers.current.clear();
  }, [photo?.id]);

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleZoom = () => {
    if (zoom > 1) resetZoom();
    else setZoom(2);
  };

  const clampPan = (next: { x: number; y: number }, scale: number) => {
    const viewport = viewportRef.current;
    const image = imageRef.current;
    if (!viewport || !image) return next;
    const maxX = Math.max(0, (image.clientWidth * scale - viewport.clientWidth) / 2);
    const maxY = Math.max(0, (image.clientHeight * scale - viewport.clientHeight) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, next.x)), y: Math.max(-maxY, Math.min(maxY, next.y)) };
  };

  const distanceBetweenPointers = () => {
    const points = Array.from(pointers.current.values());
    if (points.length < 2) return 0;
    const first = points[0]!;
    const second = points[1]!;
    return Math.hypot(first.x - second.x, first.y - second.y);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) {
      gesture.current = {
        x: event.clientX,
        y: event.clientY,
        panX: pan.x,
        panY: pan.y,
        zoom,
        distance: 0,
        pinched: false,
      };
    } else if (pointers.current.size === 2) {
      gesture.current.distance = distanceBetweenPointers();
      gesture.current.zoom = zoom;
      gesture.current.pinched = true;
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2 && gesture.current.distance > 0) {
      const nextZoom = Math.max(1, Math.min(4, gesture.current.zoom * (distanceBetweenPointers() / gesture.current.distance)));
      setZoom(nextZoom);
      setPan((current) => clampPan(current, nextZoom));
    } else if (pointers.current.size === 1 && zoom > 1) {
      setPan(
        clampPan(
          {
            x: gesture.current.panX + event.clientX - gesture.current.x,
            y: gesture.current.panY + event.clientY - gesture.current.y,
          },
          zoom,
        ),
      );
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointers.current.size === 1 && !gesture.current.pinched && zoom === 1) {
      const deltaX = event.clientX - gesture.current.x;
      const deltaY = event.clientY - gesture.current.y;
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
        onNavigate(deltaX > 0 ? -1 : 1);
      }
    }
    pointers.current.delete(event.pointerId);
    if (!pointers.current.size) gesture.current.pinched = false;
  };

  const viewerStyle: CSSProperties = {
    opacity: active ? 1 : 0,
    pointerEvents: active ? "auto" : "none",
    visibility: active ? "visible" : "hidden",
    transition: active ? "opacity 180ms ease" : "opacity 180ms ease, visibility 0s linear 180ms",
  };

  return (
    <div
      ref={ref}
      role={active ? "dialog" : undefined}
      aria-modal={active ? true : undefined}
      aria-label={active ? `${collection.title} photograph viewer` : undefined}
      aria-hidden={!active}
      inert={!active}
      style={viewerStyle}
      className="fixed inset-0 z-[90] flex h-dvh flex-col bg-charcoal/95 text-ivory"
    >
      <header className="relative z-20 flex min-h-16 items-center justify-between px-4 sm:px-6">
        <p className="eyebrow text-ivory/70" aria-live="polite">
          {active ? `${photoIndex + 1} / ${collection.photos.length}` : ""}
        </p>
        <button
          ref={closeRef}
          type="button"
          tabIndex={active ? 0 : -1}
          onClick={onClose}
          aria-label="Close photograph and return to gallery"
          className="flex h-11 w-11 items-center justify-center text-ivory transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 items-stretch">
        {active && collection.photos.length > 1 && (
          <NavigationButton direction={-1} onNavigate={onNavigate} />
        )}
        <div
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={toggleZoom}
          className="relative flex min-h-0 min-w-0 flex-1 touch-none select-none items-center justify-center overflow-hidden px-12 sm:px-20"
          aria-label="Photograph. Swipe left or right to browse; pinch or double-tap to zoom."
        >
          {photo && (
            <img
              key={photo.id}
              ref={imageRef}
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              draggable={false}
              onLoad={() => setLoadedPhoto(photo.id)}
              className={cn(
                "max-h-full max-w-full object-contain transition-opacity duration-300",
                loadedPhoto === photo.id ? "opacity-100" : "opacity-0",
              )}
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            />
          )}
        </div>
        {active && collection.photos.length > 1 && (
          <NavigationButton direction={1} onNavigate={onNavigate} />
        )}
      </div>

      <footer className="relative z-20 flex min-h-20 items-center justify-center gap-5 px-5 py-3 text-center">
        {photo?.caption && <p className="max-w-2xl font-serif text-sm italic leading-relaxed text-ivory/75">{photo.caption}</p>}
        <button
          type="button"
          tabIndex={active ? 0 : -1}
          onClick={toggleZoom}
          aria-label={zoom > 1 ? "Zoom out" : "Zoom in"}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-ivory/80 transition-colors hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {zoom > 1 ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
        </button>
      </footer>
    </div>
  );
};

function NavigationButton({ direction, onNavigate }: { direction: -1 | 1; onNavigate: (direction: -1 | 1) => void }) {
  const previous = direction === -1;
  const Icon = previous ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={() => onNavigate(direction)}
      aria-label={previous ? "Previous photograph" : "Next photograph"}
      className={cn(
        "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:h-12 sm:w-12",
        previous ? "left-2 sm:left-5" : "right-2 sm:right-5",
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
