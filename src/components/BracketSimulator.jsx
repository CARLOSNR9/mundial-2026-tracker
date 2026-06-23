import React from 'react';
import { standingsData } from '../data/mockData';

const BracketSimulator = () => {
  // Simulate Round of 32 (16avos) matchups based on 12 groups
  const matchups = [
    { id: 1, home: standingsData.A[0].team, away: standingsData.B[2].team, label: '1A vs 3B/C/D' },
    { id: 2, home: standingsData.B[0].team, away: standingsData.C[1].team, label: '1B vs 2C' },
    { id: 3, home: standingsData.C[0].team, away: standingsData.D[1].team, label: '1C vs 2D' },
    { id: 4, home: standingsData.D[0].team, away: standingsData.E[2].team, label: '1D vs 3E/F/G' },
    { id: 5, home: standingsData.E[0].team, away: standingsData.F[1].team, label: '1E vs 2F' },
    { id: 6, home: standingsData.F[0].team, away: standingsData.G[1].team, label: '1F vs 2G' },
    { id: 7, home: standingsData.G[0].team, away: standingsData.H[2].team, label: '1G vs 3H/I/J' },
    { id: 8, home: standingsData.H[0].team, away: standingsData.I[1].team, label: '1H vs 2I' },
    { id: 9, home: standingsData.I[0].team, away: standingsData.J[1].team, label: '1I vs 2J' },
    { id: 10, home: standingsData.J[0].team, away: standingsData.K[2].team, label: '1J vs 3K/L/A' },
    { id: 11, home: standingsData.K[0].team, away: standingsData.L[1].team, label: '1K vs 2L' },
    { id: 12, home: standingsData.L[0].team, away: standingsData.A[1].team, label: '1L vs 2A' },
    { id: 13, home: standingsData.A[1].team, away: standingsData.B[1].team, label: '2A vs 2B' },
    { id: 14, home: standingsData.E[1].team, away: standingsData.D[2].team, label: '2E vs 3C/D/E' },
    { id: 15, home: standingsData.G[2].team, away: standingsData.H[1].team, label: '3F/G/H vs 2H' },
    { id: 16, home: standingsData.I[2].team, away: standingsData.K[1].team, label: '3I/J/K vs 2K' },
  ];

  const leftSide = matchups.slice(0, 8);
  const rightSide = matchups.slice(8, 16);

  const MatchNode = ({ match }) => (
    <div className="glass bracket-match">
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{match.label}</div>
      <div className="team-row" style={{ marginBottom: '8px' }}>
        <div className="team-info" style={{ fontSize: '1rem' }}>
          <span className="flag" style={{ fontSize: '1.2rem' }}>{match.home.flag}</span>
          <span>{match.home.name}</span>
        </div>
      </div>
      <div className="team-row">
        <div className="team-info" style={{ fontSize: '1rem' }}>
          <span className="flag" style={{ fontSize: '1.2rem' }}>{match.away.flag}</span>
          <span>{match.away.name}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '5px' }}>16avos de Final Simulados</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Con el nuevo formato de 48 equipos (Top 2 + Mejores 8 Terceros)</p>
      </div>

      <div className="bracket-container" style={{ paddingBottom: '40px' }}>
        {/* Left Side */}
        <div className="bracket-round">
          {leftSide.map(match => <MatchNode key={match.id} match={match} />)}
        </div>

        {/* Center / Trophy Area placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px', flexDirection: 'column' }}>
          <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(255, 204, 0, 0.5))' }}>🏆</div>
          <div style={{ marginTop: '10px', color: 'var(--warning)', fontWeight: 'bold' }}>2026</div>
        </div>

        {/* Right Side */}
        <div className="bracket-round">
          {rightSide.map(match => <MatchNode key={match.id} match={match} />)}
        </div>
      </div>
    </div>
  );
};

export default BracketSimulator;
