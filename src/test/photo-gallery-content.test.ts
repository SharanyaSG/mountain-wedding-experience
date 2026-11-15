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

  it("keeps the first ten Before Forever uploads in their supplied order and original dimensions", () => {
    expect(photoCollections[0]?.photos.slice(0, 10).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["before-forever-001", 1080, 1920],
      ["before-forever-002", 2000, 1500],
      ["before-forever-003", 1440, 1920],
      ["before-forever-004", 1920, 1440],
      ["before-forever-005", 1440, 1920],
      ["before-forever-006", 1440, 1920],
      ["before-forever-007", 1500, 2000],
      ["before-forever-008", 1440, 1920],
      ["before-forever-009", 1440, 1920],
      ["before-forever-010", 1440, 1920],
    ]);
  });

  it("appends the second ten uploads after the first batch with original dimensions", () => {
    expect(photoCollections[0]?.photos.slice(10, 20).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["before-forever-011", 1440, 1920],
      ["before-forever-012", 1440, 1920],
      ["before-forever-013", 1440, 1920],
      ["before-forever-014", 1920, 1440],
      ["before-forever-015", 1920, 1440],
      ["before-forever-016", 1440, 1920],
      ["before-forever-017", 1920, 1440],
      ["before-forever-018", 1920, 1440],
      ["before-forever-019", 1284, 939],
      ["before-forever-020", 1545, 1024],
    ]);
  });

  it("appends the third ten uploads without losing earlier photographs or changing upload order", () => {
    expect(photoCollections[0]?.photos.slice(20, 30).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["before-forever-021", 1440, 1920],
      ["before-forever-022", 1920, 1440],
      ["before-forever-023", 1440, 1920],
      ["before-forever-024", 1920, 1440],
      ["before-forever-025", 1440, 1920],
      ["before-forever-026", 1440, 1920],
      ["before-forever-027", 1600, 1200],
      ["before-forever-028", 1440, 1920],
      ["before-forever-029", 1440, 1920],
      ["before-forever-030", 1440, 1920],
    ]);
    expect(new Set(photoCollections[0]?.photos.slice(0, 30).map(({ id }) => id)).size).toBe(30);
  });

  it("appends the single received fourth-batch photograph after all thirty earlier uploads", () => {
    expect(photoCollections[0]?.photos).toHaveLength(31);
    expect(photoCollections[0]?.photos.slice(30).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["before-forever-031", 1920, 1081],
    ]);
  });

  it("keeps Before Forever's cover unfinalized and leaves Life Lately empty", () => {
    expect(photoCollections[3]?.photos).toEqual([]);
    const collection = photoCollections[0];
    if (!collection) throw new Error("Before Forever is missing");
    expect(collection.coverPhotoId).toBeNull();
    expect(collectionCover(collection)?.id).toBe("before-forever-001");
  });

  it("adds the ten Proposals originals in upload order with their original proportions", () => {
    const collection = photoCollections[1];
    if (!collection) throw new Error("The Proposals is missing");
    expect(collection.photos.slice(0, 10).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["the-proposals-001", 1080, 1920],
      ["the-proposals-002", 1280, 1920],
      ["the-proposals-003", 1280, 1920],
      ["the-proposals-004", 1280, 1920],
      ["the-proposals-005", 1280, 1920],
      ["the-proposals-006", 1280, 1920],
      ["the-proposals-007", 1280, 1920],
      ["the-proposals-008", 1280, 1920],
      ["the-proposals-009", 1280, 1920],
      ["the-proposals-010", 1280, 1920],
    ]);
    expect(new Set(collection.photos.slice(0, 10).map(({ src }) => src)).size).toBe(10);
    expect(collection.coverPhotoId).toBeNull();
  });

  it("appends the next three Proposals photos and preserves the temporary cover", () => {
    const collection = photoCollections[1];
    if (!collection) throw new Error("The Proposals is missing");
    expect(collection.photos).toHaveLength(13);
    expect(collection.photos.slice(10).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["the-proposals-011", 1440, 1920],
      ["the-proposals-012", 1280, 1920],
      ["the-proposals-013", 1920, 1280],
    ]);
    expect(new Set(collection.photos.map(({ src }) => src)).size).toBe(13);
    expect(collection.coverPhotoId).toBeNull();
    expect(collectionCover(collection)?.id).toBe("the-proposals-001");
  });

  it("adds ten We Said Yes originals in upload order with original proportions and no finalized cover", () => {
    const collection = photoCollections[2];
    if (!collection) throw new Error("We Said Yes is missing");
    expect(collection.photos.slice(0, 10).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["we-said-yes-001", 1280, 1920],
      ["we-said-yes-002", 1920, 1280],
      ["we-said-yes-003", 1920, 1280],
      ["we-said-yes-004", 1920, 1280],
      ["we-said-yes-005", 1280, 1920],
      ["we-said-yes-006", 1280, 1920],
      ["we-said-yes-007", 1280, 1920],
      ["we-said-yes-008", 1280, 1920],
      ["we-said-yes-009", 1280, 1920],
      ["we-said-yes-010", 1920, 1280],
    ]);
    expect(new Set(collection.photos.slice(0, 10).map(({ src }) => src)).size).toBe(10);
    expect(collection.coverPhotoId).toBeNull();
  });

  it("appends seven We Said Yes photographs after the original ten without changing the temporary cover", () => {
    const collection = photoCollections[2];
    if (!collection) throw new Error("We Said Yes is missing");
    expect(collection.photos).toHaveLength(17);
    expect(collection.photos.slice(10).map(({ id, width, height }) => [id, width, height])).toEqual([
      ["we-said-yes-011", 1440, 1920],
      ["we-said-yes-012", 1920, 1280],
      ["we-said-yes-013", 1086, 1920],
      ["we-said-yes-014", 1099, 1920],
      ["we-said-yes-015", 1105, 1920],
      ["we-said-yes-016", 1112, 1920],
      ["we-said-yes-017", 1920, 1280],
    ]);
    expect(new Set(collection.photos.map(({ src }) => src)).size).toBe(17);
    expect(collection.coverPhotoId).toBeNull();
    expect(collectionCover(collection)?.id).toBe("we-said-yes-001");
  });

  it("uses an independently selected cover without reordering the collection", () => {
    const base = photoCollections[0];
    if (!base) throw new Error("Before Forever is missing");
    const collection: PhotoCollection = {
      ...base,
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
