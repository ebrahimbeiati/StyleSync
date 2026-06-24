import { useState } from 'react';

type Era = 'historical' | 'modern';
type Decade = '1920s' | '1950s' | '1970s' | '1990s' | 'modern';

interface InspirationItem {
  id: string;
  era: Era;
  decade: Decade;
  title: string;
  description: string;
  icon: string;
  colors: string[];
  keyPieces: string[];
  mood: string;
}

const INSPIRATION_DATA: InspirationItem[] = [
  {
    id: '1', era: 'historical', decade: '1920s',
    title: 'The Flapper Era',
    description: 'Liberating silhouettes, dropped waists, and an attitude of rebellion. Women shed corsets and embraced movement, sparkle, and freedom.',
    icon: '✨',
    colors: ['#C5A87E', '#2C2C2C', '#8B7355', '#D4AF37'],
    keyPieces: ['Dropped waist dress', 'Cloche hat', 'Long pearl necklace', 'T-strap heels', 'Beaded headband'],
    mood: 'Liberated & Glamorous',
  },
  {
    id: '2', era: 'historical', decade: '1950s',
    title: 'The New Look',
    description: 'Dior\'s post-war response: nipped waists, full skirts, and unapologetic femininity. Elegance was everything.',
    icon: '🌹',
    colors: ['#E8B4A0', '#2E4A2E', '#C5A87E', '#1A1A2E'],
    keyPieces: ['Full circle skirt', 'Peter Pan collar', 'Kitten heels', 'White gloves', 'Poodle skirt'],
    mood: 'Polished & Feminine',
  },
  {
    id: '3', era: 'historical', decade: '1970s',
    title: 'The Bohemian Decade',
    description: 'Earth tones, flared legs, and free-spirited layering. Fashion became personal and political.',
    icon: '🌻',
    colors: ['#8B6914', '#5C4A1E', '#A0522D', '#556B2F'],
    keyPieces: ['Bell-bottom jeans', 'Peasant blouse', 'Platform shoes', 'Suede fringe jacket', 'Maxi dress'],
    mood: 'Free-spirited & Earthy',
  },
  {
    id: '4', era: 'historical', decade: '1990s',
    title: 'The Minimalist Revolution',
    description: 'Calvin Klein, Prada minimalism, and grunge collided. Less was more — or was defiantly more.',
    icon: '🖤',
    colors: ['#2C2C2C', '#8A9E8A', '#C8C8C8', '#3A3A3A'],
    keyPieces: ['Slip dress', 'Combat boots', 'Oversized blazer', 'Crop top', 'High-waist jeans'],
    mood: 'Effortless & Defiant',
  },
  {
    id: '5', era: 'modern', decade: 'modern',
    title: 'Quiet Luxury',
    description: 'No logos, no noise. The richest dressing is barely noticed — quality speaks in whispers through impeccable fabrics and precise tailoring.',
    icon: '🤍',
    colors: ['#F5F0E8', '#C8B99A', '#8A8A7E', '#3A3530'],
    keyPieces: ['Cashmere knit', 'Tailored trousers', 'Loafers', 'Leather tote', 'Trench coat'],
    mood: 'Understated & Refined',
  },
  {
    id: '6', era: 'modern', decade: 'modern',
    title: 'Gorpcore',
    description: 'Technical outdoor gear meets streetwear. Utility is the new luxury — fleeces, trail runners, and functional layering as fashion statement.',
    icon: '⛰️',
    colors: ['#4A6741', '#8B7355', '#2C4A6E', '#E8D5A0'],
    keyPieces: ['Puffer vest', 'Trail runners', 'Ripstop cargo', 'Fleece zip-up', 'Technical shell'],
    mood: 'Adventurous & Functional',
  },
  {
    id: '7', era: 'modern', decade: 'modern',
    title: 'Copenhagen Cool',
    description: 'The Scandinavian approach: intentional minimalism, sustainable choices, and effortless confidence in neutral palettes.',
    icon: '🌿',
    colors: ['#E8E4DC', '#8A9E8A', '#C4B9A8', '#3A3530'],
    keyPieces: ['Wide-leg trousers', 'Oversized blazer', 'Simple white tee', 'Leather sandals', 'Linen dress'],
    mood: 'Intentional & Serene',
  },
  {
    id: '8', era: 'modern', decade: 'modern',
    title: 'Dopamine Dressing',
    description: 'Joy as the starting point. Bold color, playful mixing, and dressing for pure pleasure rather than occasion or approval.',
    icon: '🌈',
    colors: ['#E8405C', '#F5B700', '#00A878', '#7B2FBE'],
    keyPieces: ['color-block co-ord', 'Statement earrings', 'Bright heels', 'Printed skirt', 'Bold knit'],
    mood: 'Joyful & Expressive',
  },
];

