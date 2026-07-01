import React, { useState } from 'react';
import DailyDashboard from './components/DailyDashboard';
import Standings from './components/Standings';
import Matches from './components/Matches';
import TopScorers from './components/TopScorers';
import BracketSimulator from './components/BracketSimulator';
import GeneralTable from './components/GeneralTable';
import TeamSearch from './components/TeamSearch';
import TeamProfileModal from './components/TeamProfileModal';
import { DataProvider } from './context/DataContext';
import { Flame, Trophy, TableProperties, CalendarDays, Target } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import logo from './assets/logo2026.png';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DailyDashboard />;
      case 'standings': return <Standings />;
      case 'matches': return <Matches />;
      case 'scorers': return <TopScorers />;
      case 'bracket': return <BracketSimulator />;
      case 'general': return <GeneralTable />;
      default: return <DailyDashboard />;
    }
  };

  const NavigationMenu = ({ isBottom }) => (
    <nav className={`main-nav ${isBottom ? 'hide-on-mobile' : ''}`} style={isBottom ? { marginTop: '20px', marginBottom: '0' } : {}}>
      <button 
        className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        <Flame size={20} /> <span style={{ marginLeft: '6px' }}>Hoy</span>
      </button>
      <button 
        className={`nav-btn ${activeTab === 'bracket' ? 'active' : ''}`}
        onClick={() => setActiveTab('bracket')}
      >
        <Trophy size={20} /> <span style={{ marginLeft: '6px' }}>Cuadro</span>
      </button>
      <button 
        className={`nav-btn ${activeTab === 'standings' ? 'active' : ''}`}
        onClick={() => setActiveTab('standings')}
      >
        <TableProperties size={20} /> <span style={{ marginLeft: '6px' }}>Grupos</span>
      </button>
      <button 
        className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
        onClick={() => setActiveTab('matches')}
      >
        <CalendarDays size={20} /> <span style={{ marginLeft: '6px' }}>Partidos</span>
      </button>
      <button 
        className={`nav-btn ${activeTab === 'scorers' ? 'active' : ''}`}
        onClick={() => setActiveTab('scorers')}
      >
        <Target size={20} /> <span style={{ marginLeft: '6px' }}>Goleadores</span>
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
          <TeamSearch />
        </header>

        {/* Top Navigation */}
        <NavigationMenu isBottom={false} />

        {/* Main Content Area */}
        <main style={{ paddingBottom: '20px' }}>
          {renderContent()}
        </main>

        {/* Bottom Navigation (Desktop only) */}
        <NavigationMenu isBottom={true} />
        
        {/* Modals */}
        <TeamProfileModal />
        <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--primary)', backdropFilter: 'blur(10px)' } }} />
      </div>
    </DataProvider>
  );
};

export default App;
