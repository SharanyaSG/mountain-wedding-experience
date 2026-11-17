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
import photo001 from "@/assets/before-forever-001.jpg";
import photo002 from "@/assets/before-forever-002.jpg";
import photo003 from "@/assets/before-forever-003.jpg";
import photo004 from "@/assets/before-forever-004.jpg";
import photo005 from "@/assets/before-forever-005.jpg";
import photo006 from "@/assets/before-forever-006.jpg";
import photo007 from "@/assets/before-forever-007.jpg";
import photo008 from "@/assets/before-forever-008.jpg";
import photo009 from "@/assets/before-forever-009.jpg";
import photo010 from "@/assets/before-forever-010.jpg";
import photo011 from "@/assets/before-forever-011.jpg";
import photo012 from "@/assets/before-forever-012.jpg";
import photo013 from "@/assets/before-forever-013.jpg";
import photo014 from "@/assets/before-forever-014.jpg";
import photo015 from "@/assets/before-forever-015.jpg";
import photo016 from "@/assets/before-forever-016.jpg";
import photo017 from "@/assets/before-forever-017.jpg";
import photo018 from "@/assets/before-forever-018.jpg";
import photo019 from "@/assets/before-forever-019.jpg";
import photo020 from "@/assets/before-forever-020.jpg";
import photo021 from "@/assets/before-forever-021.jpg";
import photo022 from "@/assets/before-forever-022.jpg";
import photo023 from "@/assets/before-forever-023.jpg";
import photo024 from "@/assets/before-forever-024.jpg";
import photo025 from "@/assets/before-forever-025.jpg";
import photo026 from "@/assets/before-forever-026.jpg";
import photo027 from "@/assets/before-forever-027.jpg";
import photo028 from "@/assets/before-forever-028.jpg";
import photo029 from "@/assets/before-forever-029.jpg";
import photo030 from "@/assets/before-forever-030.jpg";
import photo031 from "@/assets/before-forever-031.jpg";
import proposal001 from "@/assets/the-proposals-001.jpg";
import proposal002 from "@/assets/the-proposals-002.jpg";
import proposal003 from "@/assets/the-proposals-003.jpg";
import proposal004 from "@/assets/the-proposals-004.jpg";
import proposal005 from "@/assets/the-proposals-005.jpg";
import proposal006 from "@/assets/the-proposals-006.jpg";
import proposal007 from "@/assets/the-proposals-007.jpg";
import proposal008 from "@/assets/the-proposals-008.jpg";
import proposal009 from "@/assets/the-proposals-009.jpg";
import proposal010 from "@/assets/the-proposals-010.jpg";
import proposal011 from "@/assets/the-proposals-011.webp";
import proposal012 from "@/assets/the-proposals-012.jpg";
import proposal013 from "@/assets/the-proposals-013.jpg";
import wedding001 from "@/assets/we-said-yes-001.jpg";
import wedding002 from "@/assets/we-said-yes-002.jpg";
import wedding003 from "@/assets/we-said-yes-003.jpg";
import wedding004 from "@/assets/we-said-yes-004.jpg";
import wedding005 from "@/assets/we-said-yes-005.jpg";
import wedding006 from "@/assets/we-said-yes-006.jpg";
import wedding007 from "@/assets/we-said-yes-007.jpg";
import wedding008 from "@/assets/we-said-yes-008.jpg";
import wedding009 from "@/assets/we-said-yes-009.jpg";
import wedding010 from "@/assets/we-said-yes-010.jpg";
import wedding011 from "@/assets/we-said-yes-011.jpg";
import wedding012 from "@/assets/we-said-yes-012.jpg";
import wedding013 from "@/assets/we-said-yes-013.jpg";
import wedding014 from "@/assets/we-said-yes-014.jpg";
import wedding015 from "@/assets/we-said-yes-015.jpg";
import wedding016 from "@/assets/we-said-yes-016.jpg";
import wedding017 from "@/assets/we-said-yes-017.jpg";
import life001 from "@/assets/life-lately-001.webp";
import life002 from "@/assets/life-lately-002.jpg";
import life003 from "@/assets/life-lately-003.jpg";
import life004 from "@/assets/life-lately-004.jpg";
import life005 from "@/assets/life-lately-005.webp";
import life006 from "@/assets/life-lately-006.jpg";
import life007 from "@/assets/life-lately-007.webp";
import life008 from "@/assets/life-lately-008.webp";
import life009 from "@/assets/life-lately-009.webp";
import life010 from "@/assets/life-lately-010.webp";
import life011 from "@/assets/life-lately-011.webp";
import life012 from "@/assets/life-lately-012.webp";
import life013 from "@/assets/life-lately-013.webp";
import life014 from "@/assets/life-lately-014.webp";
import life015 from "@/assets/life-lately-015.webp";
import life016 from "@/assets/life-lately-016.webp";
import life017 from "@/assets/life-lately-017.webp";
import life018 from "@/assets/life-lately-018.webp";
import life019 from "@/assets/life-lately-019.webp";
import life020 from "@/assets/life-lately-020.jpg";
import life021 from "@/assets/life-lately-021.webp";
import life022 from "@/assets/life-lately-022.webp";
import life023 from "@/assets/life-lately-023.webp";
import life024 from "@/assets/life-lately-024.webp";
import life025 from "@/assets/life-lately-025.webp";
import life026 from "@/assets/life-lately-026.webp";
import life027 from "@/assets/life-lately-027.webp";
import life028 from "@/assets/life-lately-028.webp";

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
      { id: "before-forever-001", src: photo001, width: 1080, height: 1920, alt: "Sharanya and Sahil smiling and embracing indoors" },
      { id: "before-forever-002", src: photo002, width: 2000, height: 1500, alt: "Sharanya and Sahil with friends in a snowy outdoor plaza" },
      { id: "before-forever-003", src: photo003, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a close-up selfie together at night" },
      { id: "before-forever-004", src: photo004, width: 1920, height: 1440, alt: "Sharanya and Sahil sitting together outdoors in the sunshine" },
      { id: "before-forever-005", src: photo005, width: 1440, height: 1920, alt: "Sharanya and Sahil posing together in a decorated room" },
      { id: "before-forever-006", src: photo006, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a selfie under blue lighting" },
      { id: "before-forever-007", src: photo007, width: 1500, height: 2000, alt: "Sharanya and Sahil beside a Christmas tree wearing festive red outfits" },
      { id: "before-forever-008", src: photo008, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together under red lighting" },
      { id: "before-forever-009", src: photo009, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling together in front of wall artwork" },
      { id: "before-forever-010", src: photo010, width: 1440, height: 1920, alt: "Sharanya and Sahil taking an outdoor selfie beside trees" },
      { id: "before-forever-011", src: photo011, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling together indoors beside a window" },
      { id: "before-forever-012", src: photo012, width: 1440, height: 1920, alt: "Sharanya and Sahil embracing in front of a fireplace" },
      { id: "before-forever-013", src: photo013, width: 1440, height: 1920, alt: "Sharanya and Sahil posing together in front of a red event backdrop" },
      { id: "before-forever-014", src: photo014, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a selfie with a friend indoors" },
      { id: "before-forever-015", src: photo015, width: 1920, height: 1440, alt: "Sharanya and Sahil with a friend in graduation caps and gowns" },
      { id: "before-forever-016", src: photo016, width: 1440, height: 1920, alt: "Sharanya and Sahil standing with friends indoors" },
      { id: "before-forever-017", src: photo017, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a group selfie with friends at a table" },
      { id: "before-forever-018", src: photo018, width: 1920, height: 1440, alt: "Sharanya and Sahil standing together beside a railing at night" },
      { id: "before-forever-019", src: photo019, width: 1284, height: 939, alt: "Sharanya and Sahil smiling in a group selfie with friends" },
      { id: "before-forever-020", src: photo020, width: 1545, height: 1024, alt: "Sharanya and Sahil gathered with friends for a group photograph indoors" },
      { id: "before-forever-021", src: photo021, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together outside a brewery" },
      { id: "before-forever-022", src: photo022, width: 1920, height: 1440, alt: "Sharanya and Sahil with friends at a restaurant table" },
      { id: "before-forever-023", src: photo023, width: 1440, height: 1920, alt: "Sharanya and Sahil posing with friends in front of a painted wall" },
      { id: "before-forever-024", src: photo024, width: 1920, height: 1440, alt: "Sharanya and Sahil gathered with friends for an indoor group selfie" },
      { id: "before-forever-025", src: photo025, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together in the snow at night" },
      { id: "before-forever-026", src: photo026, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a playful close-up selfie indoors" },
      { id: "before-forever-027", src: photo027, width: 1600, height: 1200, alt: "Sharanya and Sahil standing with friends for a group photograph indoors" },
      { id: "before-forever-028", src: photo028, width: 1440, height: 1920, alt: "Sharanya and Sahil in graduation caps and gowns holding their diplomas" },
      { id: "before-forever-029", src: photo029, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a selfie together outdoors in the sunshine" },
      { id: "before-forever-030", src: photo030, width: 1440, height: 1920, alt: "Sharanya kissing Sahil on the cheek as he smiles for a selfie" },
      { id: "before-forever-031", src: photo031, width: 1920, height: 1081, alt: "Sharanya and Sahil with friends and a dog on a rocky overlook under a blue sky" },
    ],
  },
  {
    id: "the-proposals",
    n: "02",
    title: "The Proposals",
    description: "The two times we proposed to each other.",
    coverPhotoId: null,
    // Append subsequent batches in upload order; no final cover has been selected.
    photos: [
      { id: "the-proposals-001", src: proposal001, width: 1080, height: 1920, alt: "Sharanya and Sahil showing their rings together" },
      { id: "the-proposals-002", src: proposal002, width: 1280, height: 1920, alt: "Sahil kneeling to propose to Sharanya beside the snowy waterfront" },
      { id: "the-proposals-003", src: proposal003, width: 1280, height: 1920, alt: "Black-and-white photograph of Sahil kissing Sharanya on the forehead" },
      { id: "the-proposals-004", src: proposal004, width: 1280, height: 1920, alt: "Sharanya touching Sahil's cheek as they smile together" },
      { id: "the-proposals-005", src: proposal005, width: 1280, height: 1920, alt: "Sharanya kneeling to propose to Sahil beside the snowy waterfront" },
      { id: "the-proposals-006", src: proposal006, width: 1280, height: 1920, alt: "Black-and-white photograph of Sahil embracing Sharanya as she laughs" },
      { id: "the-proposals-007", src: proposal007, width: 1280, height: 1920, alt: "Sharanya smiling with a bouquet as Sahil kneels in front of her" },
      { id: "the-proposals-008", src: proposal008, width: 1280, height: 1920, alt: "Close-up of Sharanya's ring as Sahil holds her hand" },
      { id: "the-proposals-009", src: proposal009, width: 1280, height: 1920, alt: "Sharanya and Sahil standing together in front of a yellow Ferris wheel" },
      { id: "the-proposals-010", src: proposal010, width: 1280, height: 1920, alt: "Sharanya smiling and showing her ring while holding a bouquet" },
      { id: "the-proposals-011", src: proposal011, width: 1440, height: 1920, alt: "Sahil and Sharanya showing their rings with outstretched hands" },
      { id: "the-proposals-012", src: proposal012, width: 1280, height: 1920, alt: "Sharanya and Sahil smiling with a friend and a bouquet beneath a wooden canopy" },
      { id: "the-proposals-013", src: proposal013, width: 1920, height: 1280, alt: "Sharanya and Sahil with a friend holding a Will You Marry Me banner beside the snowy waterfront" },
    ],
  },
  {
    id: "we-said-yes",
    n: "03",
    title: "We Said Yes",
    description: "Our courthouse wedding and the day we officially got married.",
    coverPhotoId: null,
    // Append subsequent batches in upload order; the first photo is a temporary fallback only.
    photos: [
      { id: "we-said-yes-001", src: wedding001, width: 1280, height: 1920, alt: "Sharanya and Sahil kissing in front of a Married in Boston backdrop" },
      { id: "we-said-yes-002", src: wedding002, width: 1920, height: 1280, alt: "Sharanya and Sahil seated with friends and family at the courthouse" },
      { id: "we-said-yes-003", src: wedding003, width: 1920, height: 1280, alt: "Sharanya and Sahil sitting together with guests at the courthouse" },
      { id: "we-said-yes-004", src: wedding004, width: 1920, height: 1280, alt: "Close-up of Sharanya and Sahil holding hands while seated" },
      { id: "we-said-yes-005", src: wedding005, width: 1280, height: 1920, alt: "Black-and-white photograph of Sharanya and Sahil celebrating outdoors with a bouquet" },
      { id: "we-said-yes-006", src: wedding006, width: 1280, height: 1920, alt: "Black-and-white photograph of Sharanya and Sahil smiling at each other outdoors" },
      { id: "we-said-yes-007", src: wedding007, width: 1280, height: 1920, alt: "Black-and-white photograph of Sahil kissing Sharanya's cheek outdoors" },
      { id: "we-said-yes-008", src: wedding008, width: 1280, height: 1920, alt: "A wedding celebration welcome sign for Sahil and Sharanya" },
      { id: "we-said-yes-009", src: wedding009, width: 1280, height: 1920, alt: "Black-and-white photograph of Sharanya and Sahil raising glasses at their celebration" },
      { id: "we-said-yes-010", src: wedding010, width: 1920, height: 1280, alt: "Sharanya and Sahil with friends and family for a group photograph at their celebration" },
      { id: "we-said-yes-011", src: wedding011, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together at home in red and ivory outfits" },
      { id: "we-said-yes-012", src: wedding012, width: 1920, height: 1280, alt: "Sharanya and Sahil posing with family at the courthouse" },
      { id: "we-said-yes-013", src: wedding013, width: 1086, height: 1920, alt: "Sharanya smiling with a family member during a celebration at home" },
      { id: "we-said-yes-014", src: wedding014, width: 1099, height: 1920, alt: "Sahil with family during a celebration at home" },
      { id: "we-said-yes-015", src: wedding015, width: 1105, height: 1920, alt: "Sharanya placing a handprint on a sheet beside a family member" },
      { id: "we-said-yes-016", src: wedding016, width: 1112, height: 1920, alt: "Sahil placing a handprint beside Sharanya's during a celebration at home" },
      { id: "we-said-yes-017", src: wedding017, width: 1920, height: 1280, alt: "Sharanya and Sahil smiling with friends at their wedding celebration" },
    ],
  },
  {
    id: "life-lately",
    n: "04",
    title: "Life Lately",
    description: "Our adventures, celebrations, travels, and everyday memories from the past year.",
    coverPhotoId: null,
    // Append subsequent batches in upload order; no final cover has been selected.
    photos: [
      { id: "life-lately-001", src: life001, width: 1920, height: 1440, alt: "Sharanya and Sahil lying together on a picnic blanket outdoors" },
      { id: "life-lately-002", src: life002, width: 1920, height: 1440, alt: "Sharanya and Sahil standing together outside a restaurant" },
      { id: "life-lately-003", src: life003, width: 1080, height: 1920, alt: "Sharanya seen through a wine glass at an outdoor table" },
      { id: "life-lately-004", src: life004, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a selfie outdoors surrounded by greenery" },
      { id: "life-lately-005", src: life005, width: 1920, height: 1440, alt: "Sharanya and Sahil posing with friends in a garden" },
      { id: "life-lately-006", src: life006, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling for a selfie beside windows" },
      { id: "life-lately-007", src: life007, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together beside the waterfront" },
      { id: "life-lately-008", src: life008, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a group selfie with friends indoors" },
      { id: "life-lately-009", src: life009, width: 1920, height: 1440, alt: "Sharanya and Sahil smiling together under warm red lighting" },
      { id: "life-lately-010", src: life010, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a close-up selfie outdoors" },
      { id: "life-lately-011", src: life011, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a selfie beside a lake" },
      { id: "life-lately-012", src: life012, width: 1920, height: 1440, alt: "Sharanya and Sahil standing beside a large rock overlooking the water" },
      { id: "life-lately-013", src: life013, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a selfie on a brick walkway" },
      { id: "life-lately-014", src: life014, width: 1920, height: 1440, alt: "Sharanya and Sahil enjoying a boat ride on the water" },
      { id: "life-lately-015", src: life015, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling together on a lawn near the water" },
      { id: "life-lately-016", src: life016, width: 1920, height: 1440, alt: "Sharanya and Sahil posing with friends outdoors surrounded by trees" },
      { id: "life-lately-017", src: life017, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a selfie inside a restaurant" },
      { id: "life-lately-018", src: life018, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling together for a selfie at home" },
      { id: "life-lately-019", src: life019, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a selfie with a friend outside a restaurant" },
      { id: "life-lately-020", src: life020, width: 1320, height: 869, alt: "Sharanya and Sahil posing with friends and playful party signs" },
      { id: "life-lately-021", src: life021, width: 1440, height: 1920, alt: "Sahil smiling at a restaurant table with food served on banana leaves" },
      { id: "life-lately-022", src: life022, width: 1440, height: 1920, alt: "Sharanya and Sahil standing together on a sidewalk beside a parked car" },
      { id: "life-lately-023", src: life023, width: 1920, height: 1440, alt: "Sharanya and Sahil sitting together at a restaurant table beside windows" },
      { id: "life-lately-024", src: life024, width: 1440, height: 1920, alt: "Sharanya and Sahil in festive outfits in front of a gold backdrop" },
      { id: "life-lately-025", src: life025, width: 1440, height: 1920, alt: "Sharanya and Sahil taking a close-up selfie in front of a gold backdrop" },
      { id: "life-lately-026", src: life026, width: 1440, height: 1920, alt: "Sharanya and Sahil smiling together for a selfie in festive outfits" },
      { id: "life-lately-027", src: life027, width: 1440, height: 1920, alt: "Sharanya and Sahil posing together for a selfie at a celebration" },
      { id: "life-lately-028", src: life028, width: 1920, height: 1440, alt: "Sharanya and Sahil taking a group selfie with friends in stadium seats" },
    ],
  },
];
