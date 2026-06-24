import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Heart, Trash2, Play, GitCompare } from 'lucide-react';

const ITEM_PLACEHOLDER_ICONS: Record<string, string> = {
  tops: '👕', bottoms: '👖', dresses: '👗',
  jackets: '🧥', shoes: '👠', accessories: '💍',
};

function OutfitPreview({ outfitId }: { outfitId: string }) {
  const { outfits, wardrobe } = useStore();
  const outfit = outfits.find(o => o.id === outfitId);
  if (!outfit) return null;

  const items = outfit.items.map(bi => wardrobe.find(w => w.id === bi.itemId)).filter(Boolean);

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 16, minHeight: 160,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, marginBottom: 12 }}>{outfit.name}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
        {items.map((item, i) => item && (
          <div key={i} style={{ fontSize: 28 }}>
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
              : ITEM_PLACEHOLDER_ICONS[item.category]
            }
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        {outfit.occasion && <span className="tag">{outfit.occasion}</span>}
      </div>
    </div>
  );
}

export function HistoryPage() {
  const {
    outfits, removeOutfit, toggleFavouriteOutfit,
    loadOutfit, comparedOutfits, toggleCompare, wardrobe,
  } = useStore();
  const [showCompare, setShowCompare] = useState(false);

  const sorted = [...outfits].sort((a, b) => b.createdAt - a.createdAt);
  const favourites = sorted.filter(o => o.isFavourite);
  const rest = sorted.filter(o => !o.isFavourite);

  const ITEM_ICONS: Record<string, string> = {
    tops: '👕', bottoms: '👖', dresses: '👗', jackets: '🧥', shoes: '👠', accessories: '💍',
  };

  function OutfitCard({ outfit }: { outfit: typeof outfits[0] }) {
    const items = outfit.items.map(bi => wardrobe.find(w => w.id === bi.itemId)).filter(Boolean);
    const isCompared = comparedOutfits.includes(outfit.id);

    return (
      <div className="card" style={{
        overflow: 'hidden', transition: 'all 0.2s',
        border: isCompared ? '1px solid rgba(232,180,160,0.5)' : undefined,
      }}>
        {/* Preview area */}
        <div style={{
          height: 100, background: '#161616', padding: 12,
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          position: 'relative',
        }}>
          {items.map((item, i) => item && (
            <div key={i} style={{ fontSize: 24 }}>
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                : ITEM_ICONS[item.category]
              }
            </div>
          ))}
          {items.length === 0 && (
            <span style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>No items</span>
          )}
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
            <button
              onClick={() => toggleFavouriteOutfit(outfit.id)}
              style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(10,10,10,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: outfit.isFavourite ? '#E8B4A0' : 'rgba(245,240,232,0.6)' }}
            >
              <Heart size={11} fill={outfit.isFavourite ? '#E8B4A0' : 'none'} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontSize: 14, fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{outfit.name}</div>
          <div style={{ fontSize: 11, color: 'var(--ivory-dim)', marginBottom: 8 }}>
            {new Date(outfit.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          {outfit.occasion && <span className="tag" style={{ marginBottom: 10, display: 'inline-block' }}>{outfit.occasion}</span>}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <button
              className="btn-ghost"
              onClick={() => loadOutfit(outfit.id)}
              style={{ flex: 1, padding: '6px 8px', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <Play size={11} /> Load
            </button>
            <button
              onClick={() => toggleCompare(outfit.id)}
              style={{
                flex: 1, padding: '6px 8px', fontSize: 11, borderRadius: 8, border: '1px solid',
                borderColor: isCompared ? 'rgba(232,180,160,0.5)' : 'var(--border)',
                background: isCompared ? 'var(--accent-dim)' : 'transparent',
                color: isCompared ? 'var(--accent)' : 'var(--ivory-dim)',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                transition: 'all 0.15s',
              }}
            >
              <GitCompare size={11} /> {isCompared ? '✓' : 'Compare'}
            </button>
            <button
              onClick={() => removeOutfit(outfit.id)}
              style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'rgba(245,240,232,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#E88A8A'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E88A8A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,240,232,0.4)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>Outfit History</h1>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 14 }}>{outfits.length} saved outfit{outfits.length !== 1 ? 's' : ''} this session</p>
        </div>
        {comparedOutfits.length === 2 && (
          <button
            className="btn-primary"
            onClick={() => setShowCompare(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <GitCompare size={14} /> Compare Selected
          </button>
        )}
      </div>

      {outfits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ivory-dim)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🪄</div>
          <p style={{ fontSize: 16, marginBottom: 4 }}>No outfits saved yet</p>
          <p style={{ fontSize: 13 }}>Head to the Outfit Builder to create your first look</p>
        </div>
      ) : (
        <>
          {favourites.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Heart size={14} fill="#E8B4A0" color="#E8B4A0" />
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)' }}>Favourites</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {favourites.map(o => <OutfitCard key={o.id} outfit={o} />)}
              </div>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              {favourites.length > 0 && (
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ivory-dim)', marginBottom: 16 }}>All Outfits</div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {rest.map(o => <OutfitCard key={o.id} outfit={o} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Compare modal */}
      {showCompare && comparedOutfits.length === 2 && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24,
        }} onClick={() => setShowCompare(false)}>
          <div className="card" style={{ padding: 28, width: '100%', maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22 }}>Side-by-Side Comparison</h2>
              <button onClick={() => setShowCompare(false)} style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <OutfitPreview outfitId={comparedOutfits[0]} />
              <OutfitPreview outfitId={comparedOutfits[1]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}