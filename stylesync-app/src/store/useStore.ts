import { create } from 'zustand';
import type {
  ClothingItem, Outfit, OutfitItem, MannequinConfig,
  CalendarEntry, AppSection, Category, Season, Occasion
} from '../types/index';

interface Filters {
  search: string;
  category: Category | 'all';
  color: string;
  season: Season | 'all';
  occasion: Occasion | 'all';
  brand: string;
  favouritesOnly: boolean;
}


interface AppState {
  // Nav
  activeSection: AppSection;
  setActiveSection: (s: AppSection) => void;

  // Wardrobe
  wardrobe: ClothingItem[];
  addClothingItem: (item: ClothingItem) => void;
  removeClothingItem: (id: string) => void;
  toggleFavouriteItem: (id: string) => void;
  updateClothingItem: (id: string, updates: Partial<ClothingItem>) => void;

  // Filters
  filters: Filters;
  setFilter: (key: keyof Filters, value: string | boolean) => void;
  resetFilters: () => void;
  filteredWardrobe: () => ClothingItem[];

  // Mannequin
  mannequin: MannequinConfig;
  setMannequin: (config: Partial<MannequinConfig>) => void;

  // Builder
  builderItems: OutfitItem[];
  addToBuilder: (item: OutfitItem) => void;
  updateBuilderItem: (itemId: string, updates: Partial<OutfitItem>) => void;
  removeFromBuilder: (itemId: string) => void;
  clearBuilder: () => void;

  // Outfits
  outfits: Outfit[];
  saveOutfit: (name: string, occasion?: Occasion) => void;
  removeOutfit: (id: string) => void;
  toggleFavouriteOutfit: (id: string) => void;
  loadOutfit: (id: string) => void;
  comparedOutfits: string[];
  toggleCompare: (id: string) => void;

  // Calendar
  calendarEntries: CalendarEntry[];
  addCalendarEntry: (entry: CalendarEntry) => void;
  removeCalendarEntry: (date: string) => void;
}

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  color: '',
  season: 'all',
  occasion: 'all',
  brand: '',
  favouritesOnly: false,
};

const defaultMannequin: MannequinConfig = {
  gender: 'women',
  height: 'average',
  bodyShape: 'slim',
  skinTone: 'medium',
};

// Seed data for demo
const seedItems: ClothingItem[] = [
  { id: 's1', name: 'White Linen Shirt', category: 'tops', imageUrl: '', color: 'white', season: 'summer', occasion: 'casual', brand: 'Arket', style: 'minimalist', isFavourite: true, addedAt: Date.now() - 5000 },
  { id: 's2', name: 'Black Tailored Trousers', category: 'bottoms', imageUrl: '', color: 'black', season: 'all', occasion: 'work', brand: 'COS', style: 'classic', isFavourite: false, addedAt: Date.now() - 4000 },
  { id: 's3', name: 'Camel Wool Coat', category: 'jackets', imageUrl: '', color: 'camel', season: 'winter', occasion: 'work', brand: 'Massimo Dutti', style: 'classic', isFavourite: true, addedAt: Date.now() - 3000 },
  { id: 's4', name: 'Slip Midi Dress', category: 'dresses', imageUrl: '', color: 'sage', season: 'spring', occasion: 'casual', brand: '& Other Stories', style: 'romantic', isFavourite: false, addedAt: Date.now() - 2000 },
  { id: 's5', name: 'White Leather Trainers', category: 'shoes', imageUrl: '', color: 'white', season: 'all', occasion: 'casual', brand: 'Veja', style: 'minimalist', isFavourite: true, addedAt: Date.now() - 1500 },
  { id: 's6', name: 'Gold Hoop Earrings', category: 'accessories', imageUrl: '', color: 'gold', season: 'all', occasion: 'casual', brand: 'Mejuri', style: 'minimalist', isFavourite: false, addedAt: Date.now() - 1000 },
  { id: 's7', name: 'Striped Breton Top', category: 'tops', imageUrl: '', color: 'navy', season: 'spring', occasion: 'casual', brand: 'Saint James', style: 'classic', isFavourite: false, addedAt: Date.now() - 800 },
  { id: 's8', name: 'High-waist Jeans', category: 'bottoms', imageUrl: '', color: 'blue', season: 'all', occasion: 'casual', brand: 'Levi\'s', style: 'classic', isFavourite: true, addedAt: Date.now() - 600 },
];

