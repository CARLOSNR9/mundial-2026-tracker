import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { teams, topScorers } from '../data/mockData';

const TeamProfileModal = () => {
  const { 
    selectedTeamId, 
    setSelectedTeamId, 
    standings, 
    matches, 
    bracket16, 
    bracket8, 
    bracket4, 
    bracket2, 
    bracket1 
  } = useContext(DataContext);

  if (!selectedTeamId) return null;

  const team = teams[selectedTeamId];
  if (!team) return null;

  // Get standings info
  let standingInfo = null;
  let standingRank = null;
  if (standings && standings[team.group]) {
    const groupStandings = standings[team.group];
    const index = groupStandings.findIndex(t => t.team.id === team.id);
    if (index !== -1) {
      standingRank = index + 1;
      standingInfo = groupStandings[index];
    }
  }

  // Get Top Scorers for this team
  const teamScorers = topScorers.filter(s => s.team.id === team.id);
  const totalTeamGoals = teamScorers.reduce((sum, s) => sum + s.goals, 0);
  const totalTeamAssists = teamScorers.reduce((sum, s) => sum + s.assists, 0);

  // Get Match History
  const allBrackets = [
    ...(bracket16 || []).map(m => ({ ...m, stage: '16avos' })),
    ...(bracket8 || []).map(m => ({ ...m, stage: 'Octavos' })),
    ...(bracket4 || []).map(m => ({ ...m, stage: 'Cuartos' })),
    ...(bracket2 || []).map(m => ({ ...m, stage: 'Semifinal' })),
    ...(bracket1 || []).map(m => ({ ...m, stage: 'Final' }))
  ];

  const teamGroupMatches = matches.filter(m => (m.home?.id === team.id || m.away?.id === team.id) && m.group === team.group);
  const teamKnockoutMatches = allBrackets.filter(m => m.home?.id === team.id || m.away?.id === team.id);
  
  const allTeamMatches = [...teamGroupMatches, ...teamKnockoutMatches];

  // Helper to get result status (Win, Loss, Draw)
  const getMatchResult = (match) => {
    if (!match.status || (!match.status.startsWith('finished'))) return null;
    
    const isHome = match.home?.id === team.id;
    const scoreA = isHome ? match.scoreHome : match.scoreAway;
    const scoreB = isHome ? match.scoreAway : match.scoreHome;
    
    if (scoreA > scoreB) return 'W';
    if (scoreA < scoreB) return 'L';
    
    // Penalties check
    if (match.penaltiesHome !== undefined && match.penaltiesHome !== null) {
      const penA = isHome ? match.penaltiesHome : match.penaltiesAway;
      const penB = isHome ? match.penaltiesAway : match.penaltiesHome;
      if (penA > penB) return 'W';
      if (penA < penB) return 'L';
    }
    
    return 'D';
  };

  const ResultBadge = ({ result }) => {
    if (!result) return null;
    let color = 'var(--text-muted)';
    let text = '-';
    if (result === 'W') { color = 'var(--primary)'; text = 'V'; }
    if (result === 'L') { color = 'var(--danger)'; text = 'D'; }
    if (result === 'D') { color = 'var(--warning)'; text = 'E'; }
    
    return (
      <span style={{
        display: 'inline-block',
        width: '24px',
        height: '24px',
        lineHeight: '24px',
        textAlign: 'center',
        backgroundColor: color,
        color: '#000',
        fontWeight: 'bold',
        borderRadius: '50%',
        fontSize: '0.8rem',
        marginRight: '5px'
      }}>
        {text}
      </span>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(5px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }} onClick={() => setSelectedTeamId(null)}>
      
      <div className="glass" style={{
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '0',
        borderRadius: '20px',
        animation: 'slide-up 0.3s ease-out'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={() => setSelectedTeamId(null)}
          style={{
            position: 'absolute',
            top: '15px', right: '15px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            width: '30px', height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem'
          }}
        >
          ✕
        </button>

        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%)',
          padding: '40px 20px 20px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))', marginBottom: '10px' }}>
            {team.flag}
          </div>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-color)' }}>{team.name}</h2>
          <div style={{ fontSize: '1rem', color: 'var(--primary)', marginTop: '5px' }}>
            Grupo {team.group}
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          
          {/* Group Stage Stats */}
          {standingInfo && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                Estadísticas de Fase de Grupos
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posición</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{standingRank}º</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Puntos</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--warning)' }}>{standingInfo.pts}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Goles</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    <span style={{ color: 'var(--primary)' }}>+{standingInfo.gf}</span> / <span style={{ color: 'var(--danger)' }}>-{standingInfo.ga}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>Dif: {standingInfo.gd > 0 ? `+${standingInfo.gd}` : standingInfo.gd}</div>
                </div>
              </div>
            </div>
          )}

          {/* Top Players */}
          {(totalTeamGoals > 0 || totalTeamAssists > 0) && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
                Jugadores Destacados
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {teamScorers.sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists)).map(scorer => (
                  <div key={scorer.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 'bold' }}>{scorer.name}</span>
                    <span style={{ fontSize: '0.9rem' }}>
                      {scorer.goals > 0 && <span style={{ color: 'var(--primary)', marginRight: '10px' }}>{scorer.goals} ⚽</span>}
                      {scorer.assists > 0 && <span style={{ color: 'var(--warning)' }}>{scorer.assists} 👟</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches Path */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px' }}>
              Ruta en el Torneo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {allTeamMatches.length > 0 ? allTeamMatches.map((match, i) => {
                const isHome = match.home?.id === team.id;
                const opponent = isHome ? match.away : match.home;
                const result = getMatchResult(match);
                const isFinished = result !== null;
                const score = isFinished ? (isHome ? `${match.scoreHome} - ${match.scoreAway}` : `${match.scoreAway} - ${match.scoreHome}`) : 'vs';

                return (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    background: 'rgba(255,255,255,0.02)', padding: '10px 15px', borderRadius: '8px',
                    borderLeft: `4px solid ${result === 'W' ? 'var(--primary)' : result === 'L' ? 'var(--danger)' : result === 'D' ? 'var(--warning)' : 'rgba(255,255,255,0.2)'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      {isFinished && <ResultBadge result={result} />}
                      {!isFinished && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '24px', textAlign: 'center', marginRight: '5px' }}>🗓️</span>}
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {match.stage ? match.stage : 'Fase de Grupos'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{opponent?.flag || '❓'}</span>
                          <span style={{ fontWeight: 'bold' }}>{opponent?.name || 'TBD'}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isFinished ? 'white' : 'var(--text-muted)' }}>
                        {score}
                      </span>
                      {match.penaltiesHome !== undefined && match.penaltiesHome !== null && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>
                          (PEN: {isHome ? match.penaltiesHome : match.penaltiesAway} - {isHome ? match.penaltiesAway : match.penaltiesHome})
                        </span>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                  No hay partidos registrados aún.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamProfileModal;
