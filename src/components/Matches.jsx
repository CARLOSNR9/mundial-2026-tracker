import React, { useState } from 'react';
import { matchesData } from '../data/mockData';

const Matches = () => {
  const [filter, setFilter] = useState('all'); // all, finished, upcoming

  const filteredMatches = matchesData.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="animate-fade-in">
      <div className="nav-bar" style={{ justifyContent: 'center', marginBottom: '20px' }}>
        <button className={`nav-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Todos
        </button>
        <button className={`nav-btn ${filter === 'finished' ? 'active' : ''}`} onClick={() => setFilter('finished')}>
          Resultados
        </button>
        <button className={`nav-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>
          Próximos
        </button>
      </div>

      <div className="card-grid">
        {filteredMatches.map(match => (
          <div key={match.id} className="glass match-card">
            <div className="match-header">
              <span>{match.group ? `Grupo ${match.group}` : match.stage}</span>
              <span>{formatDate(match.date)}</span>
            </div>
            
            <div className="match-teams">
              <div className="team-row">
                <div className="team-info">
                  <span className="flag">{match.home.flag}</span>
                  <span>{match.home.name}</span>
                </div>
                {match.status === 'finished' && (
                  <div className={`team-score ${match.scoreHome > match.scoreAway ? 'winner' : ''}`}>
                    {match.scoreHome}
                  </div>
                )}
              </div>
              
              <div className="team-row">
                <div className="team-info">
                  <span className="flag">{match.away.flag}</span>
                  <span>{match.away.name}</span>
                </div>
                {match.status === 'finished' && (
                  <div className={`team-score ${match.scoreAway > match.scoreHome ? 'winner' : ''}`}>
                    {match.scoreAway}
                  </div>
                )}
              </div>
            </div>

            {match.status === 'upcoming' && (
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--primary)' }}>
                Por jugar
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
