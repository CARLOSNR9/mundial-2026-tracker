import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';

const Matches = () => {
  const { matches, updateMatch, bracket16 } = useContext(DataContext);
  const [filter, setFilter] = useState('all'); // all, finished, upcoming
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editScoreHome, setEditScoreHome] = useState('');
  const [editScoreAway, setEditScoreAway] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const isMatchLive = (match) => {
    const matchStart = new Date(match.date);
    const now = currentTime;
    const diffMs = now - matchStart;
    const diffMins = diffMs / 60000;
    
    // Consider it live if current time is between start and +135 minutes (2 hours and 15 mins)
    return diffMins >= 0 && diffMins <= 135;
  };

  let filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  if (filter === 'upcoming' || filter === 'all') {
    const formattedBracket16 = (bracket16 || []).map(m => ({
      ...m,
      stage: '16avos - ' + m.label,
      status: 'upcoming'
    }));
    filteredMatches = [...filteredMatches, ...formattedBracket16];
  }

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleDateString('es-ES', options);
  };

  const startEditing = (match) => {
    setEditingMatchId(match.id);
    if (isMatchLive(match) && (match.scoreHome === undefined || match.scoreHome === null)) {
      setEditScoreHome(0);
      setEditScoreAway(0);
    } else {
      setEditScoreHome(match.scoreHome ?? '');
      setEditScoreAway(match.scoreAway ?? '');
    }
  };

  const handleSave = (matchId) => {
    updateMatch(matchId, editScoreHome, editScoreAway);
    setEditingMatchId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="tab-nav" style={{ justifyContent: 'center', marginBottom: '20px' }}>
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
          <div 
            key={match.id} 
            className="glass match-card" 
            onClick={() => { if (editingMatchId !== match.id) startEditing(match); }}
            style={{ cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease' }}
          >
            <div className="match-header">
              <span>{match.group ? `Grupo ${match.group}` : match.stage}</span>
              {isMatchLive(match) ? (
                <span className="live-badge">
                  <div className="live-dot"></div>
                  EN VIVO
                </span>
              ) : (
                <span>{formatDate(match.date)}</span>
              )}
            </div>
            
            <div className="match-teams">
              <div className="team-row">
                <div className="team-info">
                  <span className="flag">{match.home.flag}</span>
                  <span>{match.home.name}</span>
                </div>
                {editingMatchId === match.id ? (
                  <input 
                    type="number" 
                    min="0"
                    value={editScoreHome} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || parseInt(val) >= 0) setEditScoreHome(val);
                    }} 
                    style={{ width: '45px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--primary)', borderRadius: '4px', textAlign: 'center', padding: '5px' }}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  (match.status === 'finished' || isMatchLive(match)) && (
                    <div className={`team-score ${match.scoreHome > match.scoreAway ? 'winner' : ''}`}>
                      {match.scoreHome ?? 0}
                    </div>
                  )
                )}
              </div>
              
              <div className="team-row">
                <div className="team-info">
                  <span className="flag">{match.away.flag}</span>
                  <span>{match.away.name}</span>
                </div>
                {editingMatchId === match.id ? (
                  <input 
                    type="number" 
                    min="0"
                    value={editScoreAway} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '' || parseInt(val) >= 0) setEditScoreAway(val);
                    }} 
                    style={{ width: '45px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--primary)', borderRadius: '4px', textAlign: 'center', padding: '5px' }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  (match.status === 'finished' || isMatchLive(match)) && (
                    <div className={`team-score ${match.scoreAway > match.scoreHome ? 'winner' : ''}`}>
                      {match.scoreAway ?? 0}
                    </div>
                  )
                )}
              </div>
            </div>

            {editingMatchId === match.id ? (
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSave(match.id); }}
                  style={{ background: 'var(--primary)', color: 'var(--bg-color)', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Guardar
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingMatchId(null); }}
                  style={{ background: 'transparent', color: 'var(--text-color)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
                >
                  Cancelar
                </button>
              </div>
            ) : (isMatchLive(match) && match.status !== 'finished') ? (
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8em', opacity: 0.8 }}>
                Toca para editar
              </div>
            ) : match.status === 'upcoming' ? (
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--primary)', fontSize: '0.85em', opacity: 0.8 }}>
                Toca para simular
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8em', opacity: 0.8 }}>
                Toca para editar
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
