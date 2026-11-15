/**
 * The couple's photograph collections.
 *
 * To curate a collection, add imported CDN asset URLs to `photos` in the exact
 * order guests should see them. The first item appears first; nothing is sorted
 * automatically. Set `coverPhotoId` independently to choose the card cover.
 * Leave it null to use the first photograph as the cover.
 *
 * `thumbnail` / `thumbnailSrcSet` are optional optimized grid renditions.
 * `srcSet` lets the full-screen viewer choose an appropriate larger rendition.
 * WebP or AVIF sources can be supplied through those responsive source lists.
 */
export type GalleryPhoto = {
  id: string;
  src: string;
  srcSet?: string;
  thumbnail?: string;
  thumbnailSrcSet?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type PhotoCollection = {
  id: string;
  n: string;
  title: string;
  description: string;
  coverPhotoId: string | null;
  photos: GalleryPhoto[];
};

export function collectionCover(collection: PhotoCollection): GalleryPhoto | null {
  if (collection.coverPhotoId) {
    return collection.photos.find((photo) => photo.id === collection.coverPhotoId) ?? collection.photos[0] ?? null;
  }
  return collection.photos[0] ?? null;
}

export const photoCollections: PhotoCollection[] = [
  {
    id: "before-forever",
    n: "01",
    title: "Before Forever",
    description: "Our friendship, dating years, travels, and early memories together.",
    coverPhotoId: null,
    photos: [],
  },
  {
    id: "the-proposals",
    n: "02",
    title: "The Proposals",
    description: "The two times we proposed to each other.",
    coverPhotoId: null,
    photos: [],
  },
  {
    id: "we-said-yes",
    n: "03",
    title: "We Said Yes",
    description: "Our courthouse wedding and the day we officially got married.",
    coverPhotoId: null,
    photos: [],
  },
  {
    id: "life-lately",
    n: "04",
    title: "Life Lately",
    description: "Our adventures, celebrations, travels, and everyday memories from the past year.",
    coverPhotoId: null,
    photos: [],
  },
];
