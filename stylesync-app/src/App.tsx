import  {useStore}  from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { WardrobePage } from './pages/WardrobePage';
import { BuilderPage } from './pages/BuilderPage';
import { HistoryPage } from './pages/HistoryPage';
import { CalendarPage } from './pages/CalendarPage';
import { InspirationPage } from './pages/InspirationPage';

function App() {
  const { activeSection } = useStore();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {activeSection === 'wardrobe' && <WardrobePage />}
        {activeSection === 'builder' && <BuilderPage />}
        {activeSection === 'history' && <HistoryPage />}
        {activeSection === 'calendar' && <CalendarPage />}
        {activeSection === 'inspiration' && <InspirationPage />}
      </main>
    </div>
  );
}

export default App;