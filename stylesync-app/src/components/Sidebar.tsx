import { useStore } from '../store/useStore';
import type { AppSection } from '../types/index';
import { Shirt, Layers, Clock, Calendar, Sparkles } from 'lucide-react';

const navItems: { id: AppSection; label: string; icon: React.ReactNode }[] = [
  { id: 'wardrobe', label: 'Wardrobe', icon: <Shirt size={18} /> },
  { id: 'builder', label: 'Outfit Builder', icon: <Layers size={18} /> },
  { id: 'history', label: 'History', icon: <Clock size={18} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} /> },
  { id: 'inspiration', label: 'Inspiration', icon: <Sparkles size={18} /> },
];

export function Sidebar() {
  const { activeSection, setActiveSection, wardrobe, outfits } = useStore();

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            👗
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--ivory)' }}>
              Wardrobe
            </div>
            <div style={{ fontSize: 10, color: 'var(--ivory-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Studio
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                background: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--ivory-dim)',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                fontWeight: active ? 500 : 400,
                textAlign: 'left',
                transition: 'all 0.15s',
                marginBottom: 2,
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,240,232,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--ivory)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--ivory-dim)';
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Stats */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', color: 'var(--accent)' }}>
              {wardrobe.length}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Items
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', color: 'var(--accent)' }}>
              {outfits.length}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Outfits
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', color: 'var(--accent)' }}>
              {wardrobe.filter(i => i.isFavourite).length}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Faves
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}