export function InspirationPage() {
  const [activeEra, setActiveEra] = useState<Era | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null);

  const filtered = activeEra === 'all' ? INSPIRATION_DATA : INSPIRATION_DATA.filter(i => i.era === activeEra);

  return (
    <div style={{ padding: 32, flex: 1 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, marginBottom: 4 }}>Fashion Inspiration</h1>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 14 }}>Explore eras and trends to spark your next outfit idea</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {(['all', 'historical', 'modern'] as const).map(era => (
          <button
            key={era}
            onClick={() => setActiveEra(era)}
            style={{
              padding: '7px 18px', borderRadius: 20, border: '1px solid',
              borderColor: activeEra === era ? 'var(--accent)' : 'var(--border)',
              background: activeEra === era ? 'var(--accent-dim)' : 'transparent',
              color: activeEra === era ? 'var(--accent)' : 'var(--ivory-dim)',
              cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
              fontWeight: activeEra === era ? 500 : 400, transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >
            {era === 'all' ? 'All Eras' : era === 'historical' ? '📸 Historical' : '✨ Modern Trends'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {filtered.map(item => (
          <div
            key={item.id}
            className="card"
            onClick={() => setSelectedItem(item)}
            style={{ cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(232,180,160,0.3)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            {/* color palette bar */}
            <div style={{ display: 'flex', height: 6 }}>
              {item.colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>

            {/* Content */}
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 32 }}>{item.icon}</div>
                <span className="tag">{item.era === 'historical' ? item.decade : 'Now'}</span>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--ivory-dim)', lineHeight: 1.6, marginBottom: 12 }}>
                {item.description}
              </p>
              <div style={{ fontSize: 11, color: 'var(--accent)', fontStyle: 'italic' }}>"{item.mood}"</div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedItem && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24,
        }} onClick={() => setSelectedItem(null)}>
          <div className="card" style={{ padding: 0, width: '100%', maxWidth: 560, overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}>
            {/* Palette header */}
            <div style={{ display: 'flex', height: 8 }}>
              {selectedItem.colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{selectedItem.icon}</div>
                  <h2 style={{ fontSize: 26, marginBottom: 4 }}>{selectedItem.title}</h2>
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontStyle: 'italic' }}>"{selectedItem.mood}"</div>
                </div>
                <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer', fontSize: 20 }}>✕</button>
              </div>

              <p style={{ color: 'var(--ivory-dim)', lineHeight: 1.7, marginBottom: 24, fontSize: 14 }}>{selectedItem.description}</p>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ivory-dim)', marginBottom: 12 }}>color Palette</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedItem.colors.map((c, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                      <div style={{ fontSize: 9, color: 'var(--ivory-dim)' }}>{c}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ivory-dim)', marginBottom: 12 }}>Key Pieces</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedItem.keyPieces.map((piece, i) => (
                    <span key={i} style={{
                      background: 'rgba(245,240,232,0.06)', border: '1px solid var(--border)',
                      borderRadius: 6, padding: '5px 10px', fontSize: 12, color: 'var(--ivory)',
                    }}>{piece}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}