import React, { useContext } from 'react';
import { topScorers } from '../data/mockData';
import { DataContext } from '../context/DataContext';

const TopScorers = () => {
  const { matches, standings } = useContext(DataContext);

  // Sort by goals (descending), then assists (descending)
  const sortedScorers = [...topScorers].sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    return b.assists - a.assists;
  });

  // Calculate Stats
  const totalGoals = matches.reduce((sum, match) => {
    if (match.status === 'finished' && match.scoreHome !== null && match.scoreAway !== null) {
      return sum + match.scoreHome + match.scoreAway;
    }
    return sum;
  }, 0);

  const RECORD = 172;
  const goalsToRecord = RECORD - totalGoals;
  const isRecordBroken = totalGoals > RECORD;

  const allTeams = Object.values(standings).flat();
  const teamsWithGames = allTeams.filter(t => t.p > 0);
  
  let mostGoalsTeam = null;
  let leastGoalsTeam = null;

  if (teamsWithGames.length > 0) {
    mostGoalsTeam = teamsWithGames.reduce((prev, current) => (prev.gf > current.gf) ? prev : current);
    leastGoalsTeam = teamsWithGames.reduce((prev, current) => (prev.gf < current.gf) ? prev : current);
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Stats Panel */}
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px' }}>Datos Curiosos del Torneo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Goles Totales</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>{totalGoals}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Récord Histórico</div>
            {isRecordBroken ? (
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', marginTop: '5px' }}>¡Récord Roto!</div>
            ) : (
              <>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--warning)' }}>{goalsToRecord}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>para superar Qatar (172)</div>
              </>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Más Goleador</div>
            {mostGoalsTeam ? (
              <>
                <div style={{ fontSize: '1.5rem', marginTop: '5px' }}>{mostGoalsTeam.team.flag}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{mostGoalsTeam.team.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{mostGoalsTeam.gf} goles</div>
              </>
            ) : (
              <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>N/A</div>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Menos Goleador</div>
            {leastGoalsTeam ? (
              <>
                <div style={{ fontSize: '1.5rem', marginTop: '5px' }}>{leastGoalsTeam.team.flag}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{leastGoalsTeam.team.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{leastGoalsTeam.gf} goles</div>
              </>
            ) : (
              <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>N/A</div>
            )}
          </div>

        </div>
      </div>

      {/* Top Scorers List */}
      <div className="glass">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Tabla de Goleadores</h2>
        </div>
        
        <div>
          {sortedScorers.map((scorer, index) => (
            <div key={scorer.id} className="scorer-item">
              <div className="scorer-rank">{index + 1}</div>
              
              <div className="scorer-info">
                <span className="flag" style={{ fontSize: '1.8rem' }}>{scorer.team.flag}</span>
                <div>
                  <div className="scorer-name">{scorer.name}</div>
                  <div className="scorer-team">{scorer.team.name}</div>
                </div>
              </div>
              
              <div className="scorer-stats">
                <div className="scorer-goals">{scorer.goals} Goles</div>
                <div className="scorer-assists" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {scorer.assists > 0 ? `${scorer.assists} Asist.` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopScorers;
