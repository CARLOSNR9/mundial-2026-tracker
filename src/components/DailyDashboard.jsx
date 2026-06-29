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
  const octavosDetails = {
    0: { date: "Sáb 4 Jul 11:00 hrs", stadium: "Lincoln Financial Field, Filadelfia" },
    1: { date: "Sáb 4 Jul 19:30 hrs", stadium: "NRG Stadium, Houston" },
    2: { date: "Dom 5 Jul 15:00 hrs", stadium: "MetLife Stadium, Nueva Jersey" },
    3: { date: "Dom 5 Jul 19:00 hrs", stadium: "Estadio Azteca, CDMX" },
    4: { date: "Lun 6 Jul 16:00 hrs", stadium: "AT&T Stadium, Dallas" },
    5: { date: "Lun 6 Jul 20:00 hrs", stadium: "Lumen Field, Seattle" },
    6: { date: "Mar 7 Jul 12:00 hrs", stadium: "Mercedes-Benz Stadium, Atlanta" },
    7: { date: "Mar 7 Jul 18:30 hrs", stadium: "BC Place, Vancouver" }
  };

  const getNextOpponentText = (matchId) => {
    const idx = bracket16.findIndex(m => m.id === matchId);
    if (idx === -1) return '';
    
    // Determine the partner index in the bracket
    const isEven = idx % 2 === 0;
    const partnerIdx = isEven ? idx + 1 : idx - 1;
    const partnerMatch = bracket16[partnerIdx];
    const octavosIdx = Math.floor(idx / 2);
    const octavosInfo = octavosDetails[octavosIdx];
    
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
        partnerText = `el ganador de ${partnerMatch.home.name} vs ${partnerMatch.away.name}`;
      }
    } else {
      partnerText = `el ganador entre ${partnerMatch.home.name} y ${partnerMatch.away.name}`;
    }

    return `Después, el ganador de este partido se estará enfrentando a ${partnerText}, el ${octavosInfo.date} en el ${octavosInfo.stadium}.`;
  };

  // Helper to get month index
  const monthMap = { "Ene": 0, "Feb": 1, "Mar": 2, "Abr": 3, "May": 4, "Jun": 5, "Jul": 6, "Ago": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dic": 11 };

  // Parse custom date string to Date object
  const getMatchDateObj = (dateStr) => {
    // Expected format: "Lun 29 Jun 14:30 hrs."
    const parts = dateStr.split(' ');
    if (parts.length >= 4) {
      const day = parseInt(parts[1]);
      const month = monthMap[parts[2]];
      const timeParts = parts[3].split(':');
      const hour = parseInt(timeParts[0]);
      const min = parseInt(timeParts[1]);
      return new Date(2026, month, day, hour, min);
    }
    return new Date(); // fallback
  };

  // Helper to extract day string like "29 Jun"
  const getDayMonthString = (dateStr) => {
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      return `${parts[1]} ${parts[2]}`;
    }
    return dateStr;
  };

  // Determine current day string
  const currentDay = currentTime.getDate();
  const currentMonthIdx = currentTime.getMonth();
  const monthsArr = Object.keys(monthMap);
  const todayStr = `${currentDay} ${monthsArr[currentMonthIdx]}`; // e.g. "29 Jun"

  // Group matches by day
  const matchesByDay = bracket16.reduce((acc, match) => {
    const day = getDayMonthString(match.date);
    if (!acc[day]) acc[day] = [];
    acc[day].push(match);
    return acc;
  }, {});

  // Find all matches for "Today"
  let todaysMatches = matchesByDay[todayStr] || [];

  // Filter out finished matches to prioritize live or upcoming matches
  todaysMatches = todaysMatches.filter(match => match.status !== 'finished');

  // Sort today's matches chronologically
  todaysMatches.sort((a, b) => getMatchDateObj(a.date) - getMatchDateObj(b.date));

  // Determine future matches (matches whose date is after today)
  // We can do this by filtering bracket16
  const upcomingMatches = bracket16.filter(match => {
    if (match.status === 'finished') return false; // Hide finished matches

    const matchDayStr = getDayMonthString(match.date);
    if (matchDayStr === todayStr) return false; // It's today
    
    // Check if it's strictly in the future (ignore past days)
    // Compare start of day for both
    const matchDateObj = getMatchDateObj(match.date);
    const matchStartOfDay = new Date(matchDateObj.getFullYear(), matchDateObj.getMonth(), matchDateObj.getDate());
    const currentStartOfDay = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
    
    return matchStartOfDay > currentStartOfDay;
  });

  // Sort upcoming matches chronologically
  upcomingMatches.sort((a, b) => getMatchDateObj(a.date) - getMatchDateObj(b.date));

  // Real "Live" logic
  const isMatchLive = (match) => {
    if (match.status === 'finished') return false;
    const matchStart = getMatchDateObj(match.date);
    const diffMins = (currentTime - matchStart) / 60000;
    // Consider it live if current time is between start and +150 minutes (2 hours and 30 mins)
    return diffMins >= 0 && diffMins <= 150;
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
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold' }}>{todayStr.toUpperCase()}</p>
      </div>

      <div className="todays-matches" style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '50px' }}>
        {todaysMatches.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '20px' }}>
            No hay más partidos programados para hoy o ya han finalizado. Revisa los próximos encuentros.
          </div>
        ) : (
          todaysMatches.map(match => {
            const live = isMatchLive(match);
            const curiosity = matchCuriosities[match.id] || "No hay datos curiosos disponibles para este partido.";

          return (
            <div key={match.id} className={`glass match-card ${live ? 'live-match-card' : ''}`} 
              onDoubleClick={() => { if (live || match.status === 'finished') startEditing(match); }}
              style={{
                padding: '20px',
                border: live ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: live ? '0 0 20px rgba(0, 255, 136, 0.3)' : 'none',
                transform: live ? 'scale(1.02)' : 'none',
                transition: 'all 0.3s ease',
                cursor: (live || match.status === 'finished') ? 'pointer' : 'default'
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
              {editingMatchId === match.id && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <button onClick={() => handleSave(match.id)} className="btn-primary" style={{ marginRight: '10px', padding: '10px 25px', fontSize: '1.1rem' }}>
                    Guardar Resultado
                  </button>
                  <button onClick={() => setEditingMatchId(null)} className="btn-secondary" style={{ padding: '10px 25px', fontSize: '1.1rem' }}>
                    Cancelar
                  </button>
                </div>
              )}

              {/* Curiosidad IA y Próximo Rival */}
              <div style={{ background: 'rgba(0, 255, 136, 0.05)', borderLeft: '4px solid var(--primary)', padding: '15px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🤖</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Análisis IA</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '10px' }}>
                  {curiosity}
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                  <p style={{ margin: 0, color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    🔜 {getNextOpponentText(match.id)}
                  </p>
                </div>
              </div>

            </div>
          );
        })
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
