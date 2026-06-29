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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Goles Totales</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>217</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>en 72 partidos</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', marginTop: '5px' }}>Promedio: 3.01 por partido</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mundial con más goles</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--warning)', marginTop: '5px' }}>¡Récord Roto!</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>
              Superó los 172 goles de Qatar 2022 y aún faltan 32 partidos.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Más Goleadoras</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span>🥇 Francia</span> <b>10</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Brasil</span> <b>9</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Argentina</span> <b>9</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Alemania</span> <b>9</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>España</span> <b>8</b></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Menos Goleadoras (1 gol)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', fontSize: '0.8rem', color: 'var(--danger)' }}>
              <span>Qatar</span>
              <span>Turquía</span>
              <span>Nueva Zelanda</span>
              <span>Panamá</span>
            </div>
          </div>
        </div>

        {/* Historical Record Table */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-color)', marginBottom: '10px' }}>Récord Histórico de Goles por Edición</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px' }}>Mundial</th>
                <th style={{ padding: '8px' }}>Goles</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                <td style={{ padding: '8px' }}>2026</td>
                <td style={{ padding: '8px' }}>217 (hasta ahora)</td>
              </tr>
              <tr><td style={{ padding: '8px' }}>2022</td><td style={{ padding: '8px' }}>172</td></tr>
              <tr><td style={{ padding: '8px' }}>2018</td><td style={{ padding: '8px' }}>169</td></tr>
              <tr><td style={{ padding: '8px' }}>2014</td><td style={{ padding: '8px' }}>171</td></tr>
              <tr><td style={{ padding: '8px' }}>1998</td><td style={{ padding: '8px' }}>171</td></tr>
            </tbody>
          </table>
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
