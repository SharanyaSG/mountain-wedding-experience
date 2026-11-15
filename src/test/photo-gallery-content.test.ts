import { describe, expect, it } from "vitest";
import { collectionCover, photoCollections, type PhotoCollection } from "@/components/site/photo-gallery-content";

describe("Pictures of Us collections", () => {
  it("keeps the four requested categories in their exact order", () => {
    expect(photoCollections.map(({ n, title, description }) => ({ n, title, description }))).toEqual([
      { n: "01", title: "Before Forever", description: "Our friendship, dating years, travels, and early memories together." },
      { n: "02", title: "The Proposals", description: "The two times we proposed to each other." },
      { n: "03", title: "We Said Yes", description: "Our courthouse wedding and the day we officially got married." },
      { n: "04", title: "Life Lately", description: "Our adventures, celebrations, travels, and everyday memories from the past year." },
    ]);
  });

  it("starts with neutral empty states rather than invented photographs", () => {
    expect(photoCollections.every((collection) => collection.photos.length === 0)).toBe(true);
  });

  it("uses an independently selected cover without reordering the collection", () => {
    const collection: PhotoCollection = {
      ...photoCollections[0],
      coverPhotoId: "second",
      photos: [
        { id: "first", src: "/first.webp", width: 800, height: 1000, alt: "First" },
        { id: "second", src: "/second.webp", width: 1000, height: 800, alt: "Second" },
      ],
    };
    expect(collectionCover(collection)?.id).toBe("second");
    expect(collection.photos.map((photo) => photo.id)).toEqual(["first", "second"]);
  });
});
