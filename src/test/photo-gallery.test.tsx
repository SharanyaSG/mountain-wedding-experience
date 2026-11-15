import { fireEvent, render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { PhotoCategoryCard, PhotoGallery } from "@/components/site/PicturesOfUs";
import { photoCollections, type PhotoCollection } from "@/components/site/photo-gallery-content";

const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const collection: PhotoCollection = {
  ...photoCollections[1],
  photos: [
    { id: "one", src: pixel, thumbnail: pixel, width: 800, height: 1000, alt: "Neutral portrait placeholder", caption: "First caption" },
    { id: "two", src: pixel, thumbnail: pixel, width: 1000, height: 800, alt: "Neutral landscape placeholder" },
  ],
};

function renderGallery(photoIndex: number | null = null) {
  const props = {
    collection,
    photoIndex,
    closing: false,
    returnFocus: createRef<HTMLButtonElement>(),
    onOpenPhoto: vi.fn(),
    onNavigatePhoto: vi.fn(),
    onClosePhoto: vi.fn(),
    onClose: vi.fn(),
  };
  return { ...render(<PhotoGallery {...props} />), props };
}

describe("Pictures of Us interactions", () => {
  it("turns a square category card over and exposes both requested actions", () => {
    const onOpen = vi.fn();
    const { container } = render(<PhotoCategoryCard collection={collection} onOpen={onOpen} />);
    expect(container.querySelector(".aspect-square")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Explore the photo collection: The Proposals" }));
    expect(screen.getByRole("button", { name: "View All Photos" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Back to Photograph" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Back to Photograph" }));
    expect(screen.queryByRole("button", { name: "View All Photos" })).toBeNull();
  });

  it("opens an editorial grid before the individual photo viewer", () => {
    renderGallery();
    expect(screen.getByRole("dialog", { name: "The Proposals" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Open photograph 1 of 2: First caption" })).toBeVisible();
    expect(screen.queryByRole("dialog", { name: "The Proposals photograph viewer" })).toBeNull();
  });

  it("shows a full-screen viewer with counter, caption, and keyboard navigation", () => {
    const { props } = renderGallery(0);
    const viewer = screen.getByRole("dialog", { name: "The Proposals photograph viewer" });
    expect(viewer).toBeVisible();
    expect(within(viewer).getByText("1 / 2")).toBeVisible();
    expect(within(viewer).getByText("First caption")).toBeVisible();
    fireEvent.keyDown(screen.getByRole("dialog", { name: "The Proposals photograph viewer" }), { key: "ArrowRight" });
    expect(props.onNavigatePhoto).toHaveBeenCalledWith(1);
    fireEvent.keyDown(screen.getByRole("dialog", { name: "The Proposals photograph viewer" }), { key: "Escape" });
    expect(props.onClosePhoto).toHaveBeenCalledOnce();
  });

  it("keeps the grid mounted and preserves its scroll position behind the viewer", () => {
    const { rerender, props } = renderGallery(0);
    const grid = document.querySelector('[data-photo-index="0"]') as HTMLButtonElement;
    const scroller = grid.closest(".overflow-y-auto") as HTMLElement;
    scroller.scrollTop = 240;
    rerender(<PhotoGallery {...props} photoIndex={null} />);
    expect(scroller.scrollTop).toBe(240);
    expect(screen.getByRole("button", { name: "Open photograph 1 of 2: First caption" })).toBeVisible();
  });

  it("offers an elegant empty state when no photographs have been supplied", () => {
    render(<PhotoGallery {...{ ...renderGalleryProps(), collection: photoCollections[0] }} />);
    expect(screen.getByRole("status")).toHaveTextContent("Photographs to come");
    expect(screen.getByRole("status")).toHaveTextContent("No photographs have been added to this collection yet.");
  });
});

function renderGalleryProps() {
  return {
    photoIndex: null,
    closing: false,
    returnFocus: createRef<HTMLButtonElement>(),
    onOpenPhoto: vi.fn(),
    onNavigatePhoto: vi.fn(),
    onClosePhoto: vi.fn(),
    onClose: vi.fn(),
  };
}
