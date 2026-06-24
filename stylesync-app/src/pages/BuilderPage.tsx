import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { MannequinConfig, Gender, BodyShape, SkinTone, HeightRange, Occasion } from '../types';
import { Save, RotateCcw, ZoomIn, ZoomOut, User } from "lucide-react";

const SKIN_TONES: Record<SkinTone, string> = {
  light: '#F5D5B8',
  medium: '#C8956C',
  dark: '#8D5524',
};

function MannequinDisplay({ config, zoom }: { config: MannequinConfig; zoom: number }) {
  const skin = SKIN_TONES[config.skinTone];
  const isKids = config.gender === 'kids';
  const scale = zoom * (isKids ? 0.75 : config.height === 'tall' ? 1.08 : config.height === 'short' ? 0.92 : 1.0);

  const bodyWidth = config.bodyShape === 'plus-sized' ? 68 :
    config.bodyShape === 'broad' || config.bodyShape === 'athletic' ? 62 : 54;
  const hipWidth = config.bodyShape === 'curvy' || config.bodyShape === 'plus-sized' ? bodyWidth + 18 :
    config.bodyShape === 'broad' ? bodyWidth + 10 : bodyWidth + 6;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 180 420"
        width={120 * scale}
        height={280 * scale}
        style={{ transition: 'all 0.3s', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}
      >
        {/* Head */}
        <ellipse cx="90" cy="38" rx={isKids ? 22 : 20} ry={isKids ? 24 : 22} fill={skin} />
        {/* Neck */}
        <rect x="83" y="56" width="14" height={isKids ? 14 : 18} fill={skin} rx="2" />
        {/* Shoulders */}
        <ellipse cx="90" cy={isKids ? 76 : 82} rx={bodyWidth / 2 + 12} ry="10" fill={skin} />
        {/* Torso */}
        <path
          d={`M ${90 - bodyWidth / 2 - 8} ${isKids ? 76 : 82} 
              Q ${90 - bodyWidth / 2 - 4} ${isKids ? 130 : 160} ${90 - hipWidth / 2} ${isKids ? 160 : 200}
              L ${90 + hipWidth / 2} ${isKids ? 160 : 200}
              Q ${90 + bodyWidth / 2 + 4} ${isKids ? 130 : 160} ${90 + bodyWidth / 2 + 8} ${isKids ? 76 : 82} Z`}
          fill={skin}
        />
        {/* Left Arm */}
        <path
          d={`M ${90 - bodyWidth / 2 - 6} ${isKids ? 84 : 90}
              Q ${90 - bodyWidth / 2 - 20} ${isKids ? 115 : 145} ${90 - bodyWidth / 2 - 14} ${isKids ? 150 : 190}`}
          stroke={skin} strokeWidth={isKids ? 14 : 16} strokeLinecap="round" fill="none"
        />
        {/* Right Arm */}
        <path
          d={`M ${90 + bodyWidth / 2 + 6} ${isKids ? 84 : 90}
              Q ${90 + bodyWidth / 2 + 20} ${isKids ? 115 : 145} ${90 + bodyWidth / 2 + 14} ${isKids ? 150 : 190}`}
          stroke={skin} strokeWidth={isKids ? 14 : 16} strokeLinecap="round" fill="none"
        />
        {/* Legs */}
        <path
          d={`M ${90 - hipWidth / 4} ${isKids ? 160 : 200}
              L ${90 - hipWidth / 4 - 4} ${isKids ? 240 : 320}
              L ${90 - hipWidth / 4 + 10} ${isKids ? 240 : 320}
              L ${90} ${isKids ? 160 : 200} Z`}
          fill={skin}
        />
        <path
          d={`M ${90 + hipWidth / 4} ${isKids ? 160 : 200}
              L ${90 + hipWidth / 4 + 4} ${isKids ? 240 : 320}
              L ${90 + hipWidth / 4 - 10} ${isKids ? 240 : 320}
              L ${90} ${isKids ? 160 : 200} Z`}
          fill={skin}
        />
        {/* Feet */}
        <ellipse cx={90 - hipWidth / 4 + 3} cy={isKids ? 244 : 324} rx={isKids ? 10 : 12} ry={isKids ? 6 : 7} fill={skin} />
        <ellipse cx={90 + hipWidth / 4 - 3} cy={isKids ? 244 : 324} rx={isKids ? 10 : 12} ry={isKids ? 6 : 7} fill={skin} />
        {/* Hair indicator for women/girls */}
        {(config.gender === 'women' || config.kidsGender === 'girls') && (
          <ellipse cx="90" cy="30" rx={isKids ? 24 : 22} ry={isKids ? 26 : 24} fill="#4A3728" opacity="0.7" />
        )}
      </svg>
    </div>
  );
}

const ITEM_PLACEHOLDER_ICONS: Record<string, string> = {
  tops: '👕', bottoms: '👖', dresses: '👗',
  jackets: '🧥', shoes: '👠', accessories: '💍',
};

