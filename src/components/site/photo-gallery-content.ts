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
import photo011 from "@/assets/before-forever-011.jpg.asset.json";
import photo012 from "@/assets/before-forever-012.jpg.asset.json";
import photo013 from "@/assets/before-forever-013.jpg.asset.json";
import photo014 from "@/assets/before-forever-014.jpg.asset.json";
import photo015 from "@/assets/before-forever-015.jpg.asset.json";
import photo016 from "@/assets/before-forever-016.jpg.asset.json";
import photo017 from "@/assets/before-forever-017.jpg.asset.json";
import photo018 from "@/assets/before-forever-018.jpg.asset.json";
import photo019 from "@/assets/before-forever-019.jpg.asset.json";
import photo020 from "@/assets/before-forever-020.jpg.asset.json";
import photo021 from "@/assets/before-forever-021.jpg.asset.json";
import photo022 from "@/assets/before-forever-022.jpg.asset.json";
import photo023 from "@/assets/before-forever-023.jpg.asset.json";
import photo024 from "@/assets/before-forever-024.jpg.asset.json";
import photo025 from "@/assets/before-forever-025.jpg.asset.json";
import photo026 from "@/assets/before-forever-026.jpg.asset.json";
import photo027 from "@/assets/before-forever-027.jpg.asset.json";
import photo028 from "@/assets/before-forever-028.jpg.asset.json";
import photo029 from "@/assets/before-forever-029.jpg.asset.json";
import photo030 from "@/assets/before-forever-030.jpg.asset.json";
import photo031 from "@/assets/before-forever-031.jpg.asset.json";

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
      { id: "before-forever-011", src: photo011.url, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling together indoors beside a window" },
      { id: "before-forever-012", src: photo012.url, width: 1440, height: 1920, alt: "Sharanya and Sahil embracing in front of a fireplace" },
      { id: "before-forever-013", src: photo013.url, width: 1440, height: 1920, alt: "Sharanya and Sahil posing together in front of a red event backdrop" },
      { id: "before-forever-014", src: photo014.url, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a selfie with a friend indoors" },
      { id: "before-forever-015", src: photo015.url, width: 1920, height: 1440, alt: "Sharanya and Sahil with a friend in graduation caps and gowns" },
      { id: "before-forever-016", src: photo016.url, width: 1440, height: 1920, alt: "Sharanya and Sahil standing with friends indoors" },
      { id: "before-forever-017", src: photo017.url, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a group selfie with friends at a table" },
      { id: "before-forever-018", src: photo018.url, width: 1920, height: 1440, alt: "Sharanya and Sahil standing together beside a railing at night" },
      { id: "before-forever-019", src: photo019.url, width: 1284, height: 939, alt: "Sharanya and Sahil smiling in a group selfie with friends" },
      { id: "before-forever-020", src: photo020.url, width: 1545, height: 1024, alt: "Sharanya and Sahil gathered with friends for a group photograph indoors" },
      { id: "before-forever-021", src: photo021.url, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together outside a brewery" },
      { id: "before-forever-022", src: photo022.url, width: 1920, height: 1440, alt: "Sharanya and Sahil with friends at a restaurant table" },
      { id: "before-forever-023", src: photo023.url, width: 1440, height: 1920, alt: "Sharanya and Sahil posing with friends in front of a painted wall" },
      { id: "before-forever-024", src: photo024.url, width: 1920, height: 1440, alt: "Sharanya and Sahil gathered with friends for an indoor group selfie" },
      { id: "before-forever-025", src: photo025.url, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together in the snow at night" },
      { id: "before-forever-026", src: photo026.url, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a playful close-up selfie indoors" },
      { id: "before-forever-027", src: photo027.url, width: 1600, height: 1200, alt: "Sharanya and Sahil standing with friends for a group photograph indoors" },
      { id: "before-forever-028", src: photo028.url, width: 1440, height: 1920, alt: "Sharanya and Sahil in graduation caps and gowns holding their diplomas" },
      { id: "before-forever-029", src: photo029.url, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a selfie together outdoors in the sunshine" },
      { id: "before-forever-030", src: photo030.url, width: 1440, height: 1920, alt: "Sharanya kissing Sahil on the cheek as he smiles for a selfie" },
      { id: "before-forever-031", src: photo031.url, width: 1920, height: 1081, alt: "Sharanya and Sahil with friends and a dog on a rocky overlook under a blue sky" },
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