export const useStore = create<AppState>((set, get) => ({
  activeSection: 'wardrobe',
  setActiveSection: (s) => set({ activeSection: s }),

  wardrobe: seedItems,
  addClothingItem: (item) => set((state) => ({ wardrobe: [item, ...state.wardrobe] })),
  removeClothingItem: (id) => set((state) => ({ wardrobe: state.wardrobe.filter(i => i.id !== id) })),
  toggleFavouriteItem: (id) => set((state) => ({
    wardrobe: state.wardrobe.map(i => i.id === id ? { ...i, isFavourite: !i.isFavourite } : i)
  })),
  updateClothingItem: (id, updates) => set((state) => ({
    wardrobe: state.wardrobe.map(i => i.id === id ? { ...i, ...updates } : i)
  })),

  filters: defaultFilters,
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),
  filteredWardrobe: () => {
    const { wardrobe, filters } = get();
    return wardrobe.filter(item => {
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !item.brand.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
      if (filters.season !== 'all' && item.season !== filters.season && item.season !== 'all') return false;
      if (filters.occasion !== 'all' && item.occasion !== filters.occasion) return false;
      if (filters.brand && !item.brand.toLowerCase().includes(filters.brand.toLowerCase())) return false;
      if (filters.favouritesOnly && !item.isFavourite) return false;
      return true;
    });
  },

  mannequin: defaultMannequin,
  setMannequin: (config) => set((state) => ({ mannequin: { ...state.mannequin, ...config } })),

  builderItems: [],
  addToBuilder: (item) => set((state) => {
    const exists = state.builderItems.find(i => i.itemId === item.itemId);
    if (exists) return state;
    return { builderItems: [...state.builderItems, item] };
  }),
  updateBuilderItem: (itemId, updates) => set((state) => ({
    builderItems: state.builderItems.map(i => i.itemId === itemId ? { ...i, ...updates } : i)
  })),
  removeFromBuilder: (itemId) => set((state) => ({
    builderItems: state.builderItems.filter(i => i.itemId !== itemId)
  })),
  clearBuilder: () => set({ builderItems: [] }),

  outfits: [],
  saveOutfit: (name, occasion) => {
    const { builderItems } = get();
    if (builderItems.length === 0) return;
    const outfit: Outfit = {
      id: `outfit-${Date.now()}`,
      name,
      items: [...builderItems],
      createdAt: Date.now(),
      isFavourite: false,
      occasion,
    };
    set((state) => ({ outfits: [outfit, ...state.outfits] }));
  },
  removeOutfit: (id) => set((state) => ({
    outfits: state.outfits.filter(o => o.id !== id),
    comparedOutfits: state.comparedOutfits.filter(cid => cid !== id),
  })),
  toggleFavouriteOutfit: (id) => set((state) => ({
    outfits: state.outfits.map(o => o.id === id ? { ...o, isFavourite: !o.isFavourite } : o)
  })),
  loadOutfit: (id) => {
    const outfit = get().outfits.find(o => o.id === id);
    if (outfit) {
      set({ builderItems: [...outfit.items], activeSection: 'builder' });
    }
  },
  comparedOutfits: [],
  toggleCompare: (id) => set((state) => {
    const already = state.comparedOutfits.includes(id);
    if (already) return { comparedOutfits: state.comparedOutfits.filter(cid => cid !== id) };
    if (state.comparedOutfits.length >= 2) return { comparedOutfits: [state.comparedOutfits[1], id] };
    return { comparedOutfits: [...state.comparedOutfits, id] };
  }),

  calendarEntries: [],
  addCalendarEntry: (entry) => set((state) => ({
    calendarEntries: [...state.calendarEntries.filter(e => e.date !== entry.date), entry]
  })),
  removeCalendarEntry: (date) => set((state) => ({
    calendarEntries: state.calendarEntries.filter(e => e.date !== date)
  })),
}));