export function BuilderPage() {
  const {
    builderItems, wardrobe, removeFromBuilder, clearBuilder,
    updateBuilderItem, mannequin, setMannequin, saveOutfit,
  } = useStore();

  const [zoom, setZoom] = useState(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [outfitOccasion, setOutfitOccasion] = useState<Occasion>('casual');
  const [showConfig, setShowConfig] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    const item = builderItems.find(i => i.itemId === itemId);
    if (!item) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDraggingId(itemId);
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    updateBuilderItem(draggingId, { x: Math.max(0, Math.min(x, rect.width - 80)), y: Math.max(0, Math.min(y, rect.height - 80)) });
  };

  const handleMouseUp = () => setDraggingId(null);

  const handleSave = () => {
    if (!outfitName.trim()) return;
    saveOutfit(outfitName, outfitOccasion);
    setOutfitName('');
    setShowSaveModal(false);
  };

  return (
    <div style={{ padding: 32, flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>Outfit Builder</h1>
          <p style={{ color: 'var(--ivory-dim)', fontSize: 14 }}>Drag items from your wardrobe onto the canvas</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={() => setShowConfig(c => !c)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={14} /> Mannequin
          </button>
          <button className="btn-ghost" onClick={clearBuilder} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={14} /> Clear
          </button>
          {builderItems.length > 0 && (
            <button className="btn-primary" onClick={() => setShowSaveModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Save size={14} /> Save Outfit
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Canvas */}
        <div>
          {/* Mannequin config panel */}
          {showConfig && (
            <div className="card" style={{ padding: 16, marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Gender</label>
                <select value={mannequin.gender} onChange={e => setMannequin({ gender: e.target.value as Gender })}>
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Height</label>
                <select value={mannequin.height} onChange={e => setMannequin({ height: e.target.value as HeightRange })}>
                  <option value="short">Short</option>
                  <option value="average">Average</option>
                  <option value="tall">Tall</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Build</label>
                <select value={mannequin.bodyShape} onChange={e => setMannequin({ bodyShape: e.target.value as BodyShape })}>
                  <option value="slim">Slim</option>
                  <option value="curvy">Curvy</option>
                  <option value="plus-sized">Plus-sized</option>
                  <option value="athletic">Athletic</option>
                  <option value="broad">Broad</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Skin Tone</label>
                <select value={mannequin.skinTone} onChange={e => setMannequin({ skinTone: e.target.value as SkinTone })}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          )}

          {/* Builder canvas */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden', height: 480, cursor: draggingId ? 'grabbing' : 'default' }}
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Mannequin */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
              <MannequinDisplay config={mannequin} zoom={zoom} />
            </div>

            {/* Clothing items on canvas */}
            {builderItems.map(bi => {
              const item = wardrobe.find(w => w.id === bi.itemId);
              if (!item) return null;
              return (
                <div
                  key={bi.itemId}
                  onMouseDown={e => handleMouseDown(e, bi.itemId)}
                  style={{
                    position: 'absolute',
                    left: bi.x,
                    top: bi.y,
                    transform: `rotate(${bi.rotation}deg) scale(${bi.scale})`,
                    zIndex: bi.zIndex + (draggingId === bi.itemId ? 100 : 0),
                    cursor: draggingId === bi.itemId ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    width: 80, height: 80,
                    background: 'rgba(26,26,26,0.9)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                    transition: draggingId === bi.itemId ? 'none' : 'box-shadow 0.15s',
                    boxShadow: draggingId === bi.itemId ? '0 8px 32px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} />
                    : ITEM_PLACEHOLDER_ICONS[item.category]
                  }
                  <button
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => removeFromBuilder(bi.itemId)}
                    style={{
                      position: 'absolute', top: -8, right: -8,
                      width: 20, height: 20, borderRadius: '50%',
                      background: '#E8B4A0', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#1a0e0a',
                    }}
                  >✕</button>
                </div>
              );
            })}

            {builderItems.length === 0 && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: 'var(--ivory-dim)',
                pointerEvents: 'none', zIndex: 1,
              }}>
                <p style={{ fontSize: 13, marginTop: 160 }}>Add items from your wardrobe panel →</p>
              </div>
            )}

            {/* Zoom controls */}
            <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 6 }}>
              <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="btn-ghost" style={{ padding: '6px 10px' }}>
                <ZoomIn size={14} />
              </button>
              <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="btn-ghost" style={{ padding: '6px 10px' }}>
                <ZoomOut size={14} />
              </button>
              <span style={{ fontSize: 11, color: 'var(--ivory-dim)', alignSelf: 'center', minWidth: 36 }}>{Math.round(zoom * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Wardrobe panel */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Wardrobe — click to add
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
            {wardrobe.map(item => {
              const inBuilder = builderItems.some(b => b.itemId === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!inBuilder) {
                      const { addToBuilder } = useStore.getState();
                      addToBuilder({ itemId: item.id,item, x: 100 + Math.random() * 120, y: 80 + Math.random() * 100, zIndex: builderItems.length + 1, rotation: 0, scale: 1 });
                    }
                  }}
                  style={{
                    background: inBuilder ? 'var(--accent-dim)' : 'var(--card)',
                    border: `1px solid ${inBuilder ? 'rgba(232,180,160,0.4)' : 'var(--border)'}`,
                    borderRadius: 8, padding: 8, cursor: inBuilder ? 'default' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <div style={{ fontSize: 24 }}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                      : ITEM_PLACEHOLDER_ICONS[item.category]
                    }
                  </div>
                  <div style={{ fontSize: 10, color: inBuilder ? 'var(--accent)' : 'var(--ivory-dim)', textAlign: 'center', lineHeight: 1.3 }}>
                    {item.name.length > 14 ? item.name.slice(0, 14) + '…' : item.name}
                  </div>
                  {inBuilder && <div style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 600 }}>✓ Added</div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setShowSaveModal(false)}>
          <div className="card" style={{ padding: 28, width: 360 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Save Outfit</h2>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Outfit Name</label>
              <input placeholder="e.g. Sunday Brunch" value={outfitName} onChange={e => setOutfitName(e.target.value)} autoFocus />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Occasion</label>
              <select value={outfitOccasion} onChange={e => setOutfitOccasion(e.target.value as Occasion)}>
                <option value="casual">Casual</option>
                <option value="work">Work</option>
                <option value="formal">Formal</option>
                <option value="sport">Sport</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setShowSaveModal(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} style={{ flex: 2 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}