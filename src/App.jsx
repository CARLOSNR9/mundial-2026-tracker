import React, { useState } from 'react';
import Standings from './components/Standings';
import Matches from './components/Matches';
import TopScorers from './components/TopScorers';
import BracketSimulator from './components/BracketSimulator';

const App = () => {
  const [activeTab, setActiveTab] = useState('standings');

  const renderContent = () => {
    switch (activeTab) {
      case 'standings': return <Standings />;
      case 'matches': return <Matches />;
      case 'scorers': return <TopScorers />;
      case 'bracket': return <BracketSimulator />;
      default: return <Standings />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Mundial 2026</h1>
        <div className="app-subtitle">Tracker Oficial</div>
      </header>

      {/* Main Content Area */}
      <main style={{ paddingBottom: '60px' }}>
        {renderContent()}
      </main>

      {/* Navigation */}
      <nav className="main-nav">
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
      </nav>
    </div>
  );
};

export default App;
