import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { matchCuriosities } from '../data/curiosities';

const DailyDashboard = () => {
  const { bracket16, updateMatch } = useContext(DataContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editScoreHome, setEditScoreHome] = useState('');
  const [editScoreAway, setEditScoreAway] = useState('');

  // Update time for checking "live" matches (optional real-time simulation)
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!bracket16 || bracket16.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando dashboard...</div>;
  }

  // Get next opponent logic based on bracket array index
  // 0-1, 2-3, 4-5, 6-7, 8-9, 10-11, 12-13, 14-15
  const getNextOpponentText = (matchId) => {
    const idx = bracket16.findIndex(m => m.id === matchId);
    if (idx === -1) return '';
    
    // Determine the partner index in the bracket
    const isEven = idx % 2 === 0;
    const partnerIdx = isEven ? idx + 1 : idx - 1;
    const partnerMatch = bracket16[partnerIdx];
    
    if (!partnerMatch) return '';

    let partnerText = '';
    // If partner match is finished, show the winner
    if (partnerMatch.status === 'finished') {
      const homeScore = parseInt(partnerMatch.scoreHome) || 0;
      const awayScore = parseInt(partnerMatch.scoreAway) || 0;
      if (homeScore > awayScore) {
        partnerText = partnerMatch.home.name;
      } else if (awayScore > homeScore) {
        partnerText = partnerMatch.away.name;
      } else {
        partnerText = `Ganador de ${partnerMatch.home.name}/${partnerMatch.away.name} (Penales)`;
      }
    } else {
      partnerText = `Ganador de ${partnerMatch.home.name} vs ${partnerMatch.away.name}`;
    }

    return `En Octavos de Final, el ganador enfrentará a: ${partnerText}`;
  };

  // Helper to extract day string from "Lun 29 Jun 14:30 hrs."
  const getDayString = (dateStr) => {
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} ${parts[2]}`;
    }
    return dateStr;
  };

  // Group matches by day
  const matchesByDay = bracket16.reduce((acc, match) => {
    const day = getDayString(match.date);
    if (!acc[day]) acc[day] = [];
    acc[day].push(match);
    return acc;
  }, {});

  // For simulation/demo purposes, we will treat the "first day with an unfinished match" as "Today".
  // If all are finished, we show the last day.
  const daysInOrder = ["Dom 28 Jun", "Lun 29 Jun", "Mar 30 Jun", "Mié 1 Jul", "Jue 2 Jul", "Vie 3 Jul"];
  
  let todayString = daysInOrder[0];
  for (let day of daysInOrder) {
    const dayMatches = matchesByDay[day] || [];
    if (dayMatches.some(m => m.status !== 'finished')) {
      todayString = day;
      break;
    }
  }

  const todaysMatches = matchesByDay[todayString] || [];
  
  // Future matches
  const todayIdx = daysInOrder.indexOf(todayString);
  const futureDays = daysInOrder.slice(todayIdx + 1);
  const upcomingMatches = futureDays.flatMap(day => matchesByDay[day] || []);

  const isMatchLive = (match) => {
    // For a real app we compare against currentTime.
    // For this demo, let's treat the FIRST upcoming match of "Today" as LIVE if it doesn't have a score.
    // This makes the demo interactive.
    if (match.status === 'finished') return false;
    const isFirstUnfinished = todaysMatches.find(m => m.status !== 'finished') === match;
    return isFirstUnfinished;
  };

  const startEditing = (match) => {
    setEditingMatchId(match.id);
    setEditScoreHome(match.scoreHome ?? '');
    setEditScoreAway(match.scoreAway ?? '');
  };

  const handleSave = (matchId) => {
    updateMatch(matchId, editScoreHome, editScoreAway);
    setEditingMatchId(null);
  };

  return (
    <div className="animate-fade-in dashboard-container">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Partidos de Hoy</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold' }}>{todayString.toUpperCase()}</p>
      </div>

      <div className="todays-matches" style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '50px' }}>
        {todaysMatches.map(match => {
          const live = isMatchLive(match);
          const curiosity = matchCuriosities[match.id] || "No hay datos curiosos disponibles para este partido.";

          return (
            <div key={match.id} className={`glass match-card ${live ? 'live-match-card' : ''}`} style={{
              padding: '20px',
              border: live ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: live ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none',
              transform: live ? 'scale(1.02)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              
              <div className="match-header" style={{ marginBottom: '15px', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{match.label} - {match.stadium}</span>
                {live ? (
                  <span className="live-badge" style={{ fontSize: '1rem', padding: '5px 10px' }}>
                    <div className="live-dot" style={{ width: '10px', height: '10px' }}></div>
                    EN VIVO
                  </span>
                ) : (
                  <span style={{ fontWeight: 'bold' }}>{match.date.split(' ')[3]} {match.date.split(' ')[4]}</span>
                )}
              </div>
              
              <div className="match-teams" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                {/* Local */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '3rem' }}>{match.home.flag}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{match.home.name}</span>
                </div>

                {/* Marcador */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {editingMatchId === match.id ? (
                    <>
                      <input 
                        type="number" min="0" value={editScoreHome} 
                        onChange={e => setEditScoreHome(e.target.value)} 
                        style={{ width: '60px', height: '60px', fontSize: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.5)', color: 'white', border: '2px solid var(--primary)', borderRadius: '8px' }}
                        autoFocus
                      />
                      <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>-</span>
                      <input 
                        type="number" min="0" value={editScoreAway} 
                        onChange={e => setEditScoreAway(e.target.value)} 
                        style={{ width: '60px', height: '60px', fontSize: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.5)', color: 'white', border: '2px solid var(--primary)', borderRadius: '8px' }}
                      />
                    </>
                  ) : (
                    <>
                      <div className="team-score" style={{ fontSize: '2.5rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {match.scoreHome ?? '-'}
                      </div>
                      <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>vs</span>
                      <div className="team-score" style={{ fontSize: '2.5rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {match.scoreAway ?? '-'}
                      </div>
                    </>
                  )}
                </div>

                {/* Visitante */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '3rem' }}>{match.away.flag}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{match.away.name}</span>
                </div>
              </div>

              {/* Botones de acción del marcador */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {editingMatchId === match.id ? (
                  <>
                    <button onClick={() => handleSave(match.id)} className="btn-primary" style={{ marginRight: '10px', padding: '10px 25px', fontSize: '1.1rem' }}>
                      Guardar Resultado
                    </button>
                    <button onClick={() => setEditingMatchId(null)} className="btn-secondary" style={{ padding: '10px 25px', fontSize: '1.1rem' }}>
                      Cancelar
                    </button>
                  </>
                ) : (live || match.status === 'finished') ? (
                  <button onClick={() => startEditing(match)} className="btn-secondary" style={{ padding: '8px 20px' }}>
                    {match.status === 'finished' ? 'Editar Resultado' : 'Actualizar Marcador'}
                  </button>
                ) : null}
              </div>

              {/* Info extra para partido en vivo o finalizado */}
              {(live || match.status === 'finished') && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', textAlign: 'center', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ margin: 0, color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    🔜 {getNextOpponentText(match.id)}
                  </p>
                </div>
              )}

              {/* Curiosidad IA */}
              <div style={{ background: 'rgba(0, 255, 136, 0.05)', borderLeft: '4px solid var(--primary)', padding: '15px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🤖</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Análisis IA</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {curiosity}
                </p>
              </div>

            </div>
          );
        })}
        {todaysMatches.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay partidos para mostrar hoy.</div>
        )}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
        <h3 style={{ color: 'var(--text-color)', marginBottom: '20px', textAlign: 'center' }}>Próximos Partidos (16vos de Final)</h3>
        
        <div className="upcoming-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
          {upcomingMatches.map(match => (
            <div key={match.id} className="glass" style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{match.date}</span>
                <span>{match.label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '40%' }}>
                  <span style={{ fontSize: '1.5rem' }}>{match.home.flag}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{match.home.name}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>vs</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '40%', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'right' }}>{match.away.name}</span>
                  <span style={{ fontSize: '1.5rem' }}>{match.away.flag}</span>
                </div>
              </div>
            </div>
          ))}
          {upcomingMatches.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>No hay más partidos programados.</div>
          )}
        </div>
      </div>

      {/* Styles added globally or inline, ensuring buttons look good */}
      <style>{`
        .btn-primary {
          background: var(--primary);
          color: var(--bg-color);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.2s, filter 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.1);
          color: var(--text-color);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
};

export default DailyDashboard;
