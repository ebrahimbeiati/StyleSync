import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useStore } from '../store/useStore';
import type { ClothingItem, Category, Season, Occasion } from '../types';
import { Heart, Trash2, Upload, Search, X, SlidersHorizontal, Plus, Star } from 'lucide-react';

const CATEGORY_COLORS: Record<Category, string> = {
  tops: '#8A9E8A',
  bottoms: '#9E8A8A',
  dresses: '#8A8A9E',
  jackets: '#9E9A8A',
  shoes: '#8A9A9E',
  accessories: '#9E8A9A',
};

const ITEM_PLACEHOLDER_ICONS: Record<Category, string> = {
  tops: '👕',
  bottoms: '👖',
  dresses: '👗',
  jackets: '🧥',
  shoes: '👠',
  accessories: '💍',
};

function AddItemModal({ onClose }: { onClose: () => void }) {
  const { addClothingItem } = useStore();
  const [form, setForm] = useState<Partial<ClothingItem>>({
    name: '', category: 'tops', color: '', season: 'all',
    occasion: 'casual', brand: '', style: '',
  });
  const [imageUrl, setImageUrl] = useState('');

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1,
  });

  const handleSave = () => {
    if (!form.name) return;
    const item: ClothingItem = {
      id: `item-${Date.now()}`,
      name: form.name!,
      category: (form.category || 'tops') as Category,
      imageUrl,
      color: form.color || '',
      season: (form.season || 'all') as Season,
      occasion: (form.occasion || 'casual') as Occasion,
      brand: form.brand || '',
      style: form.style || '',
      isFavourite: false,
      addedAt: Date.now(),
    };
    addClothingItem(item);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} onClick={onClose}>
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: 28, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22 }}>Add Clothing Item</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Dropzone */}
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 12, padding: 32, textAlign: 'center',
          cursor: 'pointer', marginBottom: 20, transition: 'border-color 0.15s',
          background: isDragActive ? 'var(--accent-dim)' : 'transparent',
        }}>
          <input {...getInputProps()} />
          {imageUrl ? (
            <img src={imageUrl} alt="preview" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 8, margin: '0 auto' }} />
          ) : (
            <div>
              <Upload size={28} style={{ color: 'var(--accent)', margin: '0 auto 8px' }} />
              <p style={{ color: 'var(--ivory-dim)', fontSize: 13 }}>Drag & drop or click to upload</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Name *</label>
            <input placeholder="e.g. White Linen Shirt" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="dresses">Dresses</option>
              <option value="jackets">Jackets</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>color</label>
            <input placeholder="e.g. navy blue" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Season</label>
            <select value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value as Season }))}>
              <option value="all">All seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Occasion</label>
            <select value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value as Occasion }))}>
              <option value="casual">Casual</option>
              <option value="work">Work</option>
              <option value="formal">Formal</option>
              <option value="sport">Sport</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Brand</label>
            <input placeholder="e.g. Arket" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Style</label>
            <input placeholder="e.g. minimalist" value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} style={{ flex: 2 }}>Add to Wardrobe</button>
        </div>
      </div>
    </div>
  );
}

function ClothingCard({ item }: { item: ClothingItem }) {
  const { toggleFavouriteItem, removeClothingItem, addToBuilder, setActiveSection } = useStore();
  const color = CATEGORY_COLORS[item.category];

  return (
    <div className="card" style={{
      overflow: 'hidden', cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(232,180,160,0.3)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Image area */}
      <div style={{
        height: 140, background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48, position: 'relative',
      }}>
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          : <span>{ITEM_PLACEHOLDER_ICONS[item.category]}</span>
        }
        {/* Actions overlay */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavouriteItem(item.id); }}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(10,10,10,0.7)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: item.isFavourite ? '#E8B4A0' : 'rgba(245,240,232,0.6)',
            }}
          >
            <Heart size={13} fill={item.isFavourite ? '#E8B4A0' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); removeClothingItem(item.id); }}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(10,10,10,0.7)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(245,240,232,0.6)',
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
        {item.isFavourite && (
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <Star size={12} fill="#E8B4A0" color="#E8B4A0" />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ivory)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          <span className="tag">{item.category}</span>
          {item.season !== 'all' && <span className="tag">{item.season}</span>}
        </div>
        {item.brand && (
          <div style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>{item.brand}</div>
        )}
    <button
  onClick={() => {
    addToBuilder({ 
      itemId: item.id, 
      item,
      x: 120 + Math.random() * 80, 
      y: 100 + Math.random() * 80, 
      zIndex: 1, 
      rotation: 0, 
      scale: 1 
    });

    setActiveSection('builder');
  }}
>
  + Add to Builder
</button>
      </div>
    </div>
  );
}

export function WardrobePage() {
  const { filteredWardrobe, filters, setFilter, resetFilters } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const items = filteredWardrobe();
  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'jackets', label: 'Jackets' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'accessories', label: 'Accessories' },
  ];

  return (
    <div style={{ padding: 32, flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>My Wardrobe</h1>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 14 }}>{items.length} item{items.length !== 1 ? 's' : ''} in your collection</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Add Item
        </button>
      </div>

      {/* Search + Filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ivory-dim)' }} />
          <input
            placeholder="Search by name or brand…"
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>
        <button
          className="btn-ghost"
          onClick={() => setShowFilters(f => !f)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, borderColor: showFilters ? 'var(--accent)' : undefined, color: showFilters ? 'var(--accent)' : undefined }}
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
        {(filters.color || filters.brand || filters.season !== 'all' || filters.occasion !== 'all' || filters.favouritesOnly) && (
          <button className="btn-ghost" onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="card" style={{ padding: 16, marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Color</label>
            <input placeholder="any color" value={filters.color} onChange={e => setFilter('color', e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Season</label>
            <select value={filters.season} onChange={e => setFilter('season', e.target.value)}>
              <option value="all">All seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Occasion</label>
            <select value={filters.occasion} onChange={e => setFilter('occasion', e.target.value)}>
              <option value="all">All occasions</option>
              <option value="casual">Casual</option>
              <option value="work">Work</option>
              <option value="formal">Formal</option>
              <option value="sport">Sport</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Brand</label>
            <input placeholder="brand name" value={filters.brand} onChange={e => setFilter('brand', e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
            <input type="checkbox" id="fav-filter" checked={filters.favouritesOnly}
              onChange={e => setFilter('favouritesOnly', e.target.checked)}
              style={{ width: 14, height: 14 }} />
            <label htmlFor="fav-filter" style={{ fontSize: 13, color: 'var(--ivory-dim)', cursor: 'pointer' }}>Favourites only</label>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter('category', cat.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: filters.category === cat.id ? 'var(--accent)' : 'var(--border)',
              background: filters.category === cat.id ? 'var(--accent-dim)' : 'transparent',
              color: filters.category === cat.id ? 'var(--accent)' : 'var(--ivory-dim)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
          >{cat.label}</button>
        ))}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ivory-dim)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👗</div>
          <p style={{ fontSize: 16, marginBottom: 4 }}>Your wardrobe is empty</p>
          <p style={{ fontSize: 13, marginBottom: 20 }}>Upload your first clothing item to get started</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Add First Item</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {items.map(item => <ClothingCard key={item.id} item={item} />)}
        </div>
      )}

      {showModal && <AddItemModal onClose={() => setShowModal(false)} />}
    </div>
  );
}