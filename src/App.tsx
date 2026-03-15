import { useState } from 'preact/hooks';
import './App.css';
import { DeserialisationTab, GpsTab, GraphsTab } from './tabs';

type Tab = 'graphs' | 'gps' | 'deserialisation';

const tabs: { id: Tab; label: string }[] = [
  { id: 'graphs', label: 'Graphs' },
  { id: 'gps', label: 'GPS' },
  { id: 'deserialisation', label: 'Deserialisation' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>('graphs');

  return (
    <div className="app-shell">
      <nav className="nav-bar">
        <span className="nav-title">FBR Telemetry</span>
        <div className="nav-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'graphs' && <GraphsTab />}
        {activeTab === 'gps' && <GpsTab />}
        {activeTab === 'deserialisation' && <DeserialisationTab />}
      </main>
    </div>
  );
};

export default App;
