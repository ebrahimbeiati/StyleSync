import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Occasion } from '../types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const OCCASION_colorS: Record<Occasion, string> = {
  work: '#8A9E8A',
  casual: '#9E9A8A',
  formal: '#8A8A9E',
  sport: '#9E8A8A',
  holiday: '#E8B4A0',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  // Monday = 0
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOutfitId, setSelectedOutfitId] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('casual');
  const [note, setNote] = useState('');

  const { calendarEntries, addCalendarEntry, removeCalendarEntry, outfits } = useStore();

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    setSelectedDate(dateStr);
    const existing = calendarEntries.find(e => e.date === dateStr);
    if (existing) {
      setSelectedOutfitId(existing.outfitId);
      setSelectedOccasion(existing.occasion || 'casual');
      setNote(existing.note || '');
    } else {
      setSelectedOutfitId('');
      setSelectedOccasion('casual');
      setNote('');
    }
  };

  const handleSave = () => {
    if (!selectedDate || !selectedOutfitId) return;
    addCalendarEntry({ date: selectedDate, outfitId: selectedOutfitId, occasion: selectedOccasion, note });
    setSelectedDate(null);
  };

  const getEntryForDay = (day: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    return calendarEntries.find(e => e.date === dateStr);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div style={{ padding: 32, flex: 1 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, marginBottom: 4 }}>Calendar Planner</h1>
        <p style={{ color: 'var(--ivory-dim)', fontSize: 14 }}>Plan your outfits in advance — click a day to assign a look</p>
      </div>

      {outfits.length === 0 && (
        <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <span style={{ color: 'var(--ivory-dim)', fontSize: 13 }}>Save some outfits in the Outfit Builder first, then plan them on the calendar.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        {/* Calendar */}
        <div className="card" style={{ padding: 20 }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button onClick={prevMonth} className="btn-ghost" style={{ padding: '6px 10px' }}><ChevronLeft size={16} /></button>
            <h2 style={{ fontSize: 20 }}>{MONTHS[viewMonth]} {viewYear}</h2>
            <button onClick={nextMonth} className="btn-ghost" style={{ padding: '6px 10px' }}><ChevronRight size={16} /></button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const dateStr = toDateStr(viewYear, viewMonth, day);
              const entry = getEntryForDay(day);
              const isToday = dateStr === todayStr;
              const isSelected = selectedDate === dateStr;
              const outfit = entry ? outfits.find(o => o.id === entry.outfitId) : null;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  style={{
                    minHeight: 60, padding: 6, borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${isSelected ? 'var(--accent)' : isToday ? 'rgba(232,180,160,0.3)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--accent-dim)' : isToday ? 'rgba(232,180,160,0.05)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(245,240,232,0.04)'; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <div style={{ fontSize: 12, fontWeight: isToday ? 600 : 400, color: isToday ? 'var(--accent)' : 'var(--ivory)', marginBottom: 3 }}>
                    {day}
                  </div>
                  {outfit && (
                    <div style={{
                      fontSize: 9, padding: '2px 4px', borderRadius: 3,
                      background: entry?.occasion ? `${OCCASION_colorS[entry.occasion as Occasion]}22` : 'rgba(138,158,138,0.15)',
                      color: entry?.occasion ? OCCASION_colorS[entry.occasion as Occasion] : 'var(--sage)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      lineHeight: 1.5,
                    }}>
                      {outfit.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div>
          {selectedDate ? (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16 }}>
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                </div>
                {calendarEntries.find(e => e.date === selectedDate) && (
                  <button onClick={() => { removeCalendarEntry(selectedDate); setSelectedDate(null); }}
                    style={{ background: 'none', border: 'none', color: 'var(--ivory-dim)', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Outfit</label>
                {outfits.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>No outfits saved yet</p>
                ) : (
                  <select value={selectedOutfitId} onChange={e => setSelectedOutfitId(e.target.value)}>
                    <option value="">— Select an outfit —</option>
                    {outfits.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                )}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Occasion</label>
                <select value={selectedOccasion} onChange={e => setSelectedOccasion(e.target.value as Occasion)}>
                  <option value="work">Work</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="sport">Sport</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Note</label>
                <textarea
                  placeholder="e.g. Team presentation, dress smart"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  style={{ height: 72, resize: 'none' }}
                />
              </div>

              <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }} disabled={!selectedOutfitId}>
                Assign Outfit
              </button>
            </div>
          ) : (
            <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--ivory-dim)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <p style={{ fontSize: 13 }}>Click a day on the calendar to plan an outfit</p>
            </div>
          )}

          {/* Upcoming entries */}
          {calendarEntries.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--ivory-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Planned</div>
              {calendarEntries
                .filter(e => e.date >= todayStr)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 5)
                .map(entry => {
                  const outfit = outfits.find(o => o.id === entry.outfitId);
                  return (
                    <div key={entry.date} className="card" style={{ padding: '10px 12px', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: 'var(--ivory-dim)', marginBottom: 2 }}>
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{outfit?.name || 'Unknown outfit'}</div>
                      {entry.occasion && <span className="tag" style={{ marginTop: 4, display: 'inline-block' }}>{entry.occasion}</span>}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}