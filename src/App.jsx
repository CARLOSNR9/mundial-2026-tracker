import React, { useState } from 'react';
import Standings from './components/Standings';
import Matches from './components/Matches';
import TopScorers from './components/TopScorers';
import BracketSimulator from './components/BracketSimulator';
import GeneralTable from './components/GeneralTable';
import { DataProvider } from './context/DataContext';

import logo from './assets/logo2026.png';

const App = () => {
  const [activeTab, setActiveTab] = useState('standings');

  const renderContent = () => {
    switch (activeTab) {
      case 'standings': return <Standings />;
      case 'matches': return <Matches />;
      case 'scorers': return <TopScorers />;
      case 'bracket': return <BracketSimulator />;
      case 'general': return <GeneralTable />;
      default: return <Standings />;
    }
  };

  const NavigationMenu = ({ isBottom }) => (
    <nav className={`main-nav ${isBottom ? 'hide-on-mobile' : ''}`} style={isBottom ? { marginTop: '20px', marginBottom: '0' } : {}}>
      <button 
        className={`nav-btn ${activeTab === 'standings' ? 'active' : ''}`}
        onClick={() => setActiveTab('standings')}
      >
        <span>📊</span> Posiciones
      </button>
      <button 
        className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
        onClick={() => setActiveTab('matches')}
      >
        <span>⚽</span> Partidos
      </button>
      <button 
        className={`nav-btn ${activeTab === 'bracket' ? 'active' : ''}`}
        onClick={() => setActiveTab('bracket')}
      >
        <span>🏆</span> 16avos
      </button>
      <button 
        className={`nav-btn ${activeTab === 'scorers' ? 'active' : ''}`}
        onClick={() => setActiveTab('scorers')}
      >
        <span>👟</span> Goleadores
      </button>
      <button 
        className={`nav-btn ${activeTab === 'general' ? 'active' : ''}`}
        onClick={() => setActiveTab('general')}
      >
        <span>🌍</span> Tabla Gen.
      </button>
    </nav>
  );

  return (
    <DataProvider>
      <div className="app-container">
        <header className="app-header">
          <img src={logo} alt="Mundial 2026 Logo" style={{ width: 'auto', height: '120px', marginBottom: '10px', mixBlendMode: 'lighten', filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.3))' }} />
          <br />
          <h1 className="app-title">Mundial 2026</h1>
          <div className="app-subtitle">Tracker Oficial</div>
        </header>

        {/* Top Navigation */}
        <NavigationMenu isBottom={false} />

        {/* Main Content Area */}
        <main style={{ paddingBottom: '20px' }}>
          {renderContent()}
        </main>

        {/* Bottom Navigation (Desktop only) */}
        <NavigationMenu isBottom={true} />
      </div>
    </DataProvider>
  );
};

export default App;
