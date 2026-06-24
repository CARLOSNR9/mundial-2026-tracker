import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';

const Standings = () => {
  const { standings, matches, updateMatch } = useContext(DataContext);
  const groups = Object.keys(standings);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize active group based on live matches if possible
  const [activeGroup, setActiveGroup] = useState(() => {
    const now = new Date();
    const live = matches.filter(m => {
      const matchStart = new Date(m.date);
      const diffMins = (now - matchStart) / 60000;
      return diffMins >= 0 && diffMins <= 120;
    });
    if (live.length > 0 && live[0].group) {
      return live[0].group;
    }
    return 'A';
  });

  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editScoreHome, setEditScoreHome] = useState('');
  const [editScoreAway, setEditScoreAway] = useState('');

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
    return diffMins >= 0 && diffMins <= 120;
  };

  const liveMatches = matches.filter(match => isMatchLive(match));

  const startEditing = (match) => {
    setEditingMatchId(match.id);
    if (match.scoreHome === undefined || match.scoreHome === null) {
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

  // Calculate best 3rd place teams
  const allThirdPlaces = Object.values(standings).map(group => group[2]).filter(Boolean);
  
  // Sort by pts (desc), then gd (desc), then gf (desc)
  const sortedThirdPlaces = [...allThirdPlaces].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  // Top 8 qualify
  const qualifiedThirdPlaces = sortedThirdPlaces.slice(0, 8);
  const qualifiedThirdPlaceIds = qualifiedThirdPlaces.map(row => row.team.id);

  return (
    <div className="animate-fade-in">
      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <div className="card-grid">
            {liveMatches.map(match => (
              <div 
                key={match.id} 
                className="glass match-card" 
                onClick={() => { if (editingMatchId !== match.id) startEditing(match); }}
                style={{ cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease' }}
              >
                <div className="match-header">
                  <span>{match.group ? `Grupo ${match.group}` : match.stage}</span>
                  <span className="live-badge">
                    <div className="live-dot"></div>
                    EN VIVO
                  </span>
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
                      <div className={`team-score ${match.scoreHome > match.scoreAway ? 'winner' : ''}`}>
                        {match.scoreHome ?? 0}
                      </div>
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
                      <div className={`team-score ${match.scoreAway > match.scoreHome ? 'winner' : ''}`}>
                        {match.scoreAway ?? 0}
                      </div>
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
                ) : (
                  <div style={{ textAlign: 'center', marginTop: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8em', opacity: 0.8 }}>
                    Toca para editar
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tab-nav" style={{ marginBottom: '20px', paddingBottom: '10px' }}>
        {groups.map(group => (
          <button
            key={group}
            className={`nav-btn ${activeGroup === group ? 'active' : ''}`}
            onClick={() => setActiveGroup(group)}
            style={{ minWidth: '40px', padding: '8px 15px' }}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="glass table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th className="hide-on-mobile">GF</th>
              <th className="hide-on-mobile">GC</th>
              <th>DG</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings[activeGroup] && standings[activeGroup].map((row, index) => {
              const isTopTwo = index < 2;
              const isQualifiedThird = index === 2 && qualifiedThirdPlaceIds.includes(row.team.id);
              
              let borderColor = 'transparent';
              if (isTopTwo) borderColor = 'var(--primary)';
              else if (isQualifiedThird) borderColor = 'var(--warning)';

              return (
                <tr key={row.team.id} style={{ borderLeft: `3px solid ${borderColor}` }}>
                  <td className="team-cell">
                    <span className="scorer-rank" style={{ fontSize: '1rem', width: '20px' }}>{index + 1}</span>
                    <span className="flag">{row.team.flag}</span>
                    <span>{row.team.name}</span>
                  </td>
                  <td>{row.p}</td>
                  <td>{row.w}</td>
                  <td>{row.d}</td>
                  <td>{row.l}</td>
                  <td className="hide-on-mobile">{row.gf}</td>
                  <td className="hide-on-mobile">{row.ga}</td>
                  <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td className="pts-col">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '10px', marginBottom: '40px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--primary)', marginRight: '5px', borderRadius: '50%' }}></span>
          1º y 2º (Clasificados)
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--warning)', marginRight: '5px', borderRadius: '50%' }}></span>
          Mejores Terceros
        </div>
      </div>

      <h3 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Clasificación de los mejores terceros</h3>
      <div className="glass table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th className="hide-on-mobile">GF</th>
              <th className="hide-on-mobile">GC</th>
              <th>DG</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {sortedThirdPlaces.slice(0, 10).map((row, index) => {
              const isQualified = index < 8;
              let borderColor = isQualified ? 'var(--warning)' : 'var(--danger)';

              return (
                <tr key={row.team.id} style={{ borderLeft: `3px solid ${borderColor}`, opacity: isQualified ? 1 : 0.6 }}>
                  <td className="team-cell">
                    <span className="scorer-rank" style={{ fontSize: '1rem', width: '20px' }}>{index + 1}</span>
                    <span className="flag">{row.team.flag}</span>
                    <span>{row.team.name}</span>
                  </td>
                  <td>{row.p}</td>
                  <td>{row.w}</td>
                  <td>{row.d}</td>
                  <td>{row.l}</td>
                  <td className="hide-on-mobile">{row.gf}</td>
                  <td className="hide-on-mobile">{row.ga}</td>
                  <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td className="pts-col" style={{ color: isQualified ? 'var(--primary)' : 'var(--danger)' }}>{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--warning)', marginRight: '5px', borderRadius: '50%' }}></span>
          Clasificados a 16avos (Top 8)
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--danger)', marginRight: '5px', borderRadius: '50%' }}></span>
          Eliminados
        </div>
      </div>
    </div>
  );
};

export default Standings;
