import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';

const Matches = () => {
  const { matches, updateMatch, bracket16, bracket8, bracket4, bracket2, bracket1 } = useContext(DataContext);
  const [filter, setFilter] = useState('all'); // all, finished, upcoming
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editScoreHome, setEditScoreHome] = useState('');
  const [editScoreAway, setEditScoreAway] = useState('');
  const [editPenHome, setEditPenHome] = useState('');
  const [editPenAway, setEditPenAway] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Parse custom date string to Date object
  const getMatchDateObj = (dateStr) => {
    if (!dateStr) return new Date(0);
    const monthMap = { "Ene": 0, "Feb": 1, "Mar": 2, "Abr": 3, "May": 4, "Jun": 5, "Jul": 6, "Ago": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dic": 11 };
    const parts = dateStr.split(' ');
    if (parts.length >= 4 && monthMap[parts[2]] !== undefined) {
      const day = parseInt(parts[1]);
      const month = monthMap[parts[2]];
      const timeParts = parts[3].split(':');
      const hour = parseInt(timeParts[0]);
      const min = parseInt(timeParts[1]);
      return new Date(2026, month, day, hour, min);
    }
    const stdDate = new Date(dateStr);
    return isNaN(stdDate.getTime()) ? new Date(0) : stdDate;
  };

  const isMatchLive = (match) => {
    if (match.status === 'finished') return false;
    const matchStart = getMatchDateObj(match.date);
    const diffMins = (currentTime - matchStart) / 60000;
    
    // Consider it live if current time is between start and +150 minutes (2 hours and 30 mins)
    return diffMins >= 0 && diffMins <= 150;
  };

  let filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  const formatBracket = (bracket, stagePrefix) => {
    return (bracket || []).map(m => ({
      ...m,
      stage: `${stagePrefix} - ${m.label}`,
      status: m.status || 'upcoming'
    }));
  };

  const allAdvancedBrackets = [
    ...formatBracket(bracket16, '16avos'),
    ...formatBracket(bracket8, 'Octavos'),
    ...formatBracket(bracket4, 'Cuartos'),
    ...formatBracket(bracket2, 'Semifinal'),
    ...formatBracket(bracket1, 'Final')
  ];

  if (filter === 'upcoming' || filter === 'all') {
    const filteredAdvanced = filter === 'upcoming' 
      ? allAdvancedBrackets.filter(m => m.status !== 'finished' || isMatchLive(m))
      : allAdvancedBrackets;

    filteredMatches = [...filteredMatches, ...filteredAdvanced];
  } else if (filter === 'finished') {
    const finishedAdvanced = allAdvancedBrackets.filter(m => m.status === 'finished');
    filteredMatches = [...filteredMatches, ...finishedAdvanced];
  }


  const groupedMatches = filteredMatches.reduce((acc, match) => {
    let stageName = 'Fase de Grupos';
    if (match.stage) {
      const stageLower = match.stage.toLowerCase();
      if (stageLower.includes('16avos') || stageLower.includes('dieciseisavos')) {
        stageName = 'Dieciseisavos de Final';
      } else if (stageLower.includes('octavos')) {
        stageName = 'Octavos de Final';
      } else if (stageLower.includes('cuartos')) {
        stageName = 'Cuartos de Final';
      } else if (stageLower.includes('semifinal')) {
        stageName = 'Semifinales';
      } else if (stageLower.includes('final')) {
        stageName = 'Final';
      } else {
        stageName = match.stage;
      }
    }

    if (!acc[stageName]) acc[stageName] = [];
    acc[stageName].push(match);
    return acc;
  }, {});

  // Sort matches within each group chronologically
  Object.keys(groupedMatches).forEach(stage => {
    groupedMatches[stage].sort((a, b) => getMatchDateObj(a.date) - getMatchDateObj(b.date));
  });

  const stageOrder = [
    'Fase de Grupos', 
    'Dieciseisavos de Final', 
    'Octavos de Final', 
    'Cuartos de Final', 
    'Semifinales', 
    'Tercer Puesto', 
    'Final'
  ];

  const sortedStages = Object.keys(groupedMatches).sort((a, b) => {
    const indexA = stageOrder.indexOf(a) !== -1 ? stageOrder.indexOf(a) : 99;
    const indexB = stageOrder.indexOf(b) !== -1 ? stageOrder.indexOf(b) : 99;
    return indexA - indexB;
  });

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
      setEditPenHome('');
      setEditPenAway('');
    } else {
      setEditScoreHome(match.scoreHome ?? '');
      setEditScoreAway(match.scoreAway ?? '');
      setEditPenHome(match.penaltiesHome ?? '');
      setEditPenAway(match.penaltiesAway ?? '');
    }
  };

  const handleSave = (matchId) => {
    const isKnockout = matchId > 72;
    const isTied = editScoreHome !== '' && editScoreAway !== '' && parseInt(editScoreHome) === parseInt(editScoreAway);
    const penH = (isKnockout && isTied && editPenHome !== '') ? parseInt(editPenHome) : null;
    const penA = (isKnockout && isTied && editPenAway !== '') ? parseInt(editPenAway) : null;
    updateMatch(matchId, editScoreHome, editScoreAway, penH, penA);
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

      <div>
        {sortedStages.map(stageName => (
          <div key={stageName} style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              color: 'var(--primary)', 
              marginBottom: '20px', 
              textAlign: 'center', 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              borderBottom: '1px solid rgba(255,255,255,0.1)', 
              paddingBottom: '10px' 
            }}>
              {stageName}
            </h3>
            <div className="card-grid">
              {groupedMatches[stageName].map(match => (
                <div 
                  key={match.id} 
                  className="glass match-card" 
                  onDoubleClick={() => { if (editingMatchId !== match.id) startEditing(match); }}
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

                  {/* Penales Editing UI */}
                  {editingMatchId === match.id && match.id > 72 && editScoreHome !== '' && editScoreAway !== '' && parseInt(editScoreHome) === parseInt(editScoreAway) && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 'bold' }}>PENALES</span>
                      <input 
                        type="number" min="0" value={editPenHome} 
                        onChange={e => setEditPenHome(e.target.value)} 
                        style={{ width: '40px', background: 'rgba(255,255,255,0.1)', color: 'var(--warning)', border: '1px solid var(--warning)', borderRadius: '4px', textAlign: 'center', padding: '5px' }}
                      />
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                      <input 
                        type="number" min="0" value={editPenAway} 
                        onChange={e => setEditPenAway(e.target.value)} 
                        style={{ width: '40px', background: 'rgba(255,255,255,0.1)', color: 'var(--warning)', border: '1px solid var(--warning)', borderRadius: '4px', textAlign: 'center', padding: '5px' }}
                      />
                    </div>
                  )}

                  {/* Penales View UI */}
                  {editingMatchId !== match.id && match.penaltiesHome !== undefined && match.penaltiesHome !== null && (
                    <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--warning)', fontWeight: 'bold', marginTop: '10px' }}>
                      ({match.penaltiesHome}) PENALES ({match.penaltiesAway})
                    </div>
                  )}

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
                      Doble click para editar
                    </div>
                  ) : match.status === 'upcoming' ? (
                    <div style={{ textAlign: 'center', marginTop: '10px', color: 'var(--primary)', fontSize: '0.85em', opacity: 0.8 }}>
                      Doble click para simular
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', marginTop: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8em', opacity: 0.8 }}>
                      Doble click para editar
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
