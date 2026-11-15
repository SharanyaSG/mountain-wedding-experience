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
import photo001 from "@/assets/before-forever-001.jpg.asset.json";
import photo002 from "@/assets/before-forever-002.jpg.asset.json";
import photo003 from "@/assets/before-forever-003.jpg.asset.json";
import photo004 from "@/assets/before-forever-004.jpg.asset.json";
import photo005 from "@/assets/before-forever-005.jpg.asset.json";
import photo006 from "@/assets/before-forever-006.jpg.asset.json";
import photo007 from "@/assets/before-forever-007.jpg.asset.json";
import photo008 from "@/assets/before-forever-008.jpg.asset.json";
import photo009 from "@/assets/before-forever-009.jpg.asset.json";
import photo010 from "@/assets/before-forever-010.jpg.asset.json";

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
    // Append future batches here in upload order; the first photo is only a temporary cover.
    photos: [
      { id: "before-forever-001", src: photo001.url, width: 1080, height: 1920, alt: "Sharanya and Sahil smiling and embracing indoors" },
      { id: "before-forever-002", src: photo002.url, width: 2000, height: 1500, alt: "Sharanya and Sahil with friends in a snowy outdoor plaza" },
      { id: "before-forever-003", src: photo003.url, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a close-up selfie together at night" },
      { id: "before-forever-004", src: photo004.url, width: 1920, height: 1440, alt: "Sharanya and Sahil sitting together outdoors in the sunshine" },
      { id: "before-forever-005", src: photo005.url, width: 1440, height: 1920, alt: "Sharanya and Sahil posing together in a decorated room" },
      { id: "before-forever-006", src: photo006.url, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a selfie under blue lighting" },
      { id: "before-forever-007", src: photo007.url, width: 1500, height: 2000, alt: "Sharanya and Sahil beside a Christmas tree wearing festive red outfits" },
      { id: "before-forever-008", src: photo008.url, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together under red lighting" },
      { id: "before-forever-009", src: photo009.url, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling together in front of wall artwork" },
      { id: "before-forever-010", src: photo010.url, width: 1440, height: 1920, alt: "Sharanya and Sahil taking an outdoor selfie beside trees" },
    ],
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
