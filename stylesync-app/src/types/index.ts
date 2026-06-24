export type Category = 'tops' | 'bottoms' | 'dresses' | 'jackets' | 'shoes' | 'accessories';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
export type Occasion = 'casual' | 'work' | 'formal' | 'sport' | 'holiday';
export type Gender = 'women' | 'men' | 'kids';
export type BodyShape = 'slim' | 'curvy' | 'plus-sized' | 'athletic' | 'broad';
export type SkinTone = 'light' | 'medium' | 'dark';
export type HeightRange = 'short' | 'average' | 'tall';
export type KidsGender = 'boys' | 'girls';

export interface ClothingItem {
  id: string;
  name: string;
  category: Category;
  imageUrl: string;
  color: string;
  season: Season;
  occasion: Occasion;
  brand: string;
  style: string;
  isFavourite: boolean;
  addedAt: number;
}
export type AppSection =
  | 'wardrobe'
  | 'builder'
  | 'history'
  | 'calendar'
  | 'inspiration';
  
export interface OutfitItem {
  itemId: string;
  item: ClothingItem;

  x: number;
  y: number;
  zIndex: number;
  rotation: number;
  scale: number;
}

export interface Outfit {
  id: string;
  name: string;
  items: OutfitItem[];
  createdAt: number;
  isFavourite: boolean;
  occasion?: Occasion;
}

export interface MannequinConfig {
  gender: Gender;
  kidsGender?: KidsGender;
  height: HeightRange;
  bodyShape: BodyShape;
  skinTone: SkinTone;
}

export interface CalendarEntry {
  date: string; // ISO date string YYYY-MM-DD
  outfitId: string;
  occasion?: Occasion;
  note?: string;